from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def academic_status(request):
    return Response({'status': 'Academic module is working'})

from rest_framework import generics, permissions
from django.db.models import Avg, Count
from .models import Exam, Grade, Timetable
from .serializers import ExamSerializer, GradeSerializer, TimetableSerializer

class ExamListCreateView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Exam.objects.select_related('class_assigned', 'subject', 'created_by')
        
        user = self.request.user
        if user.role == 'teacher':
            queryset = queryset.filter(created_by=user)
        elif user.role == 'student':
            if hasattr(user, 'student_profile'):
                queryset = queryset.filter(class_assigned=user.student_profile.class_assigned)
        elif user.role == 'parent':
            if hasattr(user, 'parent_profile'):
                children_classes = user.parent_profile.children.values_list('class_assigned', flat=True)
                queryset = queryset.filter(class_assigned__in=children_classes)
        
        return queryset.order_by('-date')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class GradeListCreateView(generics.ListCreateAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Grade.objects.select_related('student__user', 'exam', 'graded_by')
        
        user = self.request.user
        if user.role == 'teacher':
            queryset = queryset.filter(graded_by=user)
        elif user.role == 'student':
            if hasattr(user, 'student_profile'):
                queryset = queryset.filter(student=user.student_profile)
        elif user.role == 'parent':
            if hasattr(user, 'parent_profile'):
                children_ids = user.parent_profile.children.values_list('id', flat=True)
                queryset = queryset.filter(student_id__in=children_ids)
        
        return queryset.order_by('-graded_at')
    
    def perform_create(self, serializer):
        serializer.save(graded_by=self.request.user)

class TimetableListCreateView(generics.ListCreateAPIView):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Timetable.objects.select_related('class_assigned', 'subject', 'teacher')
        
        user = self.request.user
        if user.role == 'teacher':
            queryset = queryset.filter(teacher=user)
        elif user.role == 'student':
            if hasattr(user, 'student_profile'):
                queryset = queryset.filter(class_assigned=user.student_profile.class_assigned)
        elif user.role == 'parent':
            if hasattr(user, 'parent_profile'):
                children_classes = user.parent_profile.children.values_list('class_assigned', flat=True)
                queryset = queryset.filter(class_assigned__in=children_classes)
        
        return queryset.order_by('weekday', 'start_time')