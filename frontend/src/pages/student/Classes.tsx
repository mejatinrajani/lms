
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const Classes: React.FC = () => {
  // Mock data for classes
  const [classes] = useState([
    {
      id: 1,
      name: 'Mathematics',
      teacher: 'Mr. Johnson',
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 101',
      progress: 75,
      assignments: 12,
      completedAssignments: 9,
      upcomingAssignment: {
        title: 'Calculus Quiz',
        dueDate: '2025-05-20'
      }
    },
    {
      id: 2,
      name: 'Physics',
      teacher: 'Mrs. Smith',
      schedule: 'Tue, Thu - 10:30 AM',
      room: 'Room 203',
      progress: 82,
      assignments: 10,
      completedAssignments: 8,
      upcomingAssignment: {
        title: 'Force and Motion Lab Report',
        dueDate: '2025-05-18'
      }
    },
    {
      id: 3,
      name: 'English Literature',
      teacher: 'Ms. Davis',
      schedule: 'Mon, Wed - 1:15 PM',
      room: 'Room 305',
      progress: 90,
      assignments: 8,
      completedAssignments: 7,
      upcomingAssignment: {
        title: 'Essay on Shakespeare',
        dueDate: '2025-05-25'
      }
    },
    {
      id: 4,
      name: 'History',
      teacher: 'Mr. Wilson',
      schedule: 'Tue, Thu - 2:45 PM',
      room: 'Room 108',
      progress: 65,
      assignments: 7,
      completedAssignments: 5,
      upcomingAssignment: {
        title: 'World War II Research Project',
        dueDate: '2025-05-30'
      }
    },
    {
      id: 5,
      name: 'Biology',
      teacher: 'Dr. Thompson',
      schedule: 'Wed, Fri - 11:00 AM',
      room: 'Lab 2',
      progress: 88,
      assignments: 9,
      completedAssignments: 8,
      upcomingAssignment: {
        title: 'Ecosystem Analysis',
        dueDate: '2025-05-22'
      }
    }
  ]);

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <Link to="/student" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Classes</h1>
              <p className="text-muted-foreground">
                View and manage your enrolled classes
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="p-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map(cls => (
                <Card key={cls.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{cls.name}</CardTitle>
                      <Badge variant="outline">{`Room ${cls.room}`}</Badge>
                    </div>
                    <CardDescription>{cls.teacher}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.schedule}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{cls.progress}%</span>
                        </div>
                        <Progress value={cls.progress} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Next Assignment</div>
                        <div className="bg-muted/50 rounded-md p-2 text-sm">
                          <div className="font-medium">{cls.upcomingAssignment.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(cls.upcomingAssignment.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Completed: {cls.completedAssignments} / {cls.assignments}</span>
                      </div>

                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link to={`/student/classes/${cls.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="p-0">
            <div className="space-y-4">
              {classes.map(cls => (
                <Card key={cls.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full text-primary">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-lg">{cls.name}</h3>
                            <p className="text-sm text-muted-foreground">{cls.teacher}</p>
                          </div>
                          <Badge variant="outline">{`Room ${cls.room}`}</Badge>
                        </div>
                        <div className="flex items-center gap-6 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{cls.schedule}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{cls.completedAssignments} of {cls.assignments} assignments</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>25 students</span>
                          </div>
                          <div className="flex-1 text-right">
                            <Button size="sm" asChild>
                              <Link to={`/student/classes/${cls.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Classes;
