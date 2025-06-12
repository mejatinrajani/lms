from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TimeSlotViewSet, TimetableViewSet

router = DefaultRouter()
router.register(r'time-slots', TimeSlotViewSet)
router.register(r'timetables', TimetableViewSet)

urlpatterns = [
    path('', include(router.urls)),
]