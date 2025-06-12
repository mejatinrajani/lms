
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q, F
from django.http import FileResponse
from .models import Resource, ResourceCategory
from .serializers import ResourceSerializer, ResourceCategorySerializer
from core.permissions import IsDeveloper, IsPrincipal, IsTeacher, IsStudent, IsParent

class ResourceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ResourceCategory.objects.all()
    serializer_class = ResourceCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal | IsTeacher]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

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
            student_profile = user.studentprofile
            queryset = queryset.filter(
                Q(is_public=True) |
                Q(class_assigned=student_profile.class_assigned) |
                Q(section=student_profile.section)
            )
        elif user.is_parent:
            children = user.parentprofile.children.all()
            child_classes = [child.class_assigned for child in children]
            child_sections = [child.section for child in children]
            
            queryset = queryset.filter(
                Q(is_public=True) |
                Q(class_assigned__in=child_classes) |
                Q(section__in=child_sections)
            )
        elif user.is_teacher:
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(
                Q(uploaded_by=teacher_profile) |
                Q(is_public=True) |
                Q(subject__in=teacher_profile.subjects.all()) |
                Q(section__in=teacher_profile.sections.all())
            )
        
        # Filter by subject, class, section if provided
        subject_id = self.request.query_params.get('subject')
        class_id = self.request.query_params.get('class')
        section_id = self.request.query_params.get('section')
        
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if class_id:
            queryset = queryset.filter(class_assigned_id=class_id)
        if section_id:
            queryset = queryset.filter(section_id=section_id)
        
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user.teacherprofile)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download a resource file"""
        resource = self.get_object()
        
        # Increment download count
        Resource.objects.filter(pk=resource.pk).update(download_count=F('download_count') + 1)
        
        try:
            response = FileResponse(
                resource.file.open('rb'),
                as_attachment=True,
                filename=resource.file.name.split('/')[-1]
            )
            return response
        except Exception as e:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
