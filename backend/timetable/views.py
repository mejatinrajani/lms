from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import TimeSlot, Timetable, TeacherAvailability
from .serializers import TimeSlotSerializer, TimetableSerializer, TeacherAvailabilitySerializer
from core.models import Class
from core.permissions import IsTeacherOrPrincipal

@api_view(['GET'])
def timetable_status(request):
    return Response({'status': 'Timetable module is working'})

class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrPrincipal]
    
    def get_queryset(self):
        return TimeSlot.objects.filter(school=self.request.user.get_school())

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['principal', 'teacher']:
            return Timetable.objects.filter(school=user.get_school())
        elif user.role == 'student':
            return Timetable.objects.filter(class_assigned=user.student_profile.class_assigned)
        elif user.role == 'parent':
            student_classes = user.parent_profile.children.values_list('class_assigned', flat=True)
            return Timetable.objects.filter(class_assigned__in=student_classes)
        return Timetable.objects.none()
    
    @action(detail=False, methods=['get'])
    def by_class(self, request):
        class_id = request.query_params.get('class_id')
        day = request.query_params.get('day')
        
        queryset = self.get_queryset()
        if class_id:
            queryset = queryset.filter(class_assigned_id=class_id)
        if day:
            queryset = queryset.filter(day_of_week=day)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_teacher(self, request):
        teacher_id = request.query_params.get('teacher_id')
        day = request.query_params.get('day')
        
        queryset = self.get_queryset()
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if day:
            queryset = queryset.filter(day_of_week=day)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class TeacherAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = TeacherAvailability.objects.all()
    serializer_class = TeacherAvailabilitySerializer
    permission_classes = [IsAuthenticated, IsTeacherOrPrincipal]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'principal':
            return TeacherAvailability.objects.filter(teacher__school=user.get_school())
        elif user.role == 'teacher':
            return TeacherAvailability.objects.filter(teacher__user=user)
        return TeacherAvailability.objects.none()