from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    ROLE_CHOICES = [
        ('DEVELOPER', 'Developer'),
        ('PRINCIPAL', 'Principal'),
        ('TEACHER', 'Teacher'),
        ('STUDENT', 'Student'),
        ('PARENT', 'Parent'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$')],
        null=True,
        blank=True
    )
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_developer(self):
        return self.role == 'DEVELOPER'

    @property
    def is_principal(self):
        return self.role == 'PRINCIPAL'

    @property
    def is_teacher(self):
        return self.role == 'TEACHER'

    @property
    def is_student(self):
        return self.role == 'STUDENT'

    @property
    def is_parent(self):
        return self.role == 'PARENT'

    def __str__(self):
        return f"{self.username} ({self.role})"

class School(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    website = models.URLField(blank=True)
    established_year = models.IntegerField(null=True, blank=True)
    principal = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='school_principal',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Class(models.Model):
    name = models.CharField(max_length=50)  # e.g., "Grade 10"
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Classes"

    def __str__(self):
        return f"{self.name} - {self.school.name}"

class Section(models.Model):
    name = models.CharField(max_length=10)  # e.g., "A", "B", "C"
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='sections')
    class_teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    max_students = models.IntegerField(default=40)

    def __str__(self):
        return f"{self.class_assigned.name}-{self.name}"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20, unique=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    subjects = models.ManyToManyField(Subject)
    sections = models.ManyToManyField(Section, blank=True)
    qualification = models.CharField(max_length=200, blank=True)
    experience_years = models.IntegerField(default=0)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def __str__(self):
        return f"{self.full_name} ({self.employee_id})"

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    student_id = models.CharField(max_length=20, unique=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, null=True, blank=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=10, null=True, blank=True)
    admission_date = models.DateField(null=True, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    emergency_contact = models.CharField(max_length=15, null=True, blank=True)

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def __str__(self):
        return f"{self.full_name} ({self.student_id})"

class ParentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    children = models.ManyToManyField(StudentProfile, related_name='parents')
    occupation = models.CharField(max_length=100, blank=True)
    income = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def __str__(self):
        return f"{self.full_name} - Parent"

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    model_name = models.CharField(max_length=50)
    object_id = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    details = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"