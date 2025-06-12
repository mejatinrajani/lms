
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeeTypeViewSet, FeeStructureViewSet, FeeRecordViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'types', FeeTypeViewSet)
router.register(r'structures', FeeStructureViewSet)
router.register(r'records', FeeRecordViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
