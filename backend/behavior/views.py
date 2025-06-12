from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Sum
from .models import BehaviorLog, BehaviorCategory
from .serializers import BehaviorLogSerializer, BehaviorCategorySerializer
from core.permissions import IsDeveloper, IsPrincipal, IsTeacher, IsStudent, IsParent

class BehaviorCategoryViewSet(viewsets.ModelViewSet):
    queryset = BehaviorCategory.objects.all()
    serializer_class = BehaviorCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class BehaviorLogViewSet(viewsets.ModelViewSet):
    queryset = BehaviorLog.objects.all()
    serializer_class = BehaviorLogSerializer
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
        elif user.is_parent:
            children = user.parentprofile.children.all()
            queryset = queryset.filter(student__in=children)
        elif user.is_teacher:
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(
                Q(reported_by=teacher_profile) |
                Q(student__section__in=teacher_profile.sections.all())
            )
        
        return queryset.order_by('-date_occurred', '-created_at')

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user.teacherprofile)

    @action(detail=False, methods=['get'])
    def student_summary(self, request):
        """Get behavior summary for a student"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'student_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        logs = self.get_queryset().filter(student_id=student_id)
        
        summary = {
            'total_logs': logs.count(),
            'by_severity': {},
            'total_points': logs.aggregate(total=Sum('category__points'))['total'] or 0,
            'recent_logs': BehaviorLogSerializer(logs[:5], many=True).data
        }
        
        # Group by severity
        for severity in ['minor', 'moderate', 'major', 'severe']:
            summary['by_severity'][severity] = logs.filter(severity=severity).count()
        
        return Response(summary)