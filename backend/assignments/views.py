from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Avg, Q
from .models import Assignment, AssignmentSubmission
from .serializers import (AssignmentSerializer, AssignmentSubmissionSerializer,
                         AssignmentSubmissionCreateSerializer, AssignmentGradingSerializer)
from core.models import StudentProfile

class AssignmentListCreateView(generics.ListCreateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Assignment.objects.select_related('teacher', 'class_assigned', 'subject')
        
        # Filter based on user role
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
        
        # Additional filters
        class_id = self.request.query_params.get('class', None)
        subject_id = self.request.query_params.get('subject', None)
        status_filter = self.request.query_params.get('status', None)
        
        if class_id:
            queryset = queryset.filter(class_assigned_id=class_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssignmentSubmissionListCreateView(generics.ListCreateAPIView):
    queryset = AssignmentSubmission.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AssignmentSubmissionCreateSerializer
        return AssignmentSubmissionSerializer
    
    def get_queryset(self):
        queryset = AssignmentSubmission.objects.select_related(
            'assignment', 'student__user', 'graded_by'
        )
        
        user = self.request.user
        if user.role == 'student':
            if hasattr(user, 'student_profile'):
                queryset = queryset.filter(student=user.student_profile)
        elif user.role == 'teacher':
            queryset = queryset.filter(assignment__teacher=user)
        elif user.role == 'parent':
            if hasattr(user, 'parent_profile'):
                children_ids = user.parent_profile.children.values_list('id', flat=True)
                queryset = queryset.filter(student_id__in=children_ids)
        
        # Additional filters
        assignment_id = self.request.query_params.get('assignment', None)
        student_id = self.request.query_params.get('student', None)
        status_filter = self.request.query_params.get('status', None)
        
        if assignment_id:
            queryset = queryset.filter(assignment_id=assignment_id)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-submitted_at')
    
    def perform_create(self, serializer):
        # Get student profile for current user
        if self.request.user.role == 'student':
            student_profile = self.request.user.student_profile
            submission = serializer.save(student=student_profile)
            
            # Check if submission is late
            if submission.submitted_at > submission.assignment.due_date:
                submission.status = 'late'
                submission.save()

class AssignmentSubmissionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AssignmentSubmission.objects.all()
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def grade_submission(request, submission_id):
    """Grade an assignment submission"""
    try:
        submission = AssignmentSubmission.objects.get(id=submission_id)
        
        # Check if user is teacher of this assignment
        if request.user != submission.assignment.teacher:
            return Response(
                {'error': 'Only the assignment teacher can grade submissions'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = AssignmentGradingSerializer(submission, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(
                graded_by=request.user,
                graded_at=timezone.now(),
                status='graded'
            )
            return Response(AssignmentSubmissionSerializer(submission).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except AssignmentSubmission.DoesNotExist:
        return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def assignment_statistics(request, assignment_id):
    """Get statistics for an assignment"""
    try:
        assignment = Assignment.objects.get(id=assignment_id)
        
        submissions = AssignmentSubmission.objects.filter(assignment=assignment)
        total_students = assignment.class_assigned.students.count()
        submitted_count = submissions.count()
        graded_count = submissions.filter(status='graded').count()
        late_count = submissions.filter(status='late').count()
        
        # Calculate average marks
        graded_submissions = submissions.filter(marks_obtained__isnull=False)
        avg_marks = graded_submissions.aggregate(Avg('marks_obtained'))['marks_obtained__avg']
        
        return Response({
            'assignment_id': assignment.id,
            'assignment_title': assignment.title,
            'total_students': total_students,
            'submitted_count': submitted_count,
            'graded_count': graded_count,
            'late_count': late_count,
            'submission_percentage': (submitted_count / total_students * 100) if total_students > 0 else 0,
            'grading_percentage': (graded_count / submitted_count * 100) if submitted_count > 0 else 0,
            'average_marks': round(avg_marks, 2) if avg_marks else None,
        })
        
    except Assignment.DoesNotExist:
        return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def student_assignment_progress(request, student_id):
    """Get assignment progress for a specific student"""
    try:
        student = StudentProfile.objects.get(id=student_id)
        
        # Get all assignments for student's class
        assignments = Assignment.objects.filter(
            class_assigned=student.class_assigned,
            status='assigned'
        )
        
        progress_data = []
        for assignment in assignments:
            try:
                submission = AssignmentSubmission.objects.get(
                    assignment=assignment,
                    student=student
                )
                progress_data.append({
                    'assignment_id': assignment.id,
                    'assignment_title': assignment.title,
                    'due_date': assignment.due_date,
                    'max_marks': assignment.max_marks,
                    'submitted': True,
                    'submission_status': submission.status,
                    'marks_obtained': submission.marks_obtained,
                    'submission_date': submission.submitted_at,
                    'is_late': submission.is_late,
                    'grade_percentage': submission.grade_percentage,
                })
            except AssignmentSubmission.DoesNotExist:
                progress_data.append({
                    'assignment_id': assignment.id,
                    'assignment_title': assignment.title,
                    'due_date': assignment.due_date,
                    'max_marks': assignment.max_marks,
                    'submitted': False,
                    'submission_status': None,
                    'marks_obtained': None,
                    'submission_date': None,
                    'is_late': False,
                    'grade_percentage': None,
                })
        
        return Response({
            'student_id': student.id,
            'student_name': student.user.get_full_name(),
            'class_name': f"{student.class_assigned.name} - {student.class_assigned.section}",
            'assignments': progress_data
        })
        
    except StudentProfile.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def assignments_status(request):
    return Response({'status': 'Assignments module is working'})