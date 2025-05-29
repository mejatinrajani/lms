
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/core/', include('core.urls')),
    path('api/academic/', include('academic.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/assignments/', include('assignments.urls')),
    path('api/behavior/', include('behavior.urls')),
    path('api/communications/', include('communications.urls')),
    path('api/fees/', include('fees.urls')),
    path('api/notices/', include('notices.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/resources/', include('resources.urls')),
    path('api/timetable/', include('timetable.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
