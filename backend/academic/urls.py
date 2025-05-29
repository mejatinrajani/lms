from django.urls import path
from .views import ClassListView, SubjectListView, students_in_class

urlpatterns = [
    path('classes/', ClassListView.as_view(), name='class-list'),
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('students/<int:class_id>/', students_in_class, name='students-in-class'),
]