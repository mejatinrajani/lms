
from rest_framework import serializers
from .models import Assignment, AssignmentSubmission, AssignmentResource
from core.serializers import StudentProfileSerializer, TeacherProfileSerializer

class AssignmentResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentResource
        fields = ['id', 'file', 'filename', 'file_size', 'uploaded_at']

class AssignmentSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)
    resources = AssignmentResourceSerializer(many=True, read_only=True)
    submission_count = serializers.SerializerMethodField()
    total_students = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'description', 'teacher', 'teacher_name',
            'subject', 'subject_name', 'class_assigned', 'class_name',
            'section', 'section_name', 'due_date', 'max_marks',
            'instructions', 'is_active', 'resources', 'submission_count',
            'total_students', 'created_at', 'updated_at'
        ]
        read_only_fields = ['teacher', 'created_at', 'updated_at']

    def get_submission_count(self, obj):
        return obj.submissions.count()

    def get_total_students(self, obj):
        return obj.section.studentprofile_set.count()

class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    graded_by_name = serializers.CharField(source='graded_by.full_name', read_only=True)

    class Meta:
        model = AssignmentSubmission
        fields = [
            'id', 'assignment', 'assignment_title', 'student', 'student_name',
            'student_roll', 'file', 'text_submission', 'submitted_at',
            'marks_obtained', 'feedback', 'graded_by', 'graded_by_name',
            'graded_at', 'is_late'
        ]
        read_only_fields = ['student', 'submitted_at', 'graded_at', 'is_late']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user.studentprofile
        return super().create(validated_data)

from rest_framework import serializers
from .models import AssignmentResource

class AssignmentResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentResource
        fields = ['id', 'assignment', 'file', 'filename', 'file_size', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']