
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow administrators to edit objects.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and (
            request.user.is_developer or request.user.is_principal
        )

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only to the owner
        return obj.user == request.user

class IsDeveloperOrPrincipal(permissions.BasePermission):
    """
    Permission for Developer and Principal roles only
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_developer or request.user.is_principal
        )

class IsTeacherOrAbove(permissions.BasePermission):
    """
    Permission for Teacher, Principal, and Developer roles
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_developer or 
            request.user.is_principal or 
            request.user.is_teacher
        )
    
class IsTeacherOrPrincipal(permissions.BasePermission):
    """
    Permission for Teacher, Principal, and Developer roles
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_developer or 
            request.user.is_principal or 
            request.user.is_teacher
        )
