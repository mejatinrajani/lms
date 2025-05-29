
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# Add resource viewsets here when created

urlpatterns = [
    path('', include(router.urls)),
]
