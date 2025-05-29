
from django.contrib import admin
from .models import Exam, Grade, Timetable

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('name', 'exam_type', 'class_assigned', 'subject', 'date', 'max_marks', 'created_by')
    list_filter = ('exam_type', 'class_assigned', 'subject', 'date', 'created_by')
    search_fields = ('name', 'subject__name', 'class_assigned__name')
    date_hierarchy = 'date'

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'marks_obtained', 'grade_letter', 'graded_by', 'graded_at')
    list_filter = ('exam__exam_type', 'exam__class_assigned', 'exam__subject', 'graded_at')
    search_fields = ('student__user__first_name', 'student__user__last_name', 'exam__name')

@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('class_assigned', 'subject', 'teacher', 'weekday', 'start_time', 'end_time', 'room_number')
    list_filter = ('class_assigned', 'subject', 'teacher', 'weekday')
    search_fields = ('class_assigned__name', 'subject__name', 'teacher__first_name')
    ordering = ('class_assigned', 'weekday', 'start_time')
