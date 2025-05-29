
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar as CalendarIcon, Download, Filter, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TeacherAttendanceRecord {
  id: number;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'on-leave';
  checkInTime?: string;
  checkOutTime?: string;
  reason?: string;
  markedBy: 'self' | 'principal';
}

const TeacherAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data for teacher attendance
  const [attendanceRecords] = useState<TeacherAttendanceRecord[]>([
    {
      id: 1,
      teacherId: 'T001',
      teacherName: 'John Smith',
      subject: 'Mathematics',
      date: '2025-05-26',
      status: 'present',
      checkInTime: '08:15',
      checkOutTime: '16:00',
      markedBy: 'self'
    },
    {
      id: 2,
      teacherId: 'T002',
      teacherName: 'Sarah Davis',
      subject: 'English',
      date: '2025-05-26',
      status: 'present',
      checkInTime: '08:00',
      checkOutTime: '15:45',
      markedBy: 'self'
    },
    {
      id: 3,
      teacherId: 'T003',
      teacherName: 'Michael Johnson',
      subject: 'Physics',
      date: '2025-05-26',
      status: 'absent',
      reason: 'Sick leave',
      markedBy: 'principal'
    },
    {
      id: 4,
      teacherId: 'T004',
      teacherName: 'Emily Wilson',
      subject: 'History',
      date: '2025-05-26',
      status: 'late',
      checkInTime: '08:45',
      checkOutTime: '16:10',
      markedBy: 'self'
    },
    {
      id: 5,
      teacherId: 'T005',
      teacherName: 'Robert Brown',
      subject: 'Biology',
      date: '2025-05-26',
      status: 'on-leave',
      reason: 'Personal leave',
      markedBy: 'principal'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Late</Badge>;
      case 'on-leave':
        return <Badge className="bg-blue-100 text-blue-800"><Calendar className="h-3 w-3 mr-1" />On Leave</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'on-leave':
        return <CalendarIcon className="h-4 w-4 text-blue-600" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  // Filter records based on search and status
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary statistics
  const totalTeachers = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
  const onLeaveCount = attendanceRecords.filter(r => r.status === 'on-leave').length;

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Teacher Attendance</h1>
              <p className="text-muted-foreground">
                Monitor and manage teacher attendance records
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{totalTeachers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Leave</p>
                  <p className="text-2xl font-bold text-blue-600">{onLeaveCount}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teachers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>
              Teacher Attendance - {format(selectedDate, "MMMM dd, yyyy")}
            </CardTitle>
            <CardDescription>
              Daily attendance records for all teachers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Teacher</th>
                    <th className="text-left p-4 font-medium">Subject</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Check In</th>
                    <th className="text-left p-4 font-medium">Check Out</th>
                    <th className="text-left p-4 font-medium">Reason</th>
                    <th className="text-left p-4 font-medium">Marked By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <div className="ml-3">
                            <div className="font-medium">{record.teacherName}</div>
                            <div className="text-sm text-muted-foreground">ID: {record.teacherId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{record.subject}</td>
                      <td className="p-4">{getStatusBadge(record.status)}</td>
                      <td className="p-4">{record.checkInTime || '-'}</td>
                      <td className="p-4">{record.checkOutTime || '-'}</td>
                      <td className="p-4">{record.reason || '-'}</td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {record.markedBy === 'self' ? 'Self-marked' : 'Principal'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
