from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BehaviorLogViewSet, BehaviorCategoryViewSet

router = DefaultRouter()
router.register(r'logs', BehaviorLogViewSet)
router.register(r'categories', BehaviorCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]