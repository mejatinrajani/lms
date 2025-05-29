from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, School, Class, Subject, StudentProfile, TeacherProfile, ParentProfile, PrincipalProfile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone', 'profile_image', 'date_of_birth', 'address')
        }),
    )

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'created_at')  # Removed 'principal', 'academic_year'
    list_filter = ('created_at',)  # Removed 'academic_year'
    search_fields = ('name', 'email', 'phone')
    ordering = ('-created_at',)

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'created_at')  # Removed 'section', 'class_teacher'
    list_filter = ('school', 'name', 'created_at')
    search_fields = ('name', 'school__name')  # Removed 'section'
    ordering = ('school', 'name')  # Removed 'section'

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'school', 'created_at')
    list_filter = ('school', 'created_at')
    search_fields = ('name', 'code', 'school__name')

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'admission_date')  # Removed 'roll_number', 'class_assigned'
    list_filter = ('school', 'admission_date')  # Removed 'class_assigned'
    search_fields = ('user__first_name', 'user__last_name', 'user__email')  # Removed 'roll_number'
    ordering = ('school',)  # Removed 'class_assigned', 'roll_number'

@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'experience_years')  # Removed 'joining_date'
    list_filter = ('school',)  # Removed 'joining_date'
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    # Removed filter_horizontal as 'subjects' and 'classes' are not valid many-to-many fields

@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'occupation')  # Removed 'relationship'
    list_filter = ('school',)  # Removed 'relationship'
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    # Removed filter_horizontal as 'children' may not be a many-to-many field

@admin.register(PrincipalProfile)
class PrincipalProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'experience_years')  # Removed 'joining_date'
    list_filter = ('school',)  # Removed 'joining_date'
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
