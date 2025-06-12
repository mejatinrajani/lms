from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceRecordViewSet, AttendanceStatusViewSet

router = DefaultRouter()
router.register(r'attendance', AttendanceRecordViewSet, basename='attendance')
router.register(r'statuses', AttendanceStatusViewSet, basename='attendancestatus')

urlpatterns = [
    path('', include(router.urls)),
]