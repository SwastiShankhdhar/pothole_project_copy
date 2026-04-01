import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile

from .models import DetectionResult
from .serializers import DetectionRequestSerializer, DetectionResultSerializer
from .yolo_services import load_image_from_file, load_image_from_url, load_image_from_bytes, run_inference
from .geocoding_service import reverse_geocode, calculate_severity


class DetectPotholeView(APIView):
    """
    POST /api/detection/detect/

    Accepts:
      - multipart/form-data  → field: image (file upload)
      - application/json     → field: image_url
      - application/json     → field: image_base64 (for camera) + latitude + longitude

    Returns:
      - annotated_image_url : absolute URL to the annotated image
      - pothole_count       : number of potholes detected
      - detections_json     : list of {label, confidence, bbox}
      - processing_time     : inference time in seconds
      - severity            : overall severity level
      - address             : reverse geocoded address
    """

    def post(self, request):
        serializer = DetectionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # ── Load image from different sources ─────────────────────────────────
        try:
            if data.get('image'):
                # File upload
                image_bgr = load_image_from_file(data['image'])
                input_type = DetectionResult.InputType.UPLOAD
                input_image = data['image']
                input_image_url = None
                
            elif data.get('image_url'):
                # URL upload
                image_bgr = load_image_from_url(data['image_url'])
                input_type = DetectionResult.InputType.URL
                input_image = None
                input_image_url = data['image_url']
                
            elif data.get('latitude') is not None and data.get('longitude') is not None:
                # Camera input with base64 image - need to get image from request
                # Image should be in request.FILES or as base64 in data
                if request.FILES.get('image'):
                    image_bgr = load_image_from_file(request.FILES['image'])
                    input_image = request.FILES['image']
                elif request.data.get('image_base64'):
                    # Decode base64 image
                    base64_str = request.data['image_base64']
                    # Remove data URL prefix if present
                    if ',' in base64_str:
                        base64_str = base64_str.split(',')[1]
                    image_bytes = base64.b64decode(base64_str)
                    image_bgr = load_image_from_bytes(image_bytes)
                    input_image = ContentFile(image_bytes, name=f"camera_{uuid.uuid4().hex}.jpg")
                else:
                    return Response(
                        {'error': 'Camera detection requires image file or image_base64'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                input_type = DetectionResult.InputType.CAMERA
                input_image_url = None
                
            else:
                return Response(
                    {'error': 'No valid image source provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
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

        # ── Get geocoded address if coordinates provided ─────────────────────
        address = None
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        
        if latitude and longitude:
            address = reverse_geocode(latitude, longitude)

        # ── Determine severity ───────────────────────────────────────────────
        severity = result.get('severity', 'medium')
        
        # Override with custom severity if provided
        if data.get('severity'):
            severity = data['severity']

        # ── Persist to DB ─────────────────────────────────────────────────────
        record = DetectionResult(
            input_type=input_type,
            input_image_url=input_image_url,
            pothole_count=result['pothole_count'],
            detections_json=result['detections'],
            processing_time=result['processing_time'],
            # Geotagging fields
            latitude=latitude,
            longitude=longitude,
            address=address,
            severity=severity,
            session_id=data.get('session_id', ''),
            status='detected',
        )
        
        if input_image:
            record.input_image.save(input_image.name, input_image, save=False)
            
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
        except DetectionResult.DetectionResult.DoesNotExist:
            return Response({'error': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DetectionResultSerializer(record, context={'request': request})
        return Response(serializer.data)


# ── NEW: Camera-specific endpoints ────────────────────────────────────────────

class CameraDetectionView(APIView):
    """
    POST /api/detection/camera/
    Specialized endpoint for live camera detection with geotagging
    
    Accepts:
      - image: file (multipart/form-data)
      - image_base64: base64 string
      - latitude: float
      - longitude: float
      - session_id: string (optional)
    
    Returns:
      - detected: boolean
      - severity: string
      - confidence: float
      - address: string
      - bbox: array
    """
    
    def post(self, request):
        try:
            # Extract data
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            session_id = request.data.get('session_id', '')
            
            # Get image
            image_bgr = None
            if request.FILES.get('image'):
                image_bgr = load_image_from_file(request.FILES['image'])
                image_file = request.FILES['image']
            elif request.data.get('image_base64'):
                base64_str = request.data['image_base64']
                if ',' in base64_str:
                    base64_str = base64_str.split(',')[1]
                image_bytes = base64.b64decode(base64_str)
                image_bgr = load_image_from_bytes(image_bytes)
                image_file = ContentFile(image_bytes, name=f"camera_{uuid.uuid4().hex}.jpg")
            else:
                return Response(
                    {'error': 'No image provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Run inference
            result = run_inference(image_bgr)
            
            # Get geocoded address
            address = None
            if latitude and longitude:
                address = reverse_geocode(float(latitude), float(longitude))
            
            # Determine if pothole detected
            detected = result['pothole_count'] > 0
            severity = result['severity'] if detected else None
            confidence = result['highest_confidence'] if detected else 0
            
            # Save to database if pothole detected
            pothole_id = None
            if detected:
                record = DetectionResult(
                    input_type=DetectionResult.InputType.CAMERA,
                    pothole_count=result['pothole_count'],
                    detections_json=result['detections'],
                    processing_time=result['processing_time'],
                    latitude=float(latitude) if latitude else None,
                    longitude=float(longitude) if longitude else None,
                    address=address,
                    severity=severity,
                    session_id=session_id,
                    status='detected',
                )
                
                record.input_image.save(image_file.name, image_file, save=False)
                record.annotated_image.save(
                    result['annotated_image_file'].name,
                    result['annotated_image_file'],
                    save=False,
                )
                record.save()
                pothole_id = record.id
            
            # Return simplified response for frontend
            return Response({
                'detected': detected,
                'pothole_id': pothole_id,
                'severity': severity,
                'confidence': confidence,
                'address': address,
                'pothole_count': result['pothole_count'],
                'bbox': result['detections'][0]['bbox'] if detected and result['detections'] else None,
                'message': f"⚠️ Pothole detected! Severity: {severity}" if detected else "No pothole detected",
            })
            
        except Exception as e:
            print(f"Camera detection error: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
