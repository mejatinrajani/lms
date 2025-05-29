
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import authenticate
from django.db import transaction
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, 
    UserProfileSerializer, ChangePasswordSerializer
)
from core.models import User, StudentProfile, TeacherProfile, ParentProfile, PrincipalProfile, DeveloperProfile

class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view with user profile data"""
    serializer_class = UserLoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({
                'error': 'Invalid credentials',
                'detail': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        # Get user profile based on role
        profile_data = None
        try:
            if user.is_student:
                profile = StudentProfile.objects.get(user=user)
                profile_data = {
                    'student_id': profile.student_id,
                    'full_name': profile.full_name,
                    'school': profile.school.name,
                    'sections': [str(section) for section in profile.sections.all()]
                }
            elif user.is_teacher:
                profile = TeacherProfile.objects.get(user=user)
                profile_data = {
                    'employee_id': profile.employee_id,
                    'full_name': profile.full_name,
                    'school': profile.school.name,
                    'subjects': profile.subjects
                }
            elif user.is_parent:
                profile = ParentProfile.objects.get(user=user)
                profile_data = {
                    'full_name': profile.full_name,
                    'school': profile.school.name,
                    'children': [child.full_name for child in profile.children.all()]
                }
            elif user.is_principal:
                profile = PrincipalProfile.objects.get(user=user)
                profile_data = {
                    'employee_id': profile.employee_id,
                    'full_name': profile.full_name,
                    'school': profile.school.name
                }
            elif user.is_developer:
                profile = DeveloperProfile.objects.get(user=user)
                profile_data = {
                    'full_name': profile.full_name,
                    'access_level': profile.access_level
                }
        except Exception:
            profile_data = {'full_name': f"{user.first_name} {user.last_name}"}
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'role': user.role,
                'is_active': user.is_active,
                'profile': profile_data
            }
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user with profile"""
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            with transaction.atomic():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': 'User registered successfully',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': str(user.id),
                        'email': user.email,
                        'role': user.role
                    }
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': 'Registration failed',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logout user by blacklisting refresh token"""
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    serializer = ChangePasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        user = request.user
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({
                'error': 'Old password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    """Verify if token is valid"""
    return Response({
        'valid': True,
        'user': {
            'id': str(request.user.id),
            'email': request.user.email,
            'role': request.user.role
        }
    }, status=status.HTTP_200_OK)
