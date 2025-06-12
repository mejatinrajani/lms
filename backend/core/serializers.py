
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, School, Class, Section, Subject, TeacherProfile, StudentProfile, ParentProfile, AuditLog

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                 'phone', 'password', 'date_of_birth', 'address', 'is_active', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class SchoolSerializer(serializers.ModelSerializer):
    principal_name = serializers.CharField(source='principal.get_full_name', read_only=True)
    
    class Meta:
        model = School
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class ClassSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    sections_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Class
        fields = '__all__'
    
    def get_sections_count(self, obj):
        return obj.sections.count()

class SectionSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    teacher_name = serializers.CharField(source='class_teacher.get_full_name', read_only=True)
    students_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Section
        fields = '__all__'
    
    def get_students_count(self, obj):
        return obj.studentprofile_set.count()

class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    subjects_list = SubjectSerializer(source='subjects', many=True, read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = '__all__'

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'

class ParentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    children_list = StudentProfileSerializer(source='children', many=True, read_only=True)
    
    class Meta:
        model = ParentProfile
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = '__all__'

class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_students = serializers.IntegerField()
    total_teachers = serializers.IntegerField()
    total_classes = serializers.IntegerField()
    total_notices = serializers.IntegerField()
    pending_assignments = serializers.IntegerField()
    attendance_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
