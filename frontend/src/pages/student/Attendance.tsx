
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckSquare, Clock, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Attendance: React.FC = () => {
  // Mock attendance data
  const attendanceSummary = {
    present: 42,
    absent: 3,
    late: 2,
    total: 47,
    percentage: 89,
    currentMonth: 'May 2025'
  };

  const attendanceRecords = [
    { date: '2025-05-16', status: 'present', time: '08:55 AM', notes: '' },
    { date: '2025-05-15', status: 'present', time: '08:50 AM', notes: '' },
    { date: '2025-05-14', status: 'present', time: '08:48 AM', notes: '' },
    { date: '2025-05-13', status: 'late', time: '09:10 AM', notes: '10 minutes late' },
    { date: '2025-05-12', status: 'absent', time: '-', notes: 'Medical leave' },
    { date: '2025-05-11', status: 'present', time: '08:52 AM', notes: '' },
    { date: '2025-05-10', status: 'present', time: '08:55 AM', notes: '' },
    { date: '2025-05-09', status: 'present', time: '08:58 AM', notes: '' },
    { date: '2025-05-08', status: 'present', time: '08:50 AM', notes: '' },
    { date: '2025-05-07', status: 'absent', time: '-', notes: 'Family event' },
    { date: '2025-05-06', status: 'late', time: '09:05 AM', notes: '5 minutes late' },
    { date: '2025-05-05', status: 'present', time: '08:52 AM', notes: '' },
    { date: '2025-05-04', status: 'present', time: '08:50 AM', notes: '' },
    { date: '2025-05-03', status: 'present', time: '08:55 AM', notes: '' },
    { date: '2025-05-02', status: 'absent', time: '-', notes: 'Sick leave' },
    { date: '2025-05-01', status: 'present', time: '08:48 AM', notes: '' },
    { date: '2025-04-30', status: 'present', time: '08:52 AM', notes: '' },
    { date: '2025-04-29', status: 'present', time: '08:55 AM', notes: '' },
    { date: '2025-04-28', status: 'present', time: '08:50 AM', notes: '' },
    { date: '2025-04-27', status: 'present', time: '08:48 AM', notes: '' },
  ];

  const monthlyAttendance = [
    { month: 'January 2025', present: 18, absent: 2, late: 1, percentage: 85.7 },
    { month: 'February 2025', present: 19, absent: 1, late: 0, percentage: 95.0 },
    { month: 'March 2025', present: 21, absent: 1, late: 1, percentage: 91.3 },
    { month: 'April 2025', present: 20, absent: 2, late: 0, percentage: 90.9 },
    { month: 'May 2025', present: 15, absent: 3, late: 2, percentage: 75.0 }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'present':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <X className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <Link to="/student" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Attendance Records</h1>
          <p className="text-muted-foreground">
            View your attendance history and statistics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>Academic year 2024-2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-student">{attendanceSummary.percentage}%</div>
                <p className="text-sm text-muted-foreground">Overall Attendance Rate</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-md">
                  <div className="text-2xl font-semibold text-green-600">{attendanceSummary.present}</div>
                  <div className="text-xs text-green-800">Present</div>
                </div>
                <div className="p-3 bg-red-50 rounded-md">
                  <div className="text-2xl font-semibold text-red-600">{attendanceSummary.absent}</div>
                  <div className="text-xs text-red-800">Absent</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-md">
                  <div className="text-2xl font-semibold text-yellow-600">{attendanceSummary.late}</div>
                  <div className="text-xs text-yellow-800">Late</div>
                </div>
              </div>
              
              {attendanceSummary.percentage < 85 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div className="text-sm text-red-800">
                    Your attendance is below the required 85%. Please improve your attendance.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>Attendance statistics by month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyAttendance.map((month, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell>{month.present}</TableCell>
                      <TableCell>{month.absent}</TableCell>
                      <TableCell>{month.late}</TableCell>
                      <TableCell>
                        <Badge className={`${
                          month.percentage >= 90 ? 'bg-green-100 text-green-800' :
                          month.percentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {month.percentage}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Daily Attendance Log</CardTitle>
              <CardDescription>Record of your daily attendance</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" /> Calendar View
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Records</DropdownMenuItem>
                  <DropdownMenuItem>Present Only</DropdownMenuItem>
                  <DropdownMenuItem>Absent Only</DropdownMenuItem>
                  <DropdownMenuItem>Late Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record, index) => {
                  const date = new Date(record.date);
                  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{dayOfWeek}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record.status)}
                          <span>{getStatusBadge(record.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            <div className="mt-4 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Policy</CardTitle>
            <CardDescription>Important information about the school's attendance policy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">Minimum Attendance Requirement</h4>
              <p className="text-muted-foreground">Students must maintain a minimum of 85% attendance throughout the academic year.</p>
            </div>
            <div>
              <h4 className="font-medium">Reporting Absences</h4>
              <p className="text-muted-foreground">Parents must notify the school office by 9:00 AM if a student will be absent.</p>
            </div>
            <div>
              <h4 className="font-medium">Late Arrival</h4>
              <p className="text-muted-foreground">Students arriving after 9:00 AM must report to the school office before proceeding to class.</p>
            </div>
            <div>
              <h4 className="font-medium">Consequences of Low Attendance</h4>
              <p className="text-muted-foreground">Students with attendance below 85% may face academic penalties and parent-teacher meetings.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
