
from django.contrib import admin
from .models import TimeSlot, Timetable, TeacherAvailability

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ['school', 'start_time', 'end_time', 'is_break', 'break_name', 'order']
    list_filter = ['school', 'is_break']
    ordering = ['school', 'order']

@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ['class_assigned', 'subject', 'teacher', 'day_of_week', 'time_slot', 'room_number']
    list_filter = ['school', 'day_of_week', 'is_active']
    search_fields = ['class_assigned__name', 'subject__name', 'teacher__user__username']

@admin.register(TeacherAvailability)
class TeacherAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'day_of_week', 'time_slot', 'is_available', 'reason']
    list_filter = ['day_of_week', 'is_available']
    search_fields = ['teacher__user__username']
