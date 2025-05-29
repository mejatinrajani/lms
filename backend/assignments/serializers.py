
from rest_framework import serializers
from .models import Assignment, AssignmentSubmission
from core.serializers import StudentProfileSerializer

class AssignmentSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    class_section = serializers.CharField(source='class_assigned.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    total_students = serializers.ReadOnlyField()
    submitted_count = serializers.ReadOnlyField()
    graded_count = serializers.ReadOnlyField()
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'class_assigned', 'class_name', 
                 'class_section', 'subject', 'subject_name', 'teacher', 'teacher_name',
                 'assigned_date', 'due_date', 'max_marks', 'status', 'instructions',
                 'attachment', 'total_students', 'submitted_count', 'graded_count',
                 'is_overdue', 'created_at', 'updated_at']
    
    def get_is_overdue(self, obj):
        from django.utils import timezone
        return timezone.now() > obj.due_date if obj.due_date else False

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_data = StudentProfileSerializer(source='student', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    assignment_max_marks = serializers.IntegerField(source='assignment.max_marks', read_only=True)
    graded_by_name = serializers.CharField(source='graded_by.get_full_name', read_only=True)
    is_late = serializers.ReadOnlyField()
    grade_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = AssignmentSubmission
        fields = ['id', 'assignment', 'assignment_title', 'assignment_max_marks',
                 'student', 'student_data', 'submission_text', 'attachment',
                 'submitted_at', 'status', 'marks_obtained', 'teacher_feedback',
                 'graded_at', 'graded_by', 'graded_by_name', 'is_late', 'grade_percentage']

class AssignmentSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ['assignment', 'submission_text', 'attachment']
    
    def create(self, validated_data):
        # The student will be set from the request user
        return super().create(validated_data)

class AssignmentGradingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ['marks_obtained', 'teacher_feedback', 'status']
    
    def validate_marks_obtained(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Marks cannot be negative")
        return value
