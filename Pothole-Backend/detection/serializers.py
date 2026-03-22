from rest_framework import serializers
from .models import DetectionResult


class DetectionRequestSerializer(serializers.Serializer):
    """Validates incoming detection requests (upload or URL)."""
    image      = serializers.ImageField(required=False)
    image_url  = serializers.URLField(required=False)

    def validate(self, attrs):
        if not attrs.get('image') and not attrs.get('image_url'):
            raise serializers.ValidationError(
                "Provide either 'image' (file upload) or 'image_url'."
            )
        if attrs.get('image') and attrs.get('image_url'):
            raise serializers.ValidationError(
                "Provide only one of 'image' or 'image_url', not both."
            )
        return attrs


class DetectionResultSerializer(serializers.ModelSerializer):
    """Serialises a stored DetectionResult for API responses."""
    annotated_image_url = serializers.SerializerMethodField()

    class Meta:
        model  = DetectionResult
        fields = [
            'id',
            'input_type',
            'input_image_url',
            'annotated_image_url',
            'pothole_count',
            'detections_json',
            'processing_time',
            'created_at',
        ]

    def get_annotated_image_url(self, obj):
        request = self.context.get('request')
        if obj.annotated_image and request:
            return request.build_absolute_uri(obj.annotated_image.url)
        return None