
#!/usr/bin/env python3
"""
Create superuser and sample data for School LMS
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_lms.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import School, StudentProfile, TeacherProfile, ParentProfile
from academic.models import Class, Subject
from django.db import transaction

User = get_user_model()

def create_sample_data():
    """Create comprehensive sample data for the LMS"""
    try:
        with transaction.atomic():
            # Create school
            school, created = School.objects.get_or_create(
                name="Demo High School",
                defaults={
                    'address': '123 Education Street, Learning City, LC 12345',
                    'phone': '+1-555-123-4567',
                    'email': 'info@demoschool.edu',
                    'website': 'https://demoschool.edu',
                    'established_year': 1995,
                }
            )
            print(f"✅ School: {school.name}")

            # Create superuser
            if not User.objects.filter(email='admin@school.edu').exists():
                admin = User.objects.create_superuser(
                    email='admin@school.edu',
                    password='admin123',
                    first_name='System',
                    last_name='Administrator',
                    role='DEVELOPER'
                )
                print(f"✅ Superuser created: admin@school.edu / admin123")

            # Create principal
            if not User.objects.filter(email='principal@school.edu').exists():
                principal = User.objects.create_user(
                    email='principal@school.edu',
                    password='password',
                    first_name='John',
                    last_name='Smith',
                    role='PRINCIPAL'
                )
                principal.school = school
                principal.save()
                print(f"✅ Principal created: principal@school.edu / password")

            # Create teacher
            if not User.objects.filter(email='teacher@school.edu').exists():
                teacher_user = User.objects.create_user(
                    email='teacher@school.edu',
                    password='password',
                    first_name='Sarah',
                    last_name='Johnson',
                    role='TEACHER'
                )
                teacher_user.school = school
                teacher_user.save()
                
                teacher_profile, created = TeacherProfile.objects.get_or_create(
                    user=teacher_user,
                    defaults={
                        'employee_id': 'T001',
                        'qualification': 'M.Ed in Mathematics',
                        'experience_years': 8,
                        'phone': '+1-555-234-5678',
                        'address': '456 Teacher Lane, Learning City, LC 12345',
                        'emergency_contact': '+1-555-234-5679',
                        'specialization': 'Mathematics and Science'
                    }
                )
                print(f"✅ Teacher created: teacher@school.edu / password")

            # Create student
            if not User.objects.filter(email='student@school.edu').exists():
                student_user = User.objects.create_user(
                    email='student@school.edu',
                    password='password',
                    first_name='Emma',
                    last_name='Wilson',
                    role='STUDENT'
                )
                student_user.school = school
                student_user.save()

                student_profile, created = StudentProfile.objects.get_or_create(
                    user=student_user,
                    defaults={
                        'student_id': 'S001',
                        'grade': '10',
                        'section': 'A',
                        'roll_number': '101',
                        'phone': '+1-555-345-6789',
                        'address': '789 Student Street, Learning City, LC 12345',
                        'emergency_contact': '+1-555-345-6790',
                        'date_of_birth': '2008-05-15',
                        'blood_group': 'A+',
                        'guardian_name': 'Michael Wilson',
                        'guardian_phone': '+1-555-345-6791'
                    }
                )
                print(f"✅ Student created: student@school.edu / password")

            # Create parent
            if not User.objects.filter(email='parent@school.edu').exists():
                parent_user = User.objects.create_user(
                    email='parent@school.edu',
                    password='password',
                    first_name='Michael',
                    last_name='Wilson',
                    role='PARENT'
                )
                parent_user.school = school
                parent_user.save()

                parent_profile, created = ParentProfile.objects.get_or_create(
                    user=parent_user,
                    defaults={
                        'phone': '+1-555-345-6791',
                        'address': '789 Student Street, Learning City, LC 12345',
                        'occupation': 'Software Engineer',
                        'emergency_contact': '+1-555-345-6792'
                    }
                )
                
                # Link parent to student
                if student_profile:
                    parent_profile.children.add(student_profile)
                
                print(f"✅ Parent created: parent@school.edu / password")

            # Create classes
            classes_data = [
                {'name': 'Class 10A', 'grade': '10', 'section': 'A'},
                {'name': 'Class 10B', 'grade': '10', 'section': 'B'},
                {'name': 'Class 9A', 'grade': '9', 'section': 'A'},
                {'name': 'Class 9B', 'grade': '9', 'section': 'B'},
            ]

            for class_data in classes_data:
                class_obj, created = Class.objects.get_or_create(
                    name=class_data['name'],
                    defaults={
                        'grade': class_data['grade'],
                        'section': class_data['section'],
                        'academic_year': '2024-25',
                        'school': school
                    }
                )
                if created:
                    print(f"✅ Class created: {class_obj.name}")

            # Create subjects
            subjects_data = [
                {'name': 'Mathematics', 'code': 'MATH101', 'description': 'Advanced Mathematics'},
                {'name': 'English', 'code': 'ENG101', 'description': 'English Language and Literature'},
                {'name': 'Science', 'code': 'SCI101', 'description': 'General Science'},
                {'name': 'History', 'code': 'HIST101', 'description': 'World History'},
                {'name': 'Geography', 'code': 'GEO101', 'description': 'Physical and Human Geography'},
            ]

            for subject_data in subjects_data:
                subject, created = Subject.objects.get_or_create(
                    code=subject_data['code'],
                    defaults={
                        'name': subject_data['name'],
                        'description': subject_data['description'],
                        'school': school
                    }
                )
                if created:
                    print(f"✅ Subject created: {subject.name}")

            print("\n🎉 Sample data creation completed successfully!")
            print("\n📋 Login Credentials:")
            print("=" * 50)
            print("Admin Panel: http://0.0.0.0:5000/admin/")
            print("Superuser: admin@school.edu / admin123")
            print("\nPortal Login: http://0.0.0.0:5000/")
            print("Principal: principal@school.edu / password")
            print("Teacher: teacher@school.edu / password")
            print("Student: student@school.edu / password")
            print("Parent: parent@school.edu / password")
            print("=" * 50)

    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        return False

    return True

if __name__ == '__main__':
    print("🚀 Setting up School LMS with sample data...")
    success = create_sample_data()
    if success:
        print("\n✅ Setup completed successfully!")
    else:
        print("\n❌ Setup failed!")
        sys.exit(1)
