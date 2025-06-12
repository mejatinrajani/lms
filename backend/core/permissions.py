
from rest_framework.permissions import BasePermission

class IsDeveloper(BasePermission):
    """Permission for Developer role - full access"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'DEVELOPER'

class IsPrincipal(BasePermission):
    """Permission for Principal role"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['PRINCIPAL', 'DEVELOPER']

class IsTeacher(BasePermission):
    """Permission for Teacher role"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['TEACHER', 'PRINCIPAL', 'DEVELOPER']

class IsStudent(BasePermission):
    """Permission for Student role"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['STUDENT', 'TEACHER', 'PRINCIPAL', 'DEVELOPER']

class IsParent(BasePermission):
    """Permission for Parent role"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['PARENT', 'TEACHER', 'PRINCIPAL', 'DEVELOPER']

class IsOwnerOrTeacher(BasePermission):
    """Custom permission to only allow owners of an object or teachers to edit it"""
    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Write permissions only to the owner or teacher/principal/developer
        if hasattr(obj, 'student'):
            return (obj.student.user == request.user or 
                   request.user.role in ['TEACHER', 'PRINCIPAL', 'DEVELOPER'])
        if hasattr(obj, 'user'):
            return (obj.user == request.user or 
                   request.user.role in ['TEACHER', 'PRINCIPAL', 'DEVELOPER'])
        
        return request.user.role in ['TEACHER', 'PRINCIPAL', 'DEVELOPER']

class CanViewStudentData(BasePermission):
    """Permission to view student data based on role"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Developer and Principal can see all
        if request.user.role in ['DEVELOPER', 'PRINCIPAL']:
            return True
        
        # Teachers can see their students
        if request.user.role == 'TEACHER':
            return True
        
        # Students can see their own data
        if request.user.role == 'STUDENT':
            return True
        
        # Parents can see their children's data
        if request.user.role == 'PARENT':
            return True
        
        return False

class CanManageUsers(BasePermission):
    """Permission to manage users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['DEVELOPER', 'PRINCIPAL']

class CanManageMarks(BasePermission):
    """Permission to manage marks"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Developers and Principals can manage all marks
        if request.user.role in ['DEVELOPER', 'PRINCIPAL']:
            return True
        
        # Teachers can manage marks for their subjects
        if request.user.role == 'TEACHER':
            return True
        
        return False

class CanViewMarks(BasePermission):
    """Permission to view marks"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['DEVELOPER', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']
