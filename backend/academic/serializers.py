
from rest_framework import serializers
from .models import Exam, Grade, Timetable
from core.models import Class, Subject, StudentProfile, User


class ExamSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    class_section = serializers.CharField(source='class_assigned.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Exam
        fields = ['id', 'name', 'exam_type', 'class_assigned', 'class_name', 'class_section',
                 'subject', 'subject_name', 'date', 'start_time', 'end_time', 'max_marks',
                 'created_by', 'created_by_name', 'created_at']

class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    exam_max_marks = serializers.IntegerField(source='exam.max_marks', read_only=True)
    graded_by_name = serializers.CharField(source='graded_by.get_full_name', read_only=True)
    percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Grade
        fields = ['id', 'student', 'student_name', 'student_roll', 'exam', 'exam_name',
                 'exam_max_marks', 'marks_obtained', 'percentage', 'grade_letter', 
                 'remarks', 'graded_by', 'graded_by_name', 'graded_at']

class TimetableSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    class_section = serializers.CharField(source='class_assigned.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    weekday_name = serializers.CharField(source='get_weekday_display', read_only=True)
    
    class Meta:
        model = Timetable
        fields = ['id', 'class_assigned', 'class_name', 'class_section', 'subject',
                 'subject_name', 'teacher', 'teacher_name', 'weekday', 'weekday_name',
                 'start_time', 'end_time', 'room_number', 'created_at']




class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'section']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    roll_number = serializers.CharField(source='roll_no', required=False)

    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'roll_number']

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "full_name": obj.user.get_full_name(),
        }