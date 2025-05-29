
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

const Attendance: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedChild, setSelectedChild] = useState('all');
  const [view, setView] = useState('month');

  // Mock data for children
  const children = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Smith' }
  ];

  // Mock data for attendance records
  const attendanceRecords: Record<string, AttendanceRecord[]> = {
    '1': [
      { date: '2025-05-01', status: 'present' },
      { date: '2025-05-02', status: 'present' },
      { date: '2025-05-03', status: 'absent', reason: 'Sick leave' },
      { date: '2025-05-04', status: 'present' },
      { date: '2025-05-05', status: 'late', reason: 'Traffic delay' },
      { date: '2025-05-06', status: 'present' },
      { date: '2025-05-07', status: 'present' }
    ],
    '2': [
      { date: '2025-05-01', status: 'present' },
      { date: '2025-05-02', status: 'present' },
      { date: '2025-05-03', status: 'present' },
      { date: '2025-05-04', status: 'present' },
      { date: '2025-05-05', status: 'present' },
      { date: '2025-05-06', status: 'absent', reason: 'Doctor appointment' },
      { date: '2025-05-07', status: 'present' }
    ]
  };

  const attendanceSummary = {
    '1': {
      present: 5,
      absent: 1,
      late: 1,
      total: 7,
      percentage: 71.4
    },
    '2': {
      present: 6,
      absent: 1,
      late: 0,
      total: 7,
      percentage: 85.7
    }
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late':
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getFilteredRecords = () => {
    if (selectedChild === 'all') {
      return Object.values(attendanceRecords).flat();
    }
    return attendanceRecords[selectedChild] || [];
  };

  const getCurrentChildSummary = () => {
    if (selectedChild === 'all') {
      const totalPresent = Object.values(attendanceSummary).reduce((sum, child) => sum + child.present, 0);
      const totalDays = Object.values(attendanceSummary).reduce((sum, child) => sum + child.total, 0);
      return {
        present: totalPresent,
        total: totalDays,
        percentage: (totalPresent / totalDays) * 100
      };
    }
    return attendanceSummary[selectedChild];
  };

  const summary = getCurrentChildSummary();

  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <div>
          <Link to="/parent" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Attendance Records</h1>
          <p className="text-muted-foreground">
            Track your child's attendance records
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Tabs defaultValue="month" onValueChange={setView} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="term">Term</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select defaultValue={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {children.map(child => (
                <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.percentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">{summary.present} days out of {summary.total}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Present Days</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="text-3xl font-bold">{summary.present}</div>
            </CardContent>
          </Card>
          
          {selectedChild !== 'all' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Absences & Late Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Absences: {attendanceSummary[selectedChild].absent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>Late: {attendanceSummary[selectedChild].late}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>Last 7 days attendance record</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredRecords().slice(0, 7).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <div className="font-medium">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Badge variant={record.status === 'present' ? 'outline' : record.status === 'absent' ? 'destructive' : 'secondary'}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                        {record.reason && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {record.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Late</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedChild !== 'all' && attendanceSummary[selectedChild].absent + attendanceSummary[selectedChild].late > 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <CardTitle className="text-amber-800">Attendance Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-amber-700">
              <p>Your child has missed {attendanceSummary[selectedChild].absent} days and been late {attendanceSummary[selectedChild].late} times this term.</p>
              <p className="mt-2">Please ensure regular attendance to support your child's academic progress.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
