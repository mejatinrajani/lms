from django.contrib import admin
from .models import ExamType, Exam, Mark, AcademicYear, ClassSubject

@admin.register(ExamType)
class ExamTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'weightage', 'description']
    search_fields = ['name']

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ['exam_type', 'subject', 'class_assigned', 'section', 'date', 'max_marks']
    list_filter = ['exam_type', 'subject', 'class_assigned', 'date']
    search_fields = ['exam_type__name', 'subject__name']

@admin.register(Mark)
class MarkAdmin(admin.ModelAdmin):
    list_display = ['student', 'exam', 'marks_obtained', 'grade', 'percentage']
    list_filter = ['exam__exam_type', 'exam__subject', 'exam__class_assigned']
    search_fields = ['student__user__first_name', 'student__user__last_name']

@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ['year', 'start_date', 'end_date', 'is_current']
    list_filter = ['is_current']

@admin.register(ClassSubject)
class ClassSubjectAdmin(admin.ModelAdmin):
    list_display = ['class_assigned', 'section', 'subject', 'teacher', 'academic_year']
    list_filter = ['class_assigned', 'subject', 'academic_year']    