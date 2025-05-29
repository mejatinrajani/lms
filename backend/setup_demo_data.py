
#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_lms.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import *
from django.utils import timezone
from datetime import date, datetime, time

User = get_user_model()

def create_demo_data():
    print("Creating demo data for School LMS...")
    
    # Create superuser (Developer)
    if not User.objects.filter(username='developer').exists():
        developer = User.objects.create_user(
            username='developer',
            email='developer@school.edu',
            password='password',
            first_name='Super',
            last_name='Admin',
            role='developer',
            is_staff=True,
            is_superuser=True
        )
        print("✅ Developer account created")
    
    # Create school
    school, created = School.objects.get_or_create(
        name='Demo High School',
        defaults={
            'address': '123 Education Street',
            'phone': '+1234567890',
            'email': 'info@demoschool.edu',
            'academic_year': '2024-25'
        }
    )
    if created:
        print("✅ School created")
    
    # Create principal
    if not User.objects.filter(username='principal').exists():
        principal_user = User.objects.create_user(
            username='principal',
            email='principal@school.edu',
            password='password',
            first_name='John',
            last_name='Principal',
            role='principal'
        )
        principal_profile = PrincipalProfile.objects.create(
            user=principal_user,
            school=school,
            employee_id='PRIN001'
        )
        school.principal = principal_user
        school.save()
        print("✅ Principal account created")
    
    # Create subjects
    subjects_data = [
        {'name': 'Mathematics', 'code': 'MATH'},
        {'name': 'English', 'code': 'ENG'},
        {'name': 'Science', 'code': 'SCI'},
        {'name': 'Social Studies', 'code': 'SS'},
        {'name': 'Physical Education', 'code': 'PE'}
    ]
    
    for subject_data in subjects_data:
        Subject.objects.get_or_create(
            name=subject_data['name'],
            school=school,
            defaults={'code': subject_data['code']}
        )
    print("✅ Subjects created")
    
    # Create class
    class_obj, created = Class.objects.get_or_create(
        name='Grade 10',
        section='A',
        school=school
    )
    if created:
        print("✅ Class created")
    
    # Create teacher
    if not User.objects.filter(username='teacher').exists():
        teacher_user = User.objects.create_user(
            username='teacher',
            email='teacher@school.edu',
            password='password',
            first_name='Jane',
            last_name='Teacher',
            role='teacher'
        )
        teacher_profile = TeacherProfile.objects.create(
            user=teacher_user,
            school=school,
            employee_id='TEACH001'
        )
        class_obj.class_teacher = teacher_user
        class_obj.save()
        print("✅ Teacher account created")
    
    # Create student
    if not User.objects.filter(username='student').exists():
        student_user = User.objects.create_user(
            username='student',
            email='student@school.edu',
            password='password',
            first_name='Alice',
            last_name='Student',
            role='student'
        )
        student_profile = StudentProfile.objects.create(
            user=student_user,
            school=school,
            class_assigned=class_obj,
            roll_number='001',
            admission_date=date.today()
        )
        print("✅ Student account created")
    
    # Create parent
    if not User.objects.filter(username='parent').exists():
        parent_user = User.objects.create_user(
            username='parent',
            email='parent@school.edu',
            password='password',
            first_name='Bob',
            last_name='Parent',
            role='parent'
        )
        parent_profile = ParentProfile.objects.create(
            user=parent_user,
            school=school
        )
        parent_profile.children.add(student_profile)
        print("✅ Parent account created")
    
    print("\n✅ Demo data creation completed!")
    print("\nDemo accounts:")
    print("Developer: developer@school.edu / password")
    print("Principal: principal@school.edu / password")
    print("Teacher: teacher@school.edu / password")
    print("Student: student@school.edu / password")
    print("Parent: parent@school.edu / password")

if __name__ == "__main__":
    create_demo_data()
