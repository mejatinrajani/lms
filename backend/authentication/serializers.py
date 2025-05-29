
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from core.models import User, StudentProfile, TeacherProfile, ParentProfile, PrincipalProfile, DeveloperProfile, School

class UserRegistrationSerializer(serializers.ModelSerializer):
    """User registration serializer"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    school_id = serializers.UUIDField(required=False)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'role', 
                 'first_name', 'last_name', 'school_id']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm and profile fields
        validated_data.pop('password_confirm')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        school_id = validated_data.pop('school_id', None)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create corresponding profile based on role
        school = None
        if school_id:
            try:
                school = School.objects.get(id=school_id)
            except School.DoesNotExist:
                school = School.objects.first()  # Default to first school
        
        profile_data = {
            'user': user,
            'first_name': first_name,
            'last_name': last_name,
            'school': school
        }
        
        if user.role == 'Student':
            StudentProfile.objects.create(
                student_id=f"STU{user.id.hex[:8].upper()}",
                admission_date=timezone.now().date(),
                **profile_data
            )
        elif user.role == 'Teacher':
            TeacherProfile.objects.create(
                employee_id=f"TEA{user.id.hex[:8].upper()}",
                **profile_data
            )
        elif user.role == 'Parent':
            ParentProfile.objects.create(**profile_data)
        elif user.role == 'Principal':
            PrincipalProfile.objects.create(
                employee_id=f"PRI{user.id.hex[:8].upper()}",
                **profile_data
            )
        elif user.role == 'Developer':
            DeveloperProfile.objects.create(**profile_data)
        
        return user

class UserLoginSerializer(serializers.Serializer):
    """User login serializer"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Email and password are required')

class UserProfileSerializer(serializers.ModelSerializer):
    """User profile serializer"""
    full_name = serializers.SerializerMethodField()
    profile_data = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'is_active', 
                 'created_at', 'full_name', 'profile_data']
        read_only_fields = ['id', 'role', 'created_at']
    
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
    
    def get_profile_data(self, obj):
        try:
            if obj.role == 'STUDENT':
                profile = obj.studentprofile_profile
                return {
                    'student_id': profile.student_id,
                    'school': profile.school.name,
                    'phone': profile.phone,
                    'address': profile.address
                }
            elif obj.role == 'TEACHER':
                profile = obj.teacherprofile_profile
                return {
                    'employee_id': profile.employee_id,
                    'school': profile.school.name,
                    'subjects': profile.subjects,
                    'phone': profile.phone
                }
            # Add other role profiles...
        except:
            return {}

class ChangePasswordSerializer(serializers.Serializer):
    """Change password serializer"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
