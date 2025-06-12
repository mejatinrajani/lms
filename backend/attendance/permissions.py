from rest_framework import permissions

class IsTeacherOrPrincipal(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) in ['TEACHER', 'PRINCIPAL']

class IsDeveloperOrPrincipal(permissions.BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) in ['DEVELOPER', 'PRINCIPAL']