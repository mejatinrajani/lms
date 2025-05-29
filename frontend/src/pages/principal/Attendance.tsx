
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, AlertTriangle, ChevronDown, ChevronUp, Download } from 'lucide-react';

interface AttendanceData {
  id: number;
  grade: string;
  section: string;
  attendanceToday: number;
  totalStudents: number;
  attendanceRate: number;
  teacherName: string;
  marked: boolean;
}

interface ClassAttendanceChart {
  name: string;
  data: number[];
}

const Attendance: React.FC = () => {
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(today);
  const [view, setView] = useState<string>('today');
  
  // Mock data for attendance by class
  const classAttendance: AttendanceData[] = [
    {
      id: 1,
      grade: '10',
      section: 'A',
      attendanceToday: 30,
      totalStudents: 32,
      attendanceRate: 93.75,
      teacherName: 'Mr. Smith',
      marked: true
    },
    {
      id: 2,
      grade: '10',
      section: 'B',
      attendanceToday: 28,
      totalStudents: 30,
      attendanceRate: 93.33,
      teacherName: 'Ms. Johnson',
      marked: true
    },
    {
      id: 3,
      grade: '9',
      section: 'A',
      attendanceToday: 29,
      totalStudents: 33,
      attendanceRate: 87.88,
      teacherName: 'Mr. Brown',
      marked: true
    },
    {
      id: 4,
      grade: '9',
      section: 'B',
      attendanceToday: 27,
      totalStudents: 32,
      attendanceRate: 84.38,
      teacherName: 'Mrs. Taylor',
      marked: true
    },
    {
      id: 5,
      grade: '11',
      section: 'A',
      attendanceToday: 25,
      totalStudents: 28,
      attendanceRate: 89.29,
      teacherName: 'Ms. Miller',
      marked: false
    }
  ];

  // Chart data for attendance trend
  const attendanceChartData: ClassAttendanceChart[] = [
    {
      name: 'Grade 10',
      data: [92, 94, 90, 95, 93, 96, 92]
    },
    {
      name: 'Grade 9',
      data: [88, 85, 87, 89, 86, 90, 86]
    },
    {
      name: 'Grade 11',
      data: [91, 89, 92, 90, 88, 91, 89]
    }
  ];

  // Get overall attendance rate
  const overallAttendanceRate = classAttendance.reduce((acc, curr) => 
    acc + curr.attendanceToday, 0) / classAttendance.reduce((acc, curr) => 
    acc + curr.totalStudents, 0) * 100;

  // Get classes that haven't marked attendance
  const unmarkedClasses = classAttendance.filter(cls => !cls.marked);

  // Function to get attendance color based on rate
  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-amber-600';
    return 'text-red-600';
  };

  // Function to get progress bar color
  const getProgressColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-600';
    if (rate >= 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Attendance Overview</h1>
          <p className="text-muted-foreground">
            Monitor school-wide attendance and identify patterns
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs defaultValue="today" onValueChange={setView} className="w-full">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="custom">Custom Range</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setDate(today)}>
              Today
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(overallAttendanceRate)}%</div>
              <p className="text-xs text-muted-foreground">School-wide average</p>
              <Progress value={overallAttendanceRate} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Students Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {classAttendance.reduce((acc, curr) => acc + curr.attendanceToday, 0)}/
                {classAttendance.reduce((acc, curr) => acc + curr.totalStudents, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Students in attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Classes Marked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {classAttendance.filter(cls => cls.marked).length}/{classAttendance.length}
              </div>
              <p className="text-xs text-muted-foreground">Classes with attendance recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Trend</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="text-3xl font-bold text-green-600">↑ 2%</div>
              <p className="text-xs text-muted-foreground ml-2">Compared to last week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Today's Attendance by Class</CardTitle>
              <CardDescription>
                {date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Class</th>
                      <th className="text-left p-3 font-medium">Attendance</th>
                      <th className="text-left p-3 font-medium">Teacher</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-center p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classAttendance.map(cls => (
                      <tr key={cls.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div className="font-medium">Grade {cls.grade}{cls.section}</div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span>{cls.attendanceToday}/{cls.totalStudents}</span>
                              <span className={getAttendanceColor(cls.attendanceRate)}>
                                {cls.attendanceRate.toFixed(1)}%
                              </span>
                            </div>
                            <Progress 
                              value={cls.attendanceRate} 
                              className={`h-2 ${getProgressColor(cls.attendanceRate)}`} 
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <div>{cls.teacherName}</div>
                        </td>
                        <td className="p-3 text-center">
                          {cls.marked ? (
                            <Badge className="bg-green-100 text-green-800">Marked</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="outline" size="sm">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />

              {unmarkedClasses.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="font-medium text-amber-800">Attention Required</h3>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    {unmarkedClasses.length} classes have not marked attendance today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Last 7 days attendance by grade</CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <div className="text-center text-muted-foreground p-8">
              Attendance trend chart would be displayed here
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full flex justify-between">
              <div className="flex gap-4">
                {attendanceChartData.map((series, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-primary mr-2 opacity-${8 - index * 2}0`}></div>
                    <span className="text-sm">{series.name}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm">Show Details</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
