#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_lms.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import School

def create_superuser():
    User = get_user_model()

    # Create school if it doesn't exist
    school, created = School.objects.get_or_create(
        name="Demo School",
        defaults={
            'address': '123 Education Street',
            'phone': '+1234567890',
            'email': 'admin@demoschool.edu',
            'website': 'https://demoschool.edu',
            'established_year': 2000,
        }
    )

    if created:
        print("✅ Created demo school")
    else:
        print("ℹ️ Demo school already exists")

    # Create superuser if it doesn't exist
    if not User.objects.filter(username='admin').exists():
        user = User.objects.create_user(
            username='admin',
            email='admin@demoschool.edu',
            password='admin123',
            first_name='Admin',
            last_name='User',
            user_type='developer',
            school=school,
            is_staff=True,
            is_superuser=True,
            is_active=True
        )
        print("✅ Created superuser: admin/admin123")
    else:
        print("ℹ️ Superuser already exists")

    # Create principal user if it doesn't exist
    if not User.objects.filter(username='principal').exists():
        principal = User.objects.create_user(
            username='principal',
            email='principal@demoschool.edu',
            password='principal123',
            first_name='Principal',
            last_name='Smith',
            user_type='principal',
            school=school,
            is_staff=True,
            is_active=True
        )
        print("✅ Created principal user: principal/principal123")
    else:
        print("ℹ️ Principal user already exists")

if __name__ == '__main__':
    create_superuser()
    print("\n🎉 Setup completed!")
    print("You can now login with:")
    print("  Admin: admin/admin123")
    print("  Principal: principal/principal123")