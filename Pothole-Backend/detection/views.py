""" ERROR -What this error actually means
Import ".yolo_service" could not be resolved

This happens when:

You are using a relative import (.)
But Python doesn’t recognize your folder as a package
🧠 Key concept (very important)
Relative import:
from .yolo_service import something

👉 This ONLY works if:

Your file is inside a package
And the package has __init__.py"""


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import DetectionResult
from .serializers import DetectionRequestSerializer, DetectionResultSerializer
from .yolo_services import load_image_from_file, load_image_from_url, run_inference


class DetectPotholeView(APIView):
    """
    POST /api/detection/detect/

    Accepts:
      - multipart/form-data  → field: image  (file upload)
      - application/json     → field: image_url

    Returns:
      - annotated_image_url : absolute URL to the annotated image
      - pothole_count       : number of potholes detected
      - detections_json     : list of {label, confidence, bbox}
      - processing_time     : inference time in seconds
    """

    def post(self, request):
        serializer = DetectionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # ── Load image ────────────────────────────────────────────────────────
        try:
            if data.get('image'):
                image_bgr  = load_image_from_file(data['image'])
                input_type = DetectionResult.InputType.UPLOAD
            else:
                image_bgr  = load_image_from_url(data['image_url'])
                input_type = DetectionResult.InputType.URL
        except Exception as exc:
            return Response(
                {'error': f'Failed to load image: {str(exc)}'},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        # ── Run YOLO inference ────────────────────────────────────────────────
        try:
            result = run_inference(image_bgr)
        except FileNotFoundError as exc:
            return Response({'error': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as exc:
            return Response(
                {'error': f'Inference failed: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # ── Persist to DB ─────────────────────────────────────────────────────
        record = DetectionResult(
            input_type      = input_type,
            input_image_url = data.get('image_url'),
            pothole_count   = result['pothole_count'],
            detections_json = result['detections'],
            processing_time = result['processing_time'],
        )
        if data.get('image'):
            record.input_image.save(data['image'].name, data['image'], save=False)
        record.annotated_image.save(
            result['annotated_image_file'].name,
            result['annotated_image_file'],
            save=False,
        )
        record.save()

        # ── Respond ───────────────────────────────────────────────────────────
        out = DetectionResultSerializer(record, context={'request': request})
        return Response(out.data, status=status.HTTP_201_CREATED)


class DetectionHistoryView(APIView):
    """
    GET /api/detection/history/
    Returns the last 50 detection records.
    """

    def get(self, request):
        records = DetectionResult.objects.all()[:50]
        serializer = DetectionResultSerializer(
            records, many=True, context={'request': request}
        )
        return Response(serializer.data)


class DetectionDetailView(APIView):
    """
    GET /api/detection/<pk>/
    Returns a single detection record.
    """

    def get(self, request, pk):
        try:
            record = DetectionResult.objects.get(pk=pk)
        except DetectionResult.DoesNotExist:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DetectionResultSerializer(record, context={'request': request})
        return Response(serializer.data)