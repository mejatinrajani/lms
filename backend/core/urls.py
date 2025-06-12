from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'schools', views.SchoolViewSet)
router.register(r'classes', views.ClassViewSet)
router.register(r'sections', views.SectionViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'teachers', views.TeacherProfileViewSet)
router.register(r'students', views.StudentProfileViewSet)
router.register(r'parents', views.ParentProfileViewSet)
router.register(r'audit-logs', views.AuditLogViewSet)
router.register(r'dashboard', views.DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]