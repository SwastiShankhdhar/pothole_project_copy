from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Module 1 – Detection
    path('api/detection/', include('detection.urls')),

    # Module 2 – Geolocation (future)
    path('api/geolocation/', include('geolocation.urls')),

    # Module 3 – Reporting (future)
    path('api/reporting/', include('reporting.urls')),

    # DRF session auth login/logout
    path('api/auth/', include('rest_framework.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)