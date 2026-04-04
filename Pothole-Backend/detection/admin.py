from django.contrib import admin
from .models import DetectionResult


@admin.register(DetectionResult)
class DetectionResultAdmin(admin.ModelAdmin):
    list_display  = ('id', 'input_type', 'pothole_count', 'processing_time', 'created_at')
    list_filter   = ('input_type',)
    readonly_fields = ('detections_json', 'annotated_image', 'processing_time', 'created_at')
    ordering      = ('-created_at',)