from django.urls import path
from .views import DetectPotholeView, DetectionHistoryView, DetectionDetailView

app_name = 'detection'

urlpatterns = [
    path('detect/',       DetectPotholeView.as_view(),   name='detect'),
    path('history/',      DetectionHistoryView.as_view(), name='history'),
    path('<int:pk>/',     DetectionDetailView.as_view(),  name='detail'),
]