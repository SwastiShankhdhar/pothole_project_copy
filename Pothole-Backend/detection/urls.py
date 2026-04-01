from django.urls import path
from . import views

app_name = 'detection'

urlpatterns = [
    path('detect/', views.DetectPotholeView.as_view(), name='detect'),
    path('camera/', views.CameraDetectionView.as_view(), name='camera-detect'),  # NEW
    path('history/', views.DetectionHistoryView.as_view(), name='history'),
    path('<int:pk>/', views.DetectionDetailView.as_view(), name='detail'),
]
