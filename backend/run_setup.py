
#!/usr/bin/env python
import os
import sys
import subprocess

def run_command(command, description):
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("🚀 Setting up School LMS Backend...")
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_lms.settings')
    
    commands = [
        ("python manage.py makemigrations core", "Creating core migrations"),
        ("python manage.py makemigrations academic", "Creating academic migrations"),
        ("python manage.py makemigrations assignments", "Creating assignments migrations"),
        ("python manage.py makemigrations attendance", "Creating attendance migrations"),
        ("python manage.py makemigrations resources", "Creating resources migrations"),
        ("python manage.py makemigrations notices", "Creating notices migrations"),
        ("python manage.py makemigrations behavior", "Creating behavior migrations"),
        ("python manage.py makemigrations fees", "Creating fees migrations"),
        ("python manage.py makemigrations timetable", "Creating timetable migrations"),
        ("python manage.py migrate", "Running all migrations"),
        ("python setup_demo_data.py", "Creating demo data"),
    ]
    
    success_count = 0
    for command, description in commands:
        if run_command(command, description):
            success_count += 1
        else:
            print(f"\n⚠️  Setup partially completed ({success_count}/{len(commands)} steps successful)")
            return False
    
    print(f"\n🎉 Setup completed successfully! ({success_count}/{len(commands)} steps)")
    print("\n📝 Next steps:")
    print("1. Start the development server: python manage.py runserver 0.0.0.0:8000")
    print("2. Access admin panel: http://localhost:8000/admin")
    print("3. API documentation will be available at: http://localhost:8000/api/")
    
    return True

if __name__ == '__main__':
    main()
