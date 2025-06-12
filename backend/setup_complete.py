
#!/usr/bin/env python
import os
import sys
import django
from django.core.management import execute_from_command_line

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_lms.settings')

def run_setup():
    """Complete setup for the LMS"""
    print("🚀 Starting LMS Setup...")
    
    # Run migrations
    print("\n📦 Running migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Setup Django after migrations
    django.setup()
    
    # Create superuser
    print("\n👤 Creating users...")
    exec(open('create_superuser.py').read())
    
    # Setup demo data
    print("\n📊 Setting up demo data...")
    exec(open('setup_demo_data.py').read())
    
    print("\n✅ Setup completed successfully!")
    print("\n🌐 You can now start the server with: python manage.py runserver 0.0.0.0:8000")

if __name__ == '__main__':
    run_setup()
