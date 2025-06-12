
import json
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .models import AuditLog

class AuditLogMiddleware(MiddlewareMixin):
    """Middleware to log user actions for audit purposes"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        super().__init__(get_response)

    def __call__(self, request):
        response = self.get_response(request)
        
        # Log only authenticated users and specific methods
        if (request.user.is_authenticated and 
            request.method in ['POST', 'PUT', 'PATCH', 'DELETE'] and
            '/api/' in request.path and
            '/auth/' not in request.path):  # Skip auth endpoints
            
            self.log_action(request, response)
        
        return response

    def log_action(self, request, response):
        try:
            # Extract model and action from URL
            path_parts = request.path.strip('/').split('/')
            if len(path_parts) >= 2:
                model_name = path_parts[1] if path_parts[1] != 'api' else path_parts[2]
                
                action_map = {
                    'POST': 'CREATE',
                    'PUT': 'UPDATE',
                    'PATCH': 'UPDATE', 
                    'DELETE': 'DELETE'
                }
                
                action = action_map.get(request.method, 'UNKNOWN')
                
                # Get object ID if available
                object_id = path_parts[-1] if path_parts[-1].isdigit() else 'N/A'
                
                # Get client IP
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip_address = x_forwarded_for.split(',')[0]
                else:
                    ip_address = request.META.get('REMOTE_ADDR', '127.0.0.1')
                
                # Create audit log
                AuditLog.objects.create(
                    user=request.user,
                    action=action,
                    model_name=model_name,
                    object_id=object_id,
                    ip_address=ip_address,
                    details={
                        'path': request.path,
                        'method': request.method,
                        'status_code': response.status_code,
                        'user_agent': request.META.get('HTTP_USER_AGENT', '')[:200]
                    }
                )
        except Exception as e:
            # Don't let audit logging break the request
            pass

class CORSMiddleware(MiddlewareMixin):
    """Custom CORS middleware for additional security"""
    
    def process_response(self, request, response):
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, X-Requested-With"
        response["Access-Control-Allow-Credentials"] = "true"
        
        return response
