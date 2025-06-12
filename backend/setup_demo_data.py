#!/usr/bin/env python
import os
import sys
import django
from datetime import date, datetime, timedelta
from django.contrib.auth import get_user_model
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_lms.settings')
django.setup()

from core.models import *
from academic.models import *
from assignments.models import *
from attendance.models import *
from resources.models import *
from notices.models import *
from behavior.models import *
from fees.models import FeeStructure, FeeType, FeeRecord
from attendance.models import AttendanceStatus
from timetable.models import *

User = get_user_model()

def create_demo_data():
    print("🚀 Creating demo data for School LMS...")

    # Create School
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

    # Create Users
    users_data = [
        {
            'username': 'admin',
            'email': 'admin@school.edu',
            'first_name': 'System',
            'last_name': 'Administrator',
            'role': 'DEVELOPER',
            'password': 'admin123'
        },
        {
            'username': 'principal',
            'email': 'principal@school.edu',
            'first_name': 'John',
            'last_name': 'Smith',
            'role': 'PRINCIPAL',
            'password': 'principal123'
        },
        {
            'username': 'teacher1',
            'email': 'teacher1@school.edu',
            'first_name': 'Alice',
            'last_name': 'Johnson',
            'role': 'TEACHER',
            'password': 'teacher123'
        },
        {
            'username': 'teacher2',
            'email': 'teacher2@school.edu',
            'first_name': 'Bob',
            'last_name': 'Williams',
            'role': 'TEACHER',
            'password': 'teacher123'
        },
        {
            'username': 'student1',
            'email': 'student1@school.edu',
            'first_name': 'Emma',
            'last_name': 'Davis',
            'role': 'STUDENT',
            'password': 'student123'
        },
        {
            'username': 'student2',
            'email': 'student2@school.edu',
            'first_name': 'Michael',
            'last_name': 'Brown',
            'role': 'STUDENT',
            'password': 'student123'
        },
        {
            'username': 'parent1',
            'email': 'parent1@school.edu',
            'first_name': 'David',
            'last_name': 'Davis',
            'role': 'PARENT',
            'password': 'parent123'
        },
        {
            'username': 'parent2',
            'email': 'parent2@school.edu',
            'first_name': 'Sarah',
            'last_name': 'Brown',
            'role': 'PARENT',
            'password': 'parent123'
        }
    ]

    users = {}
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults=user_data
        )
        if created:
            user.set_password(user_data['password'])
            user.save()
        users[user_data['username']] = user
        print(f"✅ User: {user.username} ({user.role})")

    # Update school principal
    school.principal = users['principal']
    school.save()

    # Create Classes and Sections
    classes_data = [
        {'name': 'Grade 9', 'sections': ['A', 'B']},
        {'name': 'Grade 10', 'sections': ['A', 'B']},
        {'name': 'Grade 11', 'sections': ['A', 'B']},
        {'name': 'Grade 12', 'sections': ['A', 'B']}
    ]

    classes = {}
    sections = {}
    for class_data in classes_data:
        cls, created = Class.objects.get_or_create(
            name=class_data['name'],
            school=school
        )
        classes[class_data['name']] = cls

        for section_name in class_data['sections']:
            section, created = Section.objects.get_or_create(
                name=section_name,
                class_assigned=cls,
                defaults={'max_students': 30}
            )
            sections[f"{class_data['name']}-{section_name}"] = section

        print(f"✅ Class: {cls.name} with sections: {class_data['sections']}")

    # Create Subjects
    subjects_data = [
        {'name': 'Mathematics', 'code': 'MATH'},
        {'name': 'English', 'code': 'ENG'},
        {'name': 'Science', 'code': 'SCI'},
        {'name': 'History', 'code': 'HIST'},
        {'name': 'Geography', 'code': 'GEO'},
        {'name': 'Physics', 'code': 'PHY'},
        {'name': 'Chemistry', 'code': 'CHEM'},
        {'name': 'Biology', 'code': 'BIO'}
    ]

    subjects = {}
    for subject_data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            code=subject_data['code'],
            defaults=subject_data
        )
        subjects[subject_data['code']] = subject
        print(f"✅ Subject: {subject.name}")

    # Create Teacher Profiles
    teacher_data = [
        {
            'user': users['teacher1'],
            'employee_id': 'T001',
            'subjects': ['MATH', 'PHY'],
            'sections': ['Grade 9-A', 'Grade 10-A'],
            'qualification': 'M.Sc Mathematics',
            'experience_years': 5
        },
        {
            'user': users['teacher2'],
            'employee_id': 'T002',
            'subjects': ['ENG', 'HIST'],
            'sections': ['Grade 9-B', 'Grade 10-B'],
            'qualification': 'M.A English',
            'experience_years': 8
        }
    ]

    teachers = {}
    for teacher_info in teacher_data:
        teacher, created = TeacherProfile.objects.get_or_create(
            user=teacher_info['user'],
            defaults={
                'employee_id': teacher_info['employee_id'],
                'school': school,
                'qualification': teacher_info['qualification'],
                'experience_years': teacher_info['experience_years']
            }
        )

        # Add subjects and sections
        for subject_code in teacher_info['subjects']:
            teacher.subjects.add(subjects[subject_code])

        for section_key in teacher_info['sections']:
            teacher.sections.add(sections[section_key])

        teachers[teacher_info['employee_id']] = teacher
        print(f"✅ Teacher: {teacher.full_name}")

    # Create Student Profiles
    student_data = [
        {
            'user': users['student1'],
            'student_id': 'S001',
            'class': 'Grade 10',
            'section': 'Grade 10-A',
            'roll_number': '101',
            'admission_date': date(2023, 4, 1),
            'emergency_contact': '+1-555-111-1111'
        },
        {
            'user': users['student2'],
            'student_id': 'S002',
            'class': 'Grade 10',
            'section': 'Grade 10-B',
            'roll_number': '102',
            'admission_date': date(2023, 4, 1),
            'emergency_contact': '+1-555-222-2222'
        }
    ]

    students = {}
    for student_info in student_data:
        student, created = StudentProfile.objects.get_or_create(
            user=student_info['user'],
            defaults={
                'student_id': student_info['student_id'],
                'school': school,
                'class_assigned': classes[student_info['class']],
                'section': sections[student_info['section']],
                'roll_number': student_info['roll_number'],
                'admission_date': student_info['admission_date'],
                'emergency_contact': student_info['emergency_contact']
            }
        )
        students[student_info['student_id']] = student
        print(f"✅ Student: {student.full_name}")

    # Create Parent Profiles
    parent_data = [
        {
            'user': users['parent1'],
            'children': ['S001'],
            'occupation': 'Engineer'
        },
        {
            'user': users['parent2'],
            'children': ['S002'],
            'occupation': 'Doctor'
        }
    ]

    for parent_info in parent_data:
        parent, created = ParentProfile.objects.get_or_create(
            user=parent_info['user'],
            defaults={
                'occupation': parent_info['occupation']
            }
        )

        for child_id in parent_info['children']:
            parent.children.add(students[child_id])

        print(f"✅ Parent: {parent.full_name}")

    # Create Academic Year
    academic_year, created = AcademicYear.objects.get_or_create(
        year='2023-2024',
        defaults={
            'start_date': date(2023, 4, 1),
            'end_date': date(2024, 3, 31),
            'is_current': True
        }
    )
    print(f"✅ Academic Year: {academic_year.year}")

    # Create Exam Types
    exam_types_data = [
        {'name': 'Unit Test', 'weightage': Decimal('20.00')},
        {'name': 'Mid Term', 'weightage': Decimal('30.00')},
        {'name': 'Final Exam', 'weightage': Decimal('50.00')}
    ]

    exam_types = {}
    for exam_type_data in exam_types_data:
        exam_type, created = ExamType.objects.get_or_create(
            name=exam_type_data['name'],
            defaults=exam_type_data
        )
        exam_types[exam_type_data['name']] = exam_type
        print(f"✅ Exam Type: {exam_type.name}")

    # Create Fee Types
    fee_types_data = [
        {'name': 'Tuition Fee', 'due_frequency': 'monthly', 'is_mandatory': True},
        {'name': 'Library Fee', 'due_frequency': 'yearly', 'is_mandatory': True},
        {'name': 'Sports Fee', 'due_frequency': 'yearly', 'is_mandatory': False}
    ]

    fee_types = {}
    for fee_type_data in fee_types_data:
        fee_type, created = FeeType.objects.get_or_create(
            name=fee_type_data['name'],
            defaults=fee_type_data
        )
        fee_types[fee_type_data['name']] = fee_type
        print(f"✅ Fee Type: {fee_type.name}")

    # Create Fee Structures
    for class_name, cls in classes.items():
        for fee_type_name, fee_type in fee_types.items():
            amount = Decimal('1000.00') if fee_type_name == 'Tuition Fee' else Decimal('500.00')
            fee_structure, created = FeeStructure.objects.get_or_create(
                fee_type=fee_type,
                class_assigned=cls,
                academic_year='2023-2024',
                defaults={'amount': amount}
            )
            if created:
                print(f"✅ Fee Structure: {fee_type_name} for {class_name}")

    # Create Attendance Statuses
    attendance_statuses = [
        {'name': 'Present', 'short_code': 'P', 'is_present': True, 'color_code': '#4CAF50'},
        {'name': 'Absent', 'short_code': 'A', 'is_present': False, 'color_code': '#F44336'},
        {'name': 'Late', 'short_code': 'L', 'is_present': True, 'color_code': '#FF9800'},
        {'name': 'Excused', 'short_code': 'E', 'is_present': True, 'color_code': '#2196F3'}
    ]

    for status_data in attendance_statuses:
        status, created = AttendanceStatus.objects.get_or_create(
            short_code=status_data['short_code'],
            defaults=status_data
        )
        if created:
            print(f"✅ Attendance Status: {status.name}")

    print("\n🎉 Demo data created successfully!")
    print("\nLogin credentials:")
    print("Developer: admin / admin123")
    print("Principal: principal / principal123")
    print("Teacher: teacher1 / teacher123")
    print("Student: student1 / student123")
    print("Parent: parent1 / parent123")

if __name__ == "__main__":
    create_demo_data()