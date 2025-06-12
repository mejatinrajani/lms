
#!/usr/bin/env python
import os
import sys
import subprocess
import argparse

def run_command(command):
    return subprocess.run(command, shell=True)

def setup():
    """Setup the LMS with migrations and demo data"""
    print("🚀 Setting up School LMS...")
    return run_command("python run_setup.py")

def runserver():
    """Start the development server"""
    print("🌐 Starting development server...")
    return run_command("python manage.py runserver 0.0.0.0:8000")

def create_superuser():
    """Create a superuser"""
    print("👤 Creating superuser...")
    return run_command("python manage.py createsuperuser")

def reset_db():
    """Reset database and recreate with demo data"""
    print("🗄️  Resetting database...")
    if os.path.exists('db.sqlite3'):
        os.remove('db.sqlite3')
        print("✅ Database file removed")
    
    return run_command("python run_setup.py")

def shell():
    """Open Django shell"""
    print("🐍 Opening Django shell...")
    return run_command("python manage.py shell")

def main():
    parser = argparse.ArgumentParser(description='School LMS Management Script')
    parser.add_argument('command', choices=['setup', 'runserver', 'createsuperuser', 'reset', 'shell'],
                       help='Command to execute')
    
    args = parser.parse_args()
    
    commands = {
        'setup': setup,
        'runserver': runserver,
        'createsuperuser': create_superuser,
        'reset': reset_db,
        'shell': shell
    }
    
    return commands[args.command]()

if __name__ == '__main__':
    sys.exit(main().returncode)
