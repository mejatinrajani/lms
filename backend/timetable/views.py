from rest_framework import viewsets, permissions
from core.permissions import IsDeveloper, IsPrincipal, IsTeacher, IsStudent, IsParent
from .models import TimeSlot, Timetable
from .serializers import TimeSlotSerializer, TimetableSerializer
from django.db.models import Q

class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all().order_by('start_time')
    serializer_class = TimeSlotSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsPrincipal | IsTeacher | IsDeveloper]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsPrincipal | IsTeacher | IsDeveloper]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if hasattr(user, 'studentprofile'):
            student_profile = user.studentprofile
            queryset = queryset.filter(
                class_assigned=student_profile.class_assigned,
                section=student_profile.section,
                is_active=True
            )
        elif hasattr(user, 'parentprofile'):
            children = user.parentprofile.children.all()
            child_classes = [child.class_assigned for child in children]
            child_sections = [child.section for child in children]
            queryset = queryset.filter(
                class_assigned__in=child_classes,
                section__in=child_sections,
                is_active=True
            )
        elif hasattr(user, 'teacherprofile'):
            teacher_profile = user.teacherprofile
            queryset = queryset.filter(
                Q(section__in=teacher_profile.sections.all()) |
                Q(teacher=teacher_profile)
            ).distinct()
        # Principals, developers, and others see all
        return queryset.order_by('-created_at')