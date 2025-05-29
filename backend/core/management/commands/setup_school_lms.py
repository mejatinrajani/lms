
#!/usr/bin/env python3

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from datetime import datetime, time, timedelta
import random

from core.models import School, Class, Subject, StudentProfile, TeacherProfile, ParentProfile
from academic.models import Exam, Grade, Timetable
from attendance.models import AttendanceRecord
from assignments.models import Assignment, AssignmentSubmission
from notices.models import Notice
from fees.models import FeeStructure, FeePayment
from resources.models import Resource

User = get_user_model()

class Command(BaseCommand):
    help = 'Set up School LMS with sample data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Setting up School LMS...'))
        
        with transaction.atomic():
            # Create superuser
            self.create_superuser()
            
            # Create school
            school = self.create_school()
            
            # Create subjects
            subjects = self.create_subjects(school)
            
            # Create classes
            classes = self.create_classes(school)
            
            # Create users and profiles
            principal = self.create_principal(school)
            teachers = self.create_teachers(school, subjects)
            students = self.create_students(school, classes)
            parents = self.create_parents(students)
            
            # Create academic data
            self.create_timetables(classes, subjects, teachers)
            self.create_exams(classes, subjects, teachers)
            self.create_assignments(classes, subjects, teachers)
            self.create_attendance_records(students, classes)
            self.create_notices(school, [principal] + teachers)
            self.create_fee_structures(school, classes)
            self.create_resources(subjects, teachers)
            
            self.stdout.write(
                self.style.SUCCESS('Successfully set up School LMS with sample data!')
            )
    
    def create_superuser(self):
        if not User.objects.filter(email='admin@schoollms.com').exists():
            User.objects.create_superuser(
                email='admin@schoollms.com',
                password='admin123',
                first_name='Super',
                last_name='Admin',
                role='developer'
            )
            self.stdout.write('Created superuser: admin@schoollms.com / admin123')
    
    def create_school(self):
        school, created = School.objects.get_or_create(
            name='Demo High School',
            defaults={
                'address': '123 Education Street, Learning City, LC 12345',
                'phone': '+1-555-0123',
                'email': 'info@demohighschool.edu',
                'website': 'https://demohighschool.edu',
                'principal_name': 'Dr. Jane Smith',
                'established_year': 1995,
                'board_affiliation': 'CBSE',
                'school_code': 'DHS001'
            }
        )
        if created:
            self.stdout.write(f'Created school: {school.name}')
        return school
    
    def create_subjects(self, school):
        subject_data = [
            ('Mathematics', 'MATH'),
            ('English', 'ENG'),
            ('Science', 'SCI'),
            ('History', 'HIST'),
            ('Geography', 'GEO'),
            ('Computer Science', 'CS'),
            ('Physical Education', 'PE'),
            ('Art', 'ART')
        ]
        
        subjects = []
        for name, code in subject_data:
            subject, created = Subject.objects.get_or_create(
                name=name,
                school=school,
                defaults={'code': code, 'description': f'{name} subject'}
            )
            subjects.append(subject)
            if created:
                self.stdout.write(f'Created subject: {name}')
        
        return subjects
    
    def create_classes(self, school):
        class_data = [
            ('Grade 1', '1'),
            ('Grade 2', '2'),
            ('Grade 3', '3'),
            ('Grade 4', '4'),
            ('Grade 5', '5'),
            ('Grade 6', '6'),
            ('Grade 7', '7'),
            ('Grade 8', '8'),
            ('Grade 9', '9'),
            ('Grade 10', '10')
        ]
        
        classes = []
        for name, grade in class_data:
            class_obj, created = Class.objects.get_or_create(
                name=name,
                school=school,
                defaults={
                    'grade': grade,
                    'section': 'A',
                    'academic_year': '2024-25'
                }
            )
            classes.append(class_obj)
            if created:
                self.stdout.write(f'Created class: {name}')
        
        return classes
    
    def create_principal(self, school):
        user, created = User.objects.get_or_create(
            email='principal@demohighschool.edu',
            defaults={
                'password': 'principal123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'principal',
                'phone': '+1-555-0124'
            }
        )
        if created:
            user.set_password('principal123')
            user.save()
            self.stdout.write('Created principal: principal@demohighschool.edu / principal123')
        
        return user
    
    def create_teachers(self, school, subjects):
        teacher_data = [
            ('John', 'Doe', 'john.doe@demohighschool.edu', 'Mathematics'),
            ('Sarah', 'Johnson', 'sarah.johnson@demohighschool.edu', 'English'),
            ('Michael', 'Brown', 'michael.brown@demohighschool.edu', 'Science'),
            ('Emily', 'Davis', 'emily.davis@demohighschool.edu', 'History'),
            ('David', 'Wilson', 'david.wilson@demohighschool.edu', 'Geography'),
            ('Lisa', 'Anderson', 'lisa.anderson@demohighschool.edu', 'Computer Science'),
            ('Robert', 'Taylor', 'robert.taylor@demohighschool.edu', 'Physical Education'),
            ('Amanda', 'Miller', 'amanda.miller@demohighschool.edu', 'Art')
        ]
        
        teachers = []
        for first_name, last_name, email, subject_name in teacher_data:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'teacher',
                    'phone': f'+1-555-{random.randint(1000, 9999)}'
                }
            )
            if created:
                user.set_password('teacher123')
                user.save()
                
                # Create teacher profile
                subject = subjects[0]  # Default to first subject
                for s in subjects:
                    if s.name == subject_name:
                        subject = s
                        break
                
                TeacherProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'school': school,
                        'employee_id': f'T{random.randint(1000, 9999)}',
                        'qualification': 'Masters Degree',
                        'experience_years': random.randint(1, 20),
                        'join_date': timezone.now().date() - timedelta(days=random.randint(30, 1000))
                    }
                )
                
                self.stdout.write(f'Created teacher: {email} / teacher123')
            
            teachers.append(user)
        
        return teachers
    
    def create_students(self, school, classes):
        student_data = [
            ('Alice', 'Johnson', 'alice.johnson@email.com', 'Grade 9'),
            ('Bob', 'Smith', 'bob.smith@email.com', 'Grade 9'),
            ('Charlie', 'Brown', 'charlie.brown@email.com', 'Grade 10'),
            ('Diana', 'Wilson', 'diana.wilson@email.com', 'Grade 10'),
            ('Edward', 'Davis', 'edward.davis@email.com', 'Grade 8'),
            ('Fiona', 'Miller', 'fiona.miller@email.com', 'Grade 8'),
            ('George', 'Taylor', 'george.taylor@email.com', 'Grade 7'),
            ('Hannah', 'Anderson', 'hannah.anderson@email.com', 'Grade 7')
        ]
        
        students = []
        for first_name, last_name, email, class_name in student_data:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'student',
                    'phone': f'+1-555-{random.randint(1000, 9999)}'
                }
            )
            if created:
                user.set_password('student123')
                user.save()
                
                # Find the class
                class_obj = classes[0]  # Default to first class
                for c in classes:
                    if c.name == class_name:
                        class_obj = c
                        break
                
                # Create student profile
                StudentProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'school': school,
                        'student_class': class_obj,
                        'roll_number': f'{class_obj.grade}{random.randint(10, 99)}',
                        'admission_number': f'ADM{random.randint(1000, 9999)}',
                        'date_of_birth': timezone.now().date() - timedelta(days=random.randint(4000, 6000)),
                        'admission_date': timezone.now().date() - timedelta(days=random.randint(30, 1000)),
                        'father_name': f'{first_name} Father',
                        'mother_name': f'{first_name} Mother',
                        'address': f'{random.randint(1, 999)} Student Street, City, State 12345'
                    }
                )
                
                self.stdout.write(f'Created student: {email} / student123')
            
            students.append(user)
        
        return students
    
    def create_parents(self, students):
        parents = []
        for student_user in students:
            try:
                student_profile = StudentProfile.objects.get(user=student_user)
                
                # Create parent user
                parent_email = f'parent.{student_user.first_name.lower()}@email.com'
                parent_user, created = User.objects.get_or_create(
                    email=parent_email,
                    defaults={
                        'first_name': f'{student_user.first_name} Parent',
                        'last_name': student_user.last_name,
                        'role': 'parent',
                        'phone': f'+1-555-{random.randint(1000, 9999)}'
                    }
                )
                if created:
                    parent_user.set_password('parent123')
                    parent_user.save()
                    
                    # Create parent profile
                    ParentProfile.objects.get_or_create(
                        user=parent_user,
                        defaults={
                            'school': student_profile.school,
                            'occupation': random.choice(['Engineer', 'Doctor', 'Teacher', 'Business', 'Government']),
                            'address': student_profile.address
                        }
                    )
                    
                    # Link parent to student
                    parent_profile = ParentProfile.objects.get(user=parent_user)
                    parent_profile.children.add(student_profile)
                    
                    self.stdout.write(f'Created parent: {parent_email} / parent123')
                
                parents.append(parent_user)
            except StudentProfile.DoesNotExist:
                continue
        
        return parents
    
    def create_timetables(self, classes, subjects, teachers):
        for class_obj in classes[:3]:  # Only for first 3 classes
            for day in range(5):  # Monday to Friday
                for period in range(6):  # 6 periods per day
                    start_hour = 9 + period
                    Timetable.objects.get_or_create(
                        class_assigned=class_obj,
                        subject=random.choice(subjects),
                        teacher=random.choice(teachers),
                        weekday=day,
                        start_time=time(start_hour, 0),
                        end_time=time(start_hour + 1, 0),
                        defaults={'room_number': f'Room {random.randint(101, 299)}'}
                    )
        
        self.stdout.write('Created timetables')
    
    def create_exams(self, classes, subjects, teachers):
        exam_types = ['mid_term', 'final', 'unit_test', 'quiz']
        
        for class_obj in classes[:3]:
            for subject in subjects[:4]:
                for exam_type in exam_types[:2]:
                    Exam.objects.get_or_create(
                        name=f'{subject.name} {exam_type.replace("_", " ").title()}',
                        exam_type=exam_type,
                        class_assigned=class_obj,
                        subject=subject,
                        defaults={
                            'date': timezone.now().date() + timedelta(days=random.randint(1, 30)),
                            'start_time': time(10, 0),
                            'end_time': time(12, 0),
                            'max_marks': random.choice([50, 75, 100]),
                            'created_by': random.choice(teachers)
                        }
                    )
        
        self.stdout.write('Created exams')
    
    def create_assignments(self, classes, subjects, teachers):
        for class_obj in classes[:3]:
            for subject in subjects[:4]:
                Assignment.objects.get_or_create(
                    title=f'{subject.name} Assignment - {class_obj.name}',
                    defaults={
                        'description': f'Complete the {subject.name} exercises from chapter 1-3.',
                        'class_assigned': class_obj,
                        'subject': subject,
                        'assigned_by': random.choice(teachers),
                        'due_date': timezone.now().date() + timedelta(days=7),
                        'max_marks': 20
                    }
                )
        
        self.stdout.write('Created assignments')
    
    def create_attendance_records(self, students, classes):
        # Create attendance for last 10 days
        for i in range(10):
            date = timezone.now().date() - timedelta(days=i)
            for student_user in students[:4]:  # Only for first 4 students
                try:
                    student_profile = StudentProfile.objects.get(user=student_user)
                    AttendanceRecord.objects.get_or_create(
                        student=student_profile,
                        class_session=student_profile.student_class,
                        date=date,
                        defaults={
                            'status': random.choice(['present', 'absent', 'late']),
                            'marked_by': student_user  # Will be replaced with actual teacher
                        }
                    )
                except StudentProfile.DoesNotExist:
                    continue
        
        self.stdout.write('Created attendance records')
    
    def create_notices(self, school, users):
        notice_data = [
            ('School Reopening', 'School will reopen on Monday after the holidays.'),
            ('Sports Day', 'Annual sports day will be held next month.'),
            ('Parent Meeting', 'Parent-teacher meeting scheduled for next week.'),
            ('Exam Schedule', 'Mid-term exam schedule has been published.'),
            ('Holiday Notice', 'School will remain closed on national holiday.')
        ]
        
        for title, content in notice_data:
            Notice.objects.get_or_create(
                title=title,
                defaults={
                    'content': content,
                    'school': school,
                    'created_by': random.choice(users),
                    'priority': random.choice(['low', 'medium', 'high']),
                    'target_audience': random.choice(['all', 'students', 'teachers', 'parents'])
                }
            )
        
        self.stdout.write('Created notices')
    
    def create_fee_structures(self, school, classes):
        fee_types = ['tuition', 'library', 'sports', 'transport', 'exam']
        
        for class_obj in classes[:3]:
            for fee_type in fee_types:
                FeeStructure.objects.get_or_create(
                    class_assigned=class_obj,
                    fee_type=fee_type,
                    defaults={
                        'amount': random.randint(500, 2000),
                        'due_date': timezone.now().date() + timedelta(days=30),
                        'academic_year': '2024-25',
                        'is_mandatory': fee_type in ['tuition', 'exam']
                    }
                )
        
        self.stdout.write('Created fee structures')
    
    def create_resources(self, subjects, teachers):
        resource_types = ['pdf', 'video', 'link', 'document']
        
        for subject in subjects[:4]:
            for i in range(2):
                Resource.objects.get_or_create(
                    title=f'{subject.name} Study Material {i+1}',
                    defaults={
                        'description': f'Important study material for {subject.name}',
                        'subject': subject,
                        'resource_type': random.choice(resource_types),
                        'uploaded_by': random.choice(teachers),
                        'is_public': True
                    }
                )
        
        self.stdout.write('Created resources')
