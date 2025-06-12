from django.db import models
from core.models import User, TeacherProfile, Subject, Section, Class

class TimeSlot(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    period_number = models.IntegerField()

    class Meta:
        ordering = ['period_number']

    def __str__(self):
        return f"Period {self.period_number}: {self.start_time} - {self.end_time}"

class Timetable(models.Model):
    DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]

    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    room_number = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    academic_year = models.CharField(max_length=9)  # e.g., "2023-2024"
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['class_assigned', 'section', 'day_of_week', 'time_slot', 'academic_year']

    def __str__(self):
        return f"{self.class_assigned.name}-{self.section.name} - {self.day_of_week} - {self.time_slot} - {self.subject.name}"

class TeacherTimetable(models.Model):
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    timetable = models.ForeignKey(Timetable, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['teacher', 'timetable']

    def __str__(self):
        return f"{self.teacher.full_name} - {self.timetable}"

class TimetableTemplate(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.class_assigned.name}"