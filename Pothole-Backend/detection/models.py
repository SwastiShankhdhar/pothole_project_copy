from django.db import models

class DetectionResult(models.Model):
    """Stores each pothole detection request and its outcome."""

    class InputType(models.TextChoices):
        UPLOAD = 'upload', 'File Upload'
        URL    = 'url',    'Image URL'
        CAMERA = 'camera', 'Live Camera'  # NEW: Camera input type

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

    # NEW: Geotagging fields
    latitude = models.FloatField(null=True, blank=True, help_text="Latitude of detection")
    longitude = models.FloatField(null=True, blank=True, help_text="Longitude of detection")
    address = models.TextField(blank=True, null=True, help_text="Reverse geocoded address")
    session_id = models.CharField(max_length=100, blank=True, null=True, help_text="Detection session ID")

    # NEW: Severity classification
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='medium')
    
    # NEW: Status tracking
    STATUS_CHOICES = [
        ('detected', 'Detected'),
        ('verified', 'Verified'),
        ('repaired', 'Repaired'),
        ('false_positive', 'False Positive'),
    ]
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='detected')

    # Meta
    created_at      = models.DateTimeField(auto_now_add=True)
    processing_time = models.FloatField(help_text='Inference time in seconds', null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Detection Result'
        verbose_name_plural = 'Detection Results'

    def __str__(self):
        location_str = f" at ({self.latitude}, {self.longitude})" if self.latitude else ""
        return f"Detection #{self.pk} — {self.pothole_count} pothole(s){location_str} [{self.created_at:%Y-%m-%d %H:%M}]"
