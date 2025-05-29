
```python
from django.core.management.base import BaseCommand
from django.conf import settings
import pymongo
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Setup MongoDB database and collections'

    def handle(self, *args, **options):
        try:
            # Connect to MongoDB
            client = MongoClient('mongodb://localhost:27017/')
            db = client['school_lms_db']
            
            # Create collections (Django will handle this automatically)
            self.stdout.write(
                self.style.SUCCESS('Successfully connected to MongoDB')
            )
            
            # Test connection
            db.command('ping')
            self.stdout.write(
                self.style.SUCCESS('MongoDB is ready for use')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to setup MongoDB: {str(e)}')
            )
            self.stdout.write(
                self.style.WARNING('Make sure MongoDB is running on localhost:27017')
            )
```
