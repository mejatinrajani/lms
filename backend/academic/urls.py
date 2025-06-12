from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExamTypeViewSet, ExamViewSet, MarkViewSet, AcademicYearViewSet, ClassSubjectViewSet,
    ClassViewSet, SectionViewSet, SubjectViewSet
)

router = DefaultRouter()
router.register(r'exam-types', ExamTypeViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'marks', MarkViewSet)
router.register(r'academic-years', AcademicYearViewSet)
router.register(r'class-subjects', ClassSubjectViewSet)
router.register(r'classes', ClassViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'subjects', SubjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]