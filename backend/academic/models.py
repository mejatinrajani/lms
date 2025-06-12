
from django.db import models
from core.models import User, StudentProfile, TeacherProfile, Subject, Section, Class

class ExamType(models.Model):
    name = models.CharField(max_length=50)  # e.g., "Mid-term", "Final", "Quiz"
    description = models.TextField(blank=True)
    weightage = models.DecimalField(max_digits=5, decimal_places=2)  # percentage

    def __str__(self):
        return self.name

class Exam(models.Model):
    exam_type = models.ForeignKey(ExamType, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_marks = models.IntegerField()
    passing_marks = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.exam_type.name} - {self.subject.name} - {self.class_assigned.name}-{self.section.name}"

class Mark(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'exam']

    @property
    def percentage(self):
        return (self.marks_obtained / self.exam.max_marks) * 100

    @property
    def grade(self):
        percentage = self.percentage
        if percentage >= 90:
            return 'A+'
        elif percentage >= 80:
            return 'A'
        elif percentage >= 70:
            return 'B+'
        elif percentage >= 60:
            return 'B'
        elif percentage >= 50:
            return 'C'
        elif percentage >= 40:
            return 'D'
        else:
            return 'F'

    def __str__(self):
        return f"{self.student.full_name} - {self.exam.subject.name} - {self.marks_obtained}/{self.exam.max_marks}"

class AcademicYear(models.Model):
    year = models.CharField(max_length=9)  # e.g., "2023-2024"
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return self.year

class ClassSubject(models.Model):
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['class_assigned', 'section', 'subject', 'academic_year']

    def __str__(self):
        return f"{self.subject.name} - {self.class_assigned.name}-{self.section.name} - {self.teacher.full_name}"
