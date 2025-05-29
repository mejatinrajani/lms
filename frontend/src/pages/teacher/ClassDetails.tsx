
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp,
  FileText,
  CheckSquare,
  BarChart3
} from 'lucide-react';

const ClassDetails: React.FC = () => {
  const { classId } = useParams();
  
  const classInfo = {
    name: 'Mathematics',
    section: '10A',
    teacher: 'Mr. John Smith',
    students: 32,
    schedule: 'Mon, Wed, Fri - 09:00 AM',
    room: 'Room 101',
    description: 'Advanced mathematics covering algebra, geometry, and trigonometry'
  };

  const topics = [
    { id: 1, name: 'Linear Equations', status: 'completed', progress: 100 },
    { id: 2, name: 'Quadratic Functions', status: 'in-progress', progress: 75 },
    { id: 3, name: 'Trigonometry Basics', status: 'pending', progress: 0 },
    { id: 4, name: 'Coordinate Geometry', status: 'pending', progress: 0 }
  ];

  const students = [
    { id: 1, name: 'Alice Johnson', rollNo: '001', attendance: 95, avgGrade: 'A' },
    { id: 2, name: 'Bob Smith', rollNo: '002', attendance: 88, avgGrade: 'B+' },
    { id: 3, name: 'Charlie Brown', rollNo: '003', attendance: 92, avgGrade: 'A-' },
    { id: 4, name: 'Diana Prince', rollNo: '004', attendance: 87, avgGrade: 'B' }
  ];

  const assignments = [
    { id: 1, title: 'Algebra Problems Set 1', dueDate: '2025-05-25', submitted: 28, total: 32 },
    { id: 2, title: 'Geometry Worksheet', dueDate: '2025-05-22', submitted: 30, total: 32 },
    { id: 3, title: 'Trigonometry Quiz', dueDate: '2025-05-28', submitted: 15, total: 32 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher/classes" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Classes
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{classInfo.name} - {classInfo.section}</h1>
              <p className="text-muted-foreground">{classInfo.description}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to="/teacher/mark-attendance">Mark Attendance</Link>
              </Button>
              <Button asChild>
                <Link to="/teacher/assignments">Create Assignment</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{classInfo.students}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Attendance</p>
                  <p className="text-2xl font-bold">91%</p>
                </div>
                <CheckSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                  <p className="text-2xl font-bold">{assignments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Class Average</p>
                  <p className="text-2xl font-bold">B+</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span>{classInfo.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span>{classInfo.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teacher:</span>
                    <span>{classInfo.teacher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students:</span>
                    <span>{classInfo.students}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-2 border-blue-500 pl-3">
                      <p className="font-medium">Assignment graded</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-3">
                      <p className="font-medium">Attendance marked</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                    <div className="border-l-2 border-purple-500 pl-3">
                      <p className="font-medium">New assignment created</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student List</CardTitle>
                <CardDescription>All students enrolled in this class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground p-2 border-b">
                    <div>Roll No</div>
                    <div>Student Name</div>
                    <div>Attendance</div>
                    <div>Average Grade</div>
                  </div>
                  {students.map(student => (
                    <div key={student.id} className="grid grid-cols-4 gap-4 items-center p-3 border rounded-lg hover:bg-muted/50">
                      <div>
                        <Badge variant="outline">{student.rollNo}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                      <div>
                        <span className={student.attendance >= 90 ? 'text-green-600' : student.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'}>
                          {student.attendance}%
                        </span>
                      </div>
                      <div>
                        <Badge variant="secondary">{student.avgGrade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Assignments</CardTitle>
                  <Button asChild>
                    <Link to="/teacher/assignments">Create New</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <span className="text-sm text-muted-foreground">Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Submissions: {assignment.submitted}/{assignment.total}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/teacher/view-submissions">View Submissions</Link>
                        </Button>
                      </div>
                      <div className="mt-2">
                        <Progress value={(assignment.submitted / assignment.total) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="syllabus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Syllabus</CardTitle>
                <CardDescription>Topics covered in this course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topics.map(topic => (
                    <div key={topic.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{topic.name}</h3>
                        <Badge className={getStatusColor(topic.status)}>
                          {topic.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{topic.progress}%</span>
                        </div>
                        <Progress value={topic.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClassDetails;
