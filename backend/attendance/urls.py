from django.urls import path
from . import views

urlpatterns = [
    path('', views.AttendanceRecordListView.as_view(), name='attendance-list'),
    path('bulk_mark/', views.mark_attendance_bulk, name='bulk-mark-attendance'),
    path('statistics/', views.attendance_statistics, name='attendance-statistics'),
    path('class-report/<int:class_id>/', views.class_attendance_report, name='class-attendance-report'),
    path('summary/', views.AttendanceSummaryListView.as_view(), name='attendance-summary'),
    path('status/', views.attendance_status, name='attendance-status'),
]