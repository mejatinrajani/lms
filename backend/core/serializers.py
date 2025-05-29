
from rest_framework import serializers
from .models import (
    User, School, StudentProfile, TeacherProfile, ParentProfile,
    PrincipalProfile, DeveloperProfile, Class, Section, Subject, AuditLog
)

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'is_active', 'created_at', 'full_name']
        read_only_fields = ['id', 'created_at']
    
    def get_full_name(self, obj):
        try:
            if obj.role == 'STUDENT':
                return obj.studentprofile_profile.full_name
            elif obj.role == 'TEACHER':
                return obj.teacherprofile_profile.full_name
            elif obj.role == 'PARENT':
                return obj.parentprofile_profile.full_name
            elif obj.role == 'PRINCIPAL':
                return obj.principalprofile_profile.full_name
            elif obj.role == 'DEVELOPER':
                return obj.developerprofile_profile.full_name
        except:
            return f"{obj.first_name} {obj.last_name}"

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'

class StudentProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'

class TeacherProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = '__all__'

class ParentProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    children_names = serializers.SerializerMethodField()
    
    class Meta:
        model = ParentProfile
        fields = '__all__'
    
    def get_children_names(self, obj):
        return [child.full_name for child in obj.children.all()]

class PrincipalProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = PrincipalProfile
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
    class_name = serializers.CharField(source='class_ref.name', read_only=True)
    class_teacher_name = serializers.SerializerMethodField()
    students_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Section
        fields = '__all__'
    
    def get_class_teacher_name(self, obj):
        return obj.class_teacher.full_name if obj.class_teacher else None
    
    def get_students_count(self, obj):
        return obj.students.count()

class SubjectSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = Subject
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = '__all__'
