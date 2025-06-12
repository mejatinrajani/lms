from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Avg
from .models import ExamType, Exam, Mark, AcademicYear, ClassSubject
from core.models import Class, Section, StudentProfile, Subject
from .serializers import (
    ExamTypeSerializer, ExamSerializer, MarkSerializer, AcademicYearSerializer, 
    ClassSubjectSerializer, ClassSerializer, SectionSerializer, SubjectSerializer,
    StudentProfileSerializer
)
from core.permissions import IsDeveloper, IsPrincipal, IsTeacher, IsStudent, IsParent

class SubjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClassViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated]

class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [permissions.IsAuthenticated]

class ExamTypeViewSet(viewsets.ModelViewSet):
    queryset = ExamType.objects.all()
    serializer_class = ExamTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal | IsTeacher]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.is_student:
            student_profile = user.studentprofile
            queryset = queryset.filter(
                class_assigned=student_profile.class_assigned,
                section=student_profile.section
            )
        elif user.is_teacher:
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(
                Q(subject__in=teacher_profile.subjects.all()) |
                Q(class_assigned__sections__in=teacher_profile.sections.all())
            )
        elif user.is_parent:
            children = user.parentprofile.children.all()
            queryset = queryset.filter(
                class_assigned__in=[child.class_assigned for child in children],
                section__in=[child.section for child in children]
            )
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class MarkViewSet(viewsets.ModelViewSet):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsTeacher | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.is_student:
            queryset = queryset.filter(student=user.studentprofile)
        elif user.is_teacher:
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(teacher=teacher_profile)
        elif user.is_parent:
            children = user.parentprofile.children.all()
            queryset = queryset.filter(student__in=children)
        
        return queryset

    @action(detail=False, methods=['get'])
    def student_performance(self, request):
        """Get performance statistics for students"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'student_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        marks = self.get_queryset().filter(student_id=student_id)
        
        performance_data = {
            'total_exams': marks.count(),
            'average_percentage': marks.aggregate(avg=Avg('marks_obtained'))['avg'] or 0,
            'subjects': {}
        }
        
        for mark in marks:
            subject = mark.exam.subject.name
            if subject not in performance_data['subjects']:
                performance_data['subjects'][subject] = []
            performance_data['subjects'][subject].append({
                'exam_type': mark.exam.exam_type.name,
                'marks_obtained': mark.marks_obtained,
                'max_marks': mark.exam.max_marks,
                'percentage': mark.percentage,
                'grade': mark.grade
            })
        
        return Response(performance_data)

class AcademicYearViewSet(viewsets.ModelViewSet):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class ClassSubjectViewSet(viewsets.ModelViewSet):
    queryset = ClassSubject.objects.all()
    serializer_class = ClassSubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.is_teacher:
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(teacher=teacher_profile)
        elif user.is_student:
            student_profile = user.studentprofile
            queryset = queryset.filter(
                class_assigned=student_profile.class_assigned,
                section=student_profile.section
            )
        
        return queryset

