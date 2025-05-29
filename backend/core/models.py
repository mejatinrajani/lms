
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid

class User(AbstractUser):
    """Custom User model with role-based access"""
    ROLE_CHOICES = [
        ('DEVELOPER', 'Developer'),
        ('PRINCIPAL', 'Principal'),
        ('TEACHER', 'Teacher'),
        ('STUDENT', 'Student'),
        ('PARENT', 'Parent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']
    
    class Meta:
        db_table = 'core_user'
    
    def __str__(self):
        return f"{self.email} ({self.role})"
    
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

class School(models.Model):
    """School/Institution model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to='school_logos/', blank=True, null=True)
    established_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'core_school'
    
    def __str__(self):
        return self.name

class BaseProfile(models.Model):
    """Base profile model with common fields"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='%(class)s_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='%(class)s_profiles')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class DeveloperProfile(BaseProfile):
    """Developer/Super Admin profile"""
    access_level = models.CharField(max_length=50, default='SUPER_ADMIN')
    
    class Meta:
        db_table = 'core_developerprofile'

class PrincipalProfile(BaseProfile):
    """Principal profile"""
    employee_id = models.CharField(max_length=50, unique=True)
    qualification = models.TextField(blank=True)
    experience_years = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'core_principalprofile'

class TeacherProfile(BaseProfile):
    """Teacher profile"""
    employee_id = models.CharField(max_length=50, unique=True)
    qualification = models.TextField(blank=True)
    subjects = models.JSONField(default=list, blank=True)
    experience_years = models.IntegerField(default=0)
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    joining_date = models.DateField(blank=True, null=True)
    
    class Meta:
        db_table = 'core_teacherprofile'

class StudentProfile(BaseProfile):
    """Student profile"""
    student_id = models.CharField(max_length=50, unique=True)
    admission_date = models.DateField()
    parent_phone = models.CharField(max_length=20, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    medical_conditions = models.TextField(blank=True)
    
    class Meta:
        db_table = 'core_studentprofile'

class ParentProfile(BaseProfile):
    """Parent profile"""
    occupation = models.CharField(max_length=100, blank=True)
    children = models.ManyToManyField(StudentProfile, related_name='parents', blank=True)
    
    class Meta:
        db_table = 'core_parentprofile'

class Subject(models.Model):
    """Subject model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'core_subject'
        unique_together = ['school', 'code']
    
    def __str__(self):
        return f"{self.name} ({self.code})"

class Class(models.Model):
    """Class/Grade model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='classes')
    name = models.CharField(max_length=50)  # e.g., "Grade 1", "Class X"
    grade_level = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'core_class'
        unique_together = ['school', 'name']
        verbose_name_plural = 'Classes'
    
    def __str__(self):
        return f"{self.name} - {self.school.name}"

class Section(models.Model):
    """Section model (A, B, C within a class)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class_ref = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(max_length=10)  # A, B, C, etc.
    class_teacher = models.ForeignKey(TeacherProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='class_teacher_sections')
    students = models.ManyToManyField(StudentProfile, related_name='sections', blank=True)
    max_capacity = models.IntegerField(default=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'core_section'
        unique_together = ['class_ref', 'name']
    
    def __str__(self):
        return f"{self.class_ref.name} - {self.name}"
    
    @property
    def current_strength(self):
        return self.students.count()

class AuditLog(models.Model):
    """Audit log for tracking changes"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=100)  # CREATE, UPDATE, DELETE
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100)
    changes = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        db_table = 'core_auditlog'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user.email} - {self.action} - {self.model_name}"
