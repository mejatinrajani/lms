from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q, Count
from django.utils import timezone
from .models import Assignment, AssignmentSubmission, AssignmentResource
from .serializers import AssignmentSerializer, SubmissionSerializer, AssignmentResourceSerializer
from core.permissions import IsDeveloper, IsPrincipal, IsTeacher, IsStudent, IsParent

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
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
                class_assigned=student_profile.class_assigned,
                section=student_profile.section,
                is_active=True
            )
        elif user.is_teacher:
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(teacher=teacher_profile)
        elif user.is_parent:
            children = user.parentprofile.children.all()
            queryset = queryset.filter(
                class_assigned__in=[child.class_assigned for child in children],
                section__in=[child.section for child in children],
                is_active=True
            )

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user.teacherprofile)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_resource(self, request, pk=None):
        """Upload resource files for assignment"""
        assignment = self.get_object()
        file = request.FILES.get('file')

        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        resource = AssignmentResource.objects.create(
            assignment=assignment,
            file=file,
            filename=file.name,
            file_size=file.size
        )

        serializer = AssignmentResourceSerializer(resource)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        """Get all submissions for an assignment"""
        assignment = self.get_object()
        submissions = assignment.submissions.all()
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get statistics for an assignment"""
        assignment = self.get_object()

        total_students = assignment.section.studentprofile_set.count()
        submitted_count = assignment.submissions.count()
        graded_count = assignment.submissions.filter(marks_obtained__isnull=False).count()
        late_submissions = assignment.submissions.filter(is_late=True).count()

        stats = {
            'total_students': total_students,
            'submitted_count': submitted_count,
            'pending_submissions': total_students - submitted_count,
            'graded_count': graded_count,
            'pending_grading': submitted_count - graded_count,
            'late_submissions': late_submissions,
            'submission_rate': (submitted_count / total_students * 100) if total_students > 0 else 0
        }

        return Response(stats)

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = AssignmentSubmission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.is_student:
            queryset = queryset.filter(student=user.studentprofile)
        elif user.is_teacher:
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(assignment__teacher=teacher_profile)
        elif user.is_parent:
            children = user.parentprofile.children.all()
            queryset = queryset.filter(student__in=children)

        return queryset.order_by('-submitted_at')

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsStudent]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsTeacher | IsPrincipal]
        elif self.action == 'destroy':
            permission_classes = [IsStudent | IsTeacher | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        """Grade a submission"""
        submission = self.get_object()
        marks = request.data.get('marks_obtained')
        feedback = request.data.get('feedback', '')

        if marks is None:
            return Response({'error': 'marks_obtained is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            marks = float(marks)
            if marks < 0 or marks > submission.assignment.max_marks:
                return Response({
                    'error': f'Marks must be between 0 and {submission.assignment.max_marks}'
                }, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid marks value'}, status=status.HTTP_400_BAD_REQUEST)

        submission.marks_obtained = marks
        submission.feedback = feedback
        submission.graded_by = request.user.teacherprofile
        submission.graded_at = timezone.now()
        submission.save()

        serializer = self.get_serializer(submission)
        return Response(serializer.data)