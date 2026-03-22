"""
yolo_service.py
---------------
Encapsulates all YOLO / Ultralytics inference logic.
Views stay thin; all ML work happens here.
"""
import time
import uuid
import requests
import numpy as np
from pathlib import Path
from io import BytesIO

import cv2
from PIL import Image
from ultralytics import YOLO

from django.conf import settings
from django.core.files.base import ContentFile


# ── Model singleton ──────────────────────────────────────────────────────────
_model = None


def get_model() -> YOLO:
    """Load the YOLO model once and reuse across requests."""
    global _model
    if _model is None:
        model_path = settings.MODEL_PATH
        if not Path(model_path).exists():
            raise FileNotFoundError(
                f"YOLO weights not found at '{model_path}'. "
                "Set MODEL_PATH in your .env file."
            )
        _model = YOLO(str(model_path))
    return _model


# ── Image loaders ────────────────────────────────────────────────────────────

def load_image_from_file(django_file) -> np.ndarray:
    """Convert a Django InMemoryUploadedFile → OpenCV BGR ndarray."""
    pil_img = Image.open(django_file).convert('RGB')
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)


def load_image_from_url(url: str) -> np.ndarray:
    """Download an image from a URL → OpenCV BGR ndarray."""
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    img_array = np.frombuffer(response.content, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(f"Could not decode image from URL: {url}")
    return img


# ── Core inference ────────────────────────────────────────────────────────────

def run_inference(image_bgr: np.ndarray) -> dict:
    """
    Run YOLO inference on a BGR ndarray.

    Returns:
        {
            "detections": [{"label": str, "confidence": float, "bbox": [x1,y1,x2,y2]}, ...],
            "annotated_image_file": ContentFile,   # JPEG bytes wrapped for Django storage
            "pothole_count": int,
            "processing_time": float,              # seconds
        }
    """
    model = get_model()

    start = time.time()
    results = model(image_bgr)
    elapsed = round(time.time() - start, 4)

    detections = []
    annotated_bgr = results[0].plot()  # draw bboxes on a copy

    for box in results[0].boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf  = round(float(box.conf[0]), 4)
        label = model.names[int(box.cls[0])]
        detections.append({
            'label':      label,
            'confidence': conf,
            'bbox':       [round(x1), round(y1), round(x2), round(y2)],
        })

    # Encode annotated image as JPEG ContentFile
    _, buffer = cv2.imencode('.jpg', annotated_bgr)
    filename  = f"{uuid.uuid4().hex}.jpg"
    img_file  = ContentFile(buffer.tobytes(), name=filename)

    return {
        'detections':           detections,
        'annotated_image_file': img_file,
        'pothole_count':        len(detections),
        'processing_time':      elapsed,
    }