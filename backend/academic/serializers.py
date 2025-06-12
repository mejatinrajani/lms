from rest_framework import serializers
from .models import ExamType, Exam, Mark, AcademicYear, ClassSubject, Class, Section, Subject
from core.models import StudentProfile, TeacherProfile

class StudentProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    roll_number = serializers.CharField(source='roll_number')
    class_assigned_id = serializers.IntegerField(source='class_assigned.id', read_only=True)
    section_id = serializers.IntegerField(source='section.id', read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'roll_number', 'class_assigned_id', 'section_id']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'full_name': obj.user.get_full_name() or f"{obj.user.first_name or ''} {obj.user.last_name or ''}".strip(),
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name
        }

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name']

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'name']

class ExamTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamType
        fields = ['id', 'name', 'description', 'weightage']

class ExamSerializer(serializers.ModelSerializer):
    exam_type_name = serializers.CharField(source='exam_type.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Exam
        fields = [
            'id', 'exam_type', 'exam_type_name', 'subject', 'subject_name',
            'class_assigned', 'class_name', 'section', 'section_name',
            'date', 'start_time', 'end_time', 'max_marks', 'passing_marks',
            'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_at']

class MarkSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    exam_name = serializers.CharField(source='exam.exam_type.name', read_only=True)
    subject_name = serializers.CharField(source='exam.subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    percentage = serializers.ReadOnlyField()
    grade = serializers.ReadOnlyField()

    class Meta:
        model = Mark
        fields = [
            'id', 'student', 'student_name', 'student_roll',
            'exam', 'exam_name', 'subject_name',
            'marks_obtained', 'teacher', 'teacher_name',
            'percentage', 'grade', 'remarks',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'year', 'start_date', 'end_date', 'is_current']

class ClassSubjectSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    academic_year_name = serializers.CharField(source='academic_year.year', read_only=True)

    class Meta:
        model = ClassSubject
        fields = [
            'id', 'class_assigned', 'class_name', 'section', 'section_name',
            'subject', 'subject_name', 'teacher', 'teacher_name',
            'academic_year', 'academic_year_name'
        ]