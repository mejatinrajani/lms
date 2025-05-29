from django.contrib import admin
from .models import AttendanceRecord, AttendanceSummary

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'class_session', 'subject', 'date', 'status', 'marked_by', 'created_at')
    list_filter = ('status', 'date', 'class_session', 'subject', 'marked_by')
    search_fields = ('student__user__first_name', 'student__user__last_name', 'student__roll_number')
    date_hierarchy = 'date'
    ordering = ('-date', 'student__user__first_name')

@admin.register(AttendanceSummary)
class AttendanceSummaryAdmin(admin.ModelAdmin):
    list_display = ('student', 'month', 'total_days', 'present_days', 'absent_days', 'attendance_percentage')
    list_filter = ('month',)  # Removed 'student__class_assigned' as it is not a direct field
    search_fields = ('student__user__first_name', 'student__user__last_name')
    ordering = ('-month', 'student__user__first_name')
