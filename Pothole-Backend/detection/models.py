from django.db import models


class DetectionResult(models.Model):
    """Stores each pothole detection request and its outcome."""

    class InputType(models.TextChoices):
        UPLOAD = 'upload', 'File Upload'
        URL    = 'url',    'Image URL'

    # Input
    input_type      = models.CharField(max_length=10, choices=InputType.choices)
    input_image     = models.ImageField(upload_to='detections/input/', blank=True, null=True)
    input_image_url = models.URLField(blank=True, null=True)

    # Output
    annotated_image = models.ImageField(upload_to='detections/output/', blank=True, null=True)
    pothole_count   = models.PositiveIntegerField(default=0)
    detections_json = models.JSONField(default=list)
    """
    detections_json structure:
    [
      {
        "label": "pothole",
        "confidence": 0.92,
        "bbox": [x1, y1, x2, y2]
      },
      ...
    ]
    """

    # Meta
    created_at      = models.DateTimeField(auto_now_add=True)
    processing_time = models.FloatField(help_text='Inference time in seconds', null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Detection Result'
        verbose_name_plural = 'Detection Results'

    def __str__(self):
        return f"Detection #{self.pk} — {self.pothole_count} pothole(s) [{self.created_at:%Y-%m-%d %H:%M}]"