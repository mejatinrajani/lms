
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourceViewSet, ResourceCategoryViewSet

router = DefaultRouter()
router.register(r'resources', ResourceViewSet)
router.register(r'categories', ResourceCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
