
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import School, Class, Subject, StudentProfile, TeacherProfile, ParentProfile, PrincipalProfile
from datetime import date

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for the School LMS'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create developer user
        developer, created = User.objects.get_or_create(
            username='developer',
            defaults={
                'email': 'developer@schoollms.com',
                'first_name': 'System',
                'last_name': 'Developer',
                'role': 'developer',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            developer.set_password('developer123')
            developer.save()
            self.stdout.write('Developer user created')
        
        # Create school
        school, created = School.objects.get_or_create(
            name='Springfield High School',
            defaults={
                'address': '123 Education Street, Springfield, IL',
                'phone': '(555) 123-4567',
                'email': 'info@springfieldhigh.edu',
                'website': 'www.springfieldhigh.edu',
                'established_date': date(1985, 1, 1),
                'academic_year': '2024-25'
            }
        )
        
        # Create principal
        principal, created = User.objects.get_or_create(
            username='principal',
            defaults={
                'email': 'principal@springfieldhigh.edu',
                'first_name': 'Robert',
                'last_name': 'Johnson',
                'role': 'principal',
                'phone': '(555) 123-4568',
            }
        )
        if created:
            principal.set_password('principal123')
            principal.save()
            
            PrincipalProfile.objects.create(
                user=principal,
                school=school,
                qualification='M.Ed',
                experience_years=15,
                joining_date=date(2010, 1, 1)
            )
            
            school.principal = principal
            school.save()
            self.stdout.write('Principal created')
        
        # Create subjects
        subjects_data = [
            ('Mathematics', 'MATH'),
            ('English', 'ENG'),
            ('Science', 'SCI'),
            ('Physics', 'PHY'),
            ('Chemistry', 'CHEM'),
            ('Biology', 'BIO'),
            ('History', 'HIST'),
            ('Geography', 'GEO'),
        ]
        
        subjects = []
        for name, code in subjects_data:
            subject, created = Subject.objects.get_or_create(
                name=name,
                code=code,
                school=school
            )
            subjects.append(subject)
        
        # Create classes
        classes_data = [
            ('9', 'A'),
            ('9', 'B'),
            ('10', 'A'),
            ('10', 'B'),
            ('11', 'A'),
            ('12', 'A'),
        ]
        
        classes = []
        for name, section in classes_data:
            class_obj, created = Class.objects.get_or_create(
                name=f'Class {name}',
                section=section,
                school=school,
                defaults={'description': f'Class {name} Section {section}'}
            )
            classes.append(class_obj)
        
        # Create teachers
        teachers_data = [
            ('sarah', 'Sarah', 'Williams', 'sarah@springfieldhigh.edu', 'Mathematics'),
            ('michael', 'Michael', 'Chen', 'michael@springfieldhigh.edu', 'English'),
            ('jennifer', 'Jennifer', 'Lopez', 'jennifer@springfieldhigh.edu', 'Science'),
            ('david', 'David', 'Miller', 'david@springfieldhigh.edu', 'Physics'),
        ]
        
        teachers = []
        for username, first_name, last_name, email, subject_name in teachers_data:
            teacher, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'teacher',
                    'phone': f'(555) {len(teachers)+200}-{len(teachers)+1000}',
                }
            )
            if created:
                teacher.set_password('teacher123')
                teacher.save()
                
                teacher_profile = TeacherProfile.objects.create(
                    user=teacher,
                    school=school,
                    qualification='B.Ed, M.A',
                    experience_years=5,
                    joining_date=date(2020, 1, 1)
                )
                
                # Assign subjects
                subject = Subject.objects.get(name=subject_name, school=school)
                teacher_profile.subjects.add(subject)
                
                # Assign classes
                teacher_profile.classes.add(classes[0], classes[1])
                
                teachers.append(teacher)
                self.stdout.write(f'Teacher {first_name} {last_name} created')
        
        # Create students and parents
        students_data = [
            ('john_doe', 'John', 'Doe', 'john@example.com', 'ST001', 0),
            ('jane_smith', 'Jane', 'Smith', 'jane@example.com', 'ST002', 0),
            ('alice_brown', 'Alice', 'Brown', 'alice@example.com', 'ST003', 1),
            ('bob_wilson', 'Bob', 'Wilson', 'bob@example.com', 'ST004', 1),
        ]
        
        for username, first_name, last_name, email, roll_no, class_idx in students_data:
            # Create student
            student, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'student',
                    'date_of_birth': date(2005, 1, 1),
                }
            )
            if created:
                student.set_password('student123')
                student.save()
                
                student_profile = StudentProfile.objects.create(
                    user=student,
                    roll_number=roll_no,
                    class_assigned=classes[class_idx],
                    school=school,
                    admission_date=date(2024, 1, 1),
                    blood_group='O+',
                )
                
                # Create parent
                parent_username = f"parent_{username}"
                parent, created = User.objects.get_or_create(
                    username=parent_username,
                    defaults={
                        'email': f'parent_{email}',
                        'first_name': f'{first_name} Parent',
                        'last_name': last_name,
                        'role': 'parent',
                        'phone': f'(555) {class_idx+300}-{class_idx+2000}',
                    }
                )
                if created:
                    parent.set_password('parent123')
                    parent.save()
                    
                    parent_profile = ParentProfile.objects.create(
                        user=parent,
                        school=school,
                        relationship='father',
                        occupation='Engineer'
                    )
                    parent_profile.children.add(student_profile)
                    
                    # Link parent to student
                    student_profile.parent = parent
                    student_profile.save()
                
                self.stdout.write(f'Student {first_name} {last_name} and parent created')
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        self.stdout.write('Login credentials:')
        self.stdout.write('Developer: developer / developer123')
        self.stdout.write('Principal: principal / principal123')
        self.stdout.write('Teacher: sarah / teacher123 (or michael, jennifer, david)')
        self.stdout.write('Student: john_doe / student123 (or jane_smith, alice_brown, bob_wilson)')
        self.stdout.write('Parent: parent_john_doe / parent123 (or parent_jane_smith, etc.)')
