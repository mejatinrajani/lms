from django.contrib import admin
from .models import TimeSlot, Timetable, TeacherTimetable, TimetableTemplate

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('period_number', 'start_time', 'end_time')
    ordering = ('period_number',)

@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('class_assigned', 'section', 'day_of_week', 'time_slot', 'subject', 'teacher', 'room_number', 'academic_year', 'is_active')
    list_filter = ('day_of_week', 'subject', 'class_assigned', 'section', 'teacher', 'academic_year', 'is_active')
    search_fields = ('class_assigned__name', 'section__name', 'subject__name', 'teacher__full_name', 'room_number')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(TeacherTimetable)
class TeacherTimetableAdmin(admin.ModelAdmin):
    list_display = ('teacher', 'timetable')
    list_filter = ('teacher',)
    search_fields = ('teacher__full_name', 'timetable__class_assigned__name')

@admin.register(TimetableTemplate)
class TimetableTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'class_assigned', 'created_by', 'created_at', 'is_active')
    list_filter = ('is_active', 'created_at', 'class_assigned')
    search_fields = ('name', 'class_assigned__name', 'created_by__username')