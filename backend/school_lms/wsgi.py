
"""
WSGI config for school_lms project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_lms.settings')

application = get_wsgi_application()
