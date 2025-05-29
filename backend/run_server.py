
#!/usr/bin/env python3
"""
Django development server runner for School LMS
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_lms.settings')
    
    # Check if setup is needed
    if len(sys.argv) > 1 and sys.argv[1] == 'setup':
        import subprocess
        print("Running initial setup...")
        subprocess.run([sys.executable, 'setup.py'])
        sys.exit(0)
    
    # Start the server
    print("Starting School LMS Django Backend...")
    print("Server will be available at: http://localhost:5000")
    print("Admin panel: http://localhost:5000/admin/")
    print("API endpoints: http://localhost:5000/api/")
    print("\nPress Ctrl+C to stop the server\n")
    
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:5000'])
