
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, School, Class, Section, Subject, TeacherProfile, StudentProfile, ParentProfile, AuditLog

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone', 'date_of_birth', 'address')
        }),
    )

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ['name', 'principal', 'phone', 'email', 'established_year']
    search_fields = ['name', 'principal__first_name', 'principal__last_name']
    list_filter = ['established_year']

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'description']
    search_fields = ['code', 'name']
    ordering = ['code']

class SectionInline(admin.TabularInline):
    model = Section
    extra = 1

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'school', 'created_at']
    list_filter = ['school', 'created_at']
    search_fields = ['name', 'school__name']
    inlines = [SectionInline]

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'class_assigned', 'class_teacher', 'max_students', 'current_students']
    list_filter = ['class_assigned', 'class_teacher']
    search_fields = ['name', 'class_assigned__name']
    
    def current_students(self, obj):
        return obj.studentprofile_set.count()
    current_students.short_description = 'Current Students'

@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'employee_id', 'school', 'experience_years', 'qualification']
    list_filter = ['school', 'experience_years', 'subjects']
    search_fields = ['user__first_name', 'user__last_name', 'employee_id']
    filter_horizontal = ['subjects', 'sections']

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'student_id', 'class_assigned', 'section', 'roll_number', 'admission_date']
    list_filter = ['class_assigned', 'section', 'admission_date', 'school']
    search_fields = ['user__first_name', 'user__last_name', 'student_id', 'roll_number']
    date_hierarchy = 'admission_date'

@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'occupation', 'children_count']
    search_fields = ['user__first_name', 'user__last_name']
    filter_horizontal = ['children']
    
    def children_count(self, obj):
        return obj.children.count()
    children_count.short_description = 'Number of Children'

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'model_name', 'object_id', 'timestamp', 'ip_address']
    list_filter = ['action', 'model_name', 'timestamp']
    search_fields = ['user__username', 'action', 'model_name', 'object_id']
    date_hierarchy = 'timestamp'
    readonly_fields = ['user', 'action', 'model_name', 'object_id', 'timestamp', 'ip_address', 'details']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
