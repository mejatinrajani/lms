from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'schools', views.SchoolViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'students', views.StudentProfileViewSet)
router.register(r'teachers', views.TeacherProfileViewSet)
router.register(r'parents', views.ParentProfileViewSet)
router.register(r'principals', views.PrincipalProfileViewSet)
router.register(r'classes', views.ClassViewSet)
router.register(r'sections', views.SectionViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'audit-logs', views.AuditLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'schools', views.SchoolViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'students', views.StudentProfileViewSet)
router.register(r'teachers', views.TeacherProfileViewSet)
router.register(r'parents', views.ParentProfileViewSet)
router.register(r'principals', views.PrincipalProfileViewSet)
router.register(r'classes', views.ClassViewSet)
router.register(r'sections', views.SectionViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'audit-logs', views.AuditLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
]
