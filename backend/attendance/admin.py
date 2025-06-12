from django.contrib import admin
from .models import AttendanceRecord, AttendanceSummary, AttendanceStatus

@admin.register(AttendanceStatus)
class AttendanceStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_code', 'is_present', 'color_code')
    search_fields = ('name', 'short_code')

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'class_assigned', 'section', 'subject', 'date', 'status', 'marked_by', 'marked_at')
    list_filter = ('status', 'date', 'class_assigned', 'subject', 'marked_by')
    search_fields = ('student__user__first_name', 'student__user__last_name', 'student__roll_number')
    date_hierarchy = 'date'
    ordering = ('-date', 'student__user__first_name')

@admin.register(AttendanceSummary)
class AttendanceSummaryAdmin(admin.ModelAdmin):
    list_display = ('student', 'month', 'year', 'total_days', 'present_days', 'absent_days', 'attendance_percentage')
    list_filter = ('month', 'year')
    search_fields = ('student__user__first_name', 'student__user__last_name')
    ordering = ('-year', '-month', 'student__user__first_name')