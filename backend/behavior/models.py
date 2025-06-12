
from django.db import models
from core.models import User, StudentProfile, TeacherProfile

class BehaviorCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color code
    is_positive = models.BooleanField(default=True)  # True for positive, False for negative
    points = models.IntegerField(default=0)  # Points awarded/deducted

    def __str__(self):
        return f"{self.name} ({'Positive' if self.is_positive else 'Negative'})"

class BehaviorLog(models.Model):
    SEVERITY_CHOICES = [
        ('minor', 'Minor'),
        ('moderate', 'Moderate'),
        ('major', 'Major'),
        ('severe', 'Severe'),
    ]

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    category = models.ForeignKey(BehaviorCategory, on_delete=models.CASCADE)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='minor')
    date_occurred = models.DateField()
    time_occurred = models.TimeField()
    location = models.CharField(max_length=100, blank=True)
    witnesses = models.TextField(blank=True)
    action_taken = models.TextField(blank=True)
    parent_notified = models.BooleanField(default=False)
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(null=True, blank=True)
    reported_by = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.category.name} - {self.date_occurred}"

class BehaviorPoints(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    total_points = models.IntegerField(default=0)
    positive_points = models.IntegerField(default=0)
    negative_points = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student']

    def __str__(self):
        return f"{self.student.full_name} - {self.total_points} points"
