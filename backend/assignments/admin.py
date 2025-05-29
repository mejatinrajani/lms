
from django.contrib import admin
from .models import Assignment, AssignmentSubmission

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'class_assigned', 'subject', 'teacher', 'status', 'due_date', 'created_at')
    list_filter = ('status', 'class_assigned', 'subject', 'teacher', 'due_date', 'created_at')
    search_fields = ('title', 'description', 'teacher__first_name', 'teacher__last_name')
    date_hierarchy = 'due_date'
    ordering = ('-created_at',)

@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'student', 'status', 'marks_obtained', 'submitted_at', 'graded_at')
    list_filter = ('status', 'assignment__class_assigned', 'assignment__subject', 'submitted_at', 'graded_at')
    search_fields = ('assignment__title', 'student__user__first_name', 'student__user__last_name', 'student__roll_number')
    date_hierarchy = 'submitted_at'
    ordering = ('-submitted_at',)
