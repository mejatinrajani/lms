from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.models import User, TeacherProfile, StudentProfile, ParentProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm', 'first_name',
            'last_name', 'role', 'phone', 'date_of_birth', 'address'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password,**validated_data)
        user.save()
        return user

class UserLoginSerializer(TokenObtainPairSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        print('b')
        username = attrs.get('username')
        password = attrs.get('password')
        print(f"[LOGIN DEBUG] Incoming login attempt: {username}")

        user = None
        # Try username first
        try:
            user = User.objects.get(username=username)
            print(f"[LOGIN DEBUG] Found user by username: {user.username}")
        except User.DoesNotExist:
            print(f"[LOGIN DEBUG] No user found with username: {username}")
            # Try email if not found by username
            try:
                user = User.objects.get(email=username)
                print(f"[LOGIN DEBUG] Found user by email: {user.email}")
            except User.DoesNotExist:
                print(f"[LOGIN DEBUG] No user found with email: {username}")
                pass

        if user is not None:
            if user.check_password(password):
                print(f"[LOGIN DEBUG] Password correct for user: {user.username}")
                if not user.is_active:
                    print(f"[LOGIN DEBUG] User {user.username} is inactive.")
                    raise serializers.ValidationError('User account is disabled.')
                self.user = user
                data = super().validate({'username': user.username, 'password': password})
                data['user'] = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'phone': user.phone,
                }
                # Add profile data based on role
                try:
                    if user.role == 'TEACHER':
                        profile = TeacherProfile.objects.get(user=user)
                        data['profile'] = {
                            'employee_id': profile.employee_id,
                            'school': profile.school.name,
                            'subjects': [subject.name for subject in profile.subjects.all()]
                        }
                    elif user.role == 'STUDENT':
                        profile = StudentProfile.objects.get(user=user)
                        data['profile'] = {
                            'student_id': profile.student_id,
                            'school': profile.school.name,
                            'class': profile.class_assigned.name,
                            'section': profile.section.name
                        }
                    elif user.role == 'PARENT':
                        profile = ParentProfile.objects.get(user=user)
                        data['profile'] = {
                            'children': [child.full_name for child in profile.children.all()]
                        }
                except Exception as e:
                    print(f"[LOGIN DEBUG] Error fetching profile: {e}")
                return data
            else:
                print(f"[LOGIN DEBUG] Incorrect password for user: {user.username}")
        else:
            print(f"[LOGIN DEBUG] No user found for login: {username}")

        print(f"[LOGIN DEBUG] Invalid credentials for login: {username}")
        raise serializers.ValidationError('Invalid credentials')

    class Meta:
        model = User
        fields = ['username', 'password']

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'address'
        ]

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance