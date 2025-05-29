import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  GraduationCap, 
  Medal, 
  MessageSquare, 
  User 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChildDetail: React.FC = () => {
  const { childId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock student data
  const student = {
    id: childId,
    name: 'Alex Johnson',
    grade: '10th Grade',
    school: 'Springfield High School',
    profileImage: '',
    teacher: 'Ms. Rebecca Martinez',
    attendance: {
      present: 156,
      absent: 4,
      late: 2,
      total: 162
    },
    contactInfo: {
      email: 'alex.j@studentmail.com',
      phone: '(555) 123-4567'
    },
    academics: {
      gpa: '3.8',
      rankInClass: '15/120',
      subjects: [
        { name: 'Mathematics', grade: 'A', percentage: 92 },
        { name: 'Science', grade: 'A-', percentage: 89 },
        { name: 'English', grade: 'B+', percentage: 87 },
        { name: 'History', grade: 'B', percentage: 84 },
        { name: 'Art', grade: 'A', percentage: 95 }
      ]
    },
    upcomingEvents: [
      { date: 'May 20, 2025', title: 'Math Final Exam', type: 'exam' },
      { date: 'May 22, 2025', title: 'Science Project Due', type: 'assignment' },
      { date: 'May 25, 2025', title: 'Parent-Teacher Conference', type: 'meeting' },
      { date: 'May 30, 2025', title: 'End of Year Ceremony', type: 'event' }
    ],
    recentAssignments: [
      { title: 'English Essay', subject: 'English', status: 'submitted', grade: '92/100', due: 'May 15, 2025' },
      { title: 'Chemistry Lab Report', subject: 'Science', status: 'graded', grade: '88/100', due: 'May 10, 2025' },
      { title: 'History Research Paper', subject: 'History', status: 'graded', grade: '85/100', due: 'May 5, 2025' },
      { title: 'Geometry Problems', subject: 'Mathematics', status: 'submitted', grade: 'pending', due: 'May 12, 2025' }
    ],
    announcements: [
      { date: 'May 16, 2025', title: 'Field Trip Permission Slip Due', content: 'Please submit the signed permission slip for the science museum trip by Monday.' },
      { date: 'May 14, 2025', title: 'Early Dismissal Next Friday', content: 'School will end at 12:30pm next Friday for teacher development.' },
      { date: 'May 10, 2025', title: 'Summer School Registration Open', content: 'Registration for summer enrichment programs is now available online.' }
    ]
  };

  const attendancePercentage = Math.round((student.attendance.present / student.attendance.total) * 100);

  // Helper function for badge color
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'graded': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'late': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch(type) {
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'assignment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'event': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <div>
          <Link to="/parent" className="flex items-center text-muted-foreground hover:text-primary mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          
          {/* Student Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={student.profileImage} alt={student.name} />
              <AvatarFallback className="text-lg">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{student.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-muted-foreground">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span>{student.grade}</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{student.school}</span>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <Button variant="outline" className="mr-2">Contact Teacher</Button>
              <Button asChild>
                <Link to={`/parent/child/${childId}/performance`}>Academic Performance</Link>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="academics">Academics</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="messages">Communications</TabsTrigger>
            </TabsList>
            
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="p-0">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6 md:col-span-2">
                  {/* Academic Summary Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <Medal className="mr-2 h-5 w-5" /> Academic Summary
                      </CardTitle>
                      <CardDescription>Current academic performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border rounded-md p-3">
                          <div className="text-sm font-medium mb-1">GPA</div>
                          <div className="text-3xl font-bold">{student.academics.gpa}</div>
                        </div>
                        <div className="border rounded-md p-3">
                          <div className="text-sm font-medium mb-1">Class Rank</div>
                          <div className="text-3xl font-bold">{student.academics.rankInClass}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {student.academics.subjects.map((subject) => (
                          <div key={subject.name} className="space-y-1">
                            <div className="flex justify-between text-sm font-medium">
                              <span>{subject.name}</span>
                              <span>{subject.grade} ({subject.percentage}%)</span>
                            </div>
                            <Progress value={subject.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Assignments */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5" /> Recent Assignments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {student.recentAssignments.map((assignment, index) => (
                          <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0">
                            <div>
                              <div className="font-medium">{assignment.title}</div>
                              <div className="text-sm text-muted-foreground">{assignment.subject} • Due: {assignment.due}</div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge variant="outline" className={getStatusBadgeColor(assignment.status)}>
                                {assignment.status}
                              </Badge>
                              <div className="text-sm mt-1">{assignment.grade}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Student Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5" /> Student Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Homeroom Teacher</div>
                          <div className="font-medium">{student.teacher}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium">{student.contactInfo.email}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Phone</div>
                          <div className="font-medium">{student.contactInfo.phone}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Attendance Summary Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle2 className="mr-2 h-5 w-5" /> Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Attendance Rate</span>
                          <span>{attendancePercentage}%</span>
                        </div>
                        <Progress value={attendancePercentage} className="h-2" />
                        
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center p-2 bg-green-50 rounded-md">
                            <div className="text-lg font-bold text-green-600">{student.attendance.present}</div>
                            <div className="text-xs text-muted-foreground">Present</div>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded-md">
                            <div className="text-lg font-bold text-red-600">{student.attendance.absent}</div>
                            <div className="text-xs text-muted-foreground">Absent</div>
                          </div>
                          <div className="text-center p-2 bg-yellow-50 rounded-md">
                            <div className="text-lg font-bold text-yellow-600">{student.attendance.late}</div>
                            <div className="text-xs text-muted-foreground">Late</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Upcoming Events Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" /> Upcoming Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {student.upcomingEvents.map((event, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-muted-foreground">{event.date}</div>
                            </div>
                            <Badge variant="outline" className={getEventBadgeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Other tabs would go here */}
            <TabsContent value="academics" className="p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Details</CardTitle>
                  <CardDescription>Comprehensive view of your child's academic performance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Detailed academic content would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                  <CardDescription>Complete attendance history for the academic year.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Detailed attendance records would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Calendar</CardTitle>
                  <CardDescription>Schedule of classes, exams, and important events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Calendar view would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages" className="p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Communications</CardTitle>
                  <CardDescription>Messages from teachers and school administration.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Message history would go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChildDetail;
