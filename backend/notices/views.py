
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django.utils import timezone
from .models import Notice, NoticeCategory, NoticeAttachment
from .serializers import NoticeSerializer, NoticeCategorySerializer, NoticeAttachmentSerializer
from core.permissions import IsDeveloper, IsPrincipal, IsTeacher, IsStudent, IsParent

class NoticeCategoryViewSet(viewsets.ModelViewSet):
    queryset = NoticeCategory.objects.all()
    serializer_class = NoticeCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal | IsTeacher]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset().filter(
            is_published=True,
            publish_date__lte=timezone.now()
        )
        
        user = self.request.user
        
        if user.is_student:
            student_profile = user.studentprofile
            queryset = queryset.filter(
                Q(is_global=True) |
                Q(target_roles__contains=['STUDENT']) |
                Q(target_classes=student_profile.class_assigned) |
                Q(target_sections=student_profile.section)
            )
        elif user.is_parent:
            children = user.parentprofile.children.all()
            child_classes = [child.class_assigned for child in children]
            child_sections = [child.section for child in children]
            
            queryset = queryset.filter(
                Q(is_global=True) |
                Q(target_roles__contains=['PARENT']) |
                Q(target_classes__in=child_classes) |
                Q(target_sections__in=child_sections)
            )
        elif user.is_teacher:
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(
                Q(is_global=True) |
                Q(target_roles__contains=['TEACHER']) |
                Q(target_sections__in=teacher_profile.sections.all()) |
                Q(created_by=user)
            )
        elif user.is_principal or user.is_developer:
            # Principals and developers can see all notices
            pass
        
        return queryset.distinct().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_attachment(self, request, pk=None):
        """Upload attachment for notice"""
        notice = self.get_object()
        file = request.FILES.get('file')
        
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        attachment = NoticeAttachment.objects.create(
            notice=notice,
            file=file,
            filename=file.name,
            file_size=file.size
        )
        
        serializer = NoticeAttachmentSerializer(attachment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
