
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import (
    User, School, StudentProfile, TeacherProfile, ParentProfile, 
    PrincipalProfile, Class, Section, Subject, AuditLog
)
from .serializers import (
    UserSerializer, SchoolSerializer, StudentProfileSerializer,
    TeacherProfileSerializer, ParentProfileSerializer, PrincipalProfileSerializer,
    ClassSerializer, SectionSerializer, SubjectSerializer, AuditLogSerializer
)
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return School.objects.all()
        elif user.is_principal:
            return School.objects.filter(principalprofile_profiles__user=user)
        else:
            # Teachers, students, parents see their school
            if hasattr(user, 'teacherprofile_profile'):
                return School.objects.filter(id=user.teacherprofile_profile.school.id)
            elif hasattr(user, 'studentprofile_profile'):
                return School.objects.filter(id=user.studentprofile_profile.school.id)
            elif hasattr(user, 'parentprofile_profile'):
                return School.objects.filter(id=user.parentprofile_profile.school.id)
        return School.objects.none()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return User.objects.all()
        elif user.is_principal:
            # Principal sees users in their school
            try:
                school = user.principalprofile_profile.school
                return User.objects.filter(
                    Q(teacherprofile_profile__school=school) |
                    Q(studentprofile_profile__school=school) |
                    Q(parentprofile_profile__school=school)
                )
            except:
                return User.objects.none()
        else:
            # Others see only themselves
            return User.objects.filter(id=user.id)

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return StudentProfile.objects.all()
        elif user.is_principal:
            try:
                school = user.principalprofile_profile.school
                return StudentProfile.objects.filter(school=school)
            except:
                return StudentProfile.objects.none()
        elif user.is_teacher:
            try:
                school = user.teacherprofile_profile.school
                return StudentProfile.objects.filter(school=school)
            except:
                return StudentProfile.objects.none()
        elif user.is_student:
            return StudentProfile.objects.filter(user=user)
        elif user.is_parent:
            try:
                return user.parentprofile_profile.children.all()
            except:
                return StudentProfile.objects.none()
        return StudentProfile.objects.none()

class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return TeacherProfile.objects.all()
        elif user.is_principal:
            try:
                school = user.principalprofile_profile.school
                return TeacherProfile.objects.filter(school=school)
            except:
                return TeacherProfile.objects.none()
        elif user.is_teacher:
            return TeacherProfile.objects.filter(user=user)
        return TeacherProfile.objects.none()

class ParentProfileViewSet(viewsets.ModelViewSet):
    queryset = ParentProfile.objects.all()
    serializer_class = ParentProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return ParentProfile.objects.all()
        elif user.is_principal:
            try:
                school = user.principalprofile_profile.school
                return ParentProfile.objects.filter(school=school)
            except:
                return ParentProfile.objects.none()
        elif user.is_parent:
            return ParentProfile.objects.filter(user=user)
        return ParentProfile.objects.none()

class PrincipalProfileViewSet(viewsets.ModelViewSet):
    queryset = PrincipalProfile.objects.all()
    serializer_class = PrincipalProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return PrincipalProfile.objects.all()
        elif user.is_principal:
            return PrincipalProfile.objects.filter(user=user)
        return PrincipalProfile.objects.none()

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return Class.objects.all()
        elif user.is_principal:
            try:
                school = user.principalprofile_profile.school
                return Class.objects.filter(school=school)
            except:
                return Class.objects.none()
        elif user.is_teacher:
            try:
                school = user.teacherprofile_profile.school
                return Class.objects.filter(school=school)
            except:
                return Class.objects.none()
        elif user.is_student:
            try:
                student_sections = user.studentprofile_profile.sections.all()
                return Class.objects.filter(sections__in=student_sections).distinct()
            except:
                return Class.objects.none()
        return Class.objects.none()

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return Subject.objects.all()
        elif user.is_principal:
            try:
                school = user.principalprofile_profile.school
                return Subject.objects.filter(school=school)
            except:
                return Subject.objects.none()
        elif user.is_teacher:
            try:
                school = user.teacherprofile_profile.school
                return Subject.objects.filter(school=school)
            except:
                return Subject.objects.none()
        return Subject.objects.none()

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_developer:
            return AuditLog.objects.all()
        elif user.is_principal:
            # Principal sees logs related to their school
            return AuditLog.objects.filter(user__in=User.objects.filter(
                Q(principalprofile_profile__school=user.principalprofile_profile.school) |
                Q(teacherprofile_profile__school=user.principalprofile_profile.school) |
                Q(studentprofile_profile__school=user.principalprofile_profile.school)
            ))
        return AuditLog.objects.filter(user=user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics based on user role"""
    user = request.user
    stats = {}
    
    try:
        if user.is_developer:
            stats = {
                'total_schools': School.objects.count(),
                'total_users': User.objects.count(),
                'total_students': StudentProfile.objects.count(),
                'total_teachers': TeacherProfile.objects.count(),
                'total_parents': ParentProfile.objects.count(),
                'active_users': User.objects.filter(is_active=True).count(),
            }
        
        elif user.is_principal:
            school = user.principalprofile_profile.school
            stats = {
                'total_students': StudentProfile.objects.filter(school=school).count(),
                'total_teachers': TeacherProfile.objects.filter(school=school).count(),
                'total_parents': ParentProfile.objects.filter(school=school).count(),
                'total_classes': Class.objects.filter(school=school).count(),
                'total_subjects': Subject.objects.filter(school=school).count(),
            }
        
        elif user.is_teacher:
            school = user.teacherprofile_profile.school
            # Get sections where this teacher is class teacher
            teacher_sections = Section.objects.filter(class_teacher=user.teacherprofile_profile)
            stats = {
                'my_sections': teacher_sections.count(),
                'my_students': StudentProfile.objects.filter(sections__in=teacher_sections).count(),
                'total_classes': Class.objects.filter(school=school).count(),
            }
        
        elif user.is_student:
            student_profile = user.studentprofile_profile
            stats = {
                'my_sections': student_profile.sections.count(),
                'school_name': student_profile.school.name,
                'student_id': student_profile.student_id,
            }
        
        elif user.is_parent:
            parent_profile = user.parentprofile_profile
            stats = {
                'total_children': parent_profile.children.count(),
                'school_name': parent_profile.school.name,
            }
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(stats, status=status.HTTP_200_OK)
