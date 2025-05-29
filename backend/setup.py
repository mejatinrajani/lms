
#!/usr/bin/env python3
"""
Setup script for School LMS Django Backend
"""
import os
import sys
import subprocess

def run_command(command):
    """Run a command and handle errors"""
    print(f"Running: {command}")
    result = subprocess.run(command.split(), capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return False
    return True

def main():
    print("Setting up School LMS Django Backend...")
    
    # Install dependencies
    print("\n1. Installing dependencies...")
    if not run_command("pip install -r requirements.txt"):
        print("Failed to install dependencies")
        return False
    
    # Make migrations
    print("\n2. Creating migrations...")
    if not run_command("python manage.py makemigrations"):
        print("Failed to create migrations")
        return False
    
    # Apply migrations
    print("\n3. Applying migrations...")
    if not run_command("python manage.py migrate"):
        print("Failed to apply migrations")
        return False
    
    # Create sample data
    print("\n4. Creating sample data...")
    if not run_command("python manage.py create_sample_data"):
        print("Failed to create sample data")
        return False
    
    print("\n✅ Setup completed successfully!")
    print("\nTo start the development server, run:")
    print("python manage.py runserver 0.0.0.0:5000")
    print("\nAdmin panel will be available at: http://localhost:5000/admin/")
    print("API endpoints will be available at: http://localhost:5000/api/")

if __name__ == "__main__":
    main()
