from django.contrib import admin
from .models import Assignment, AssignmentSubmission, AssignmentResource

class IsLateFilter(admin.SimpleListFilter):
    title = 'Is Late'
    parameter_name = 'is_late'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Late'),
            ('no', 'On Time'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return [obj for obj in queryset if obj.is_late]
        if self.value() == 'no':
            return [obj for obj in queryset if not obj.is_late]
        return queryset

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'class_assigned', 'teacher', 'due_date', 'created_at')
    list_filter = ('subject', 'class_assigned', 'due_date', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(AssignmentSubmission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'student', 'submitted_at', 'is_late', 'marks_obtained', 'graded_by', 'graded_at')
    list_filter = ('submitted_at', IsLateFilter, 'status', 'graded_at')  # Use custom filter
    search_fields = ('assignment__title', 'student__full_name')
    readonly_fields = ('submitted_at', 'graded_at')  # Only real fields

@admin.register(AssignmentResource)
class AssignmentResourceAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'filename', 'file_size', 'uploaded_at')
    search_fields = ('filename', 'assignment__title')
    readonly_fields = ('uploaded_at',)