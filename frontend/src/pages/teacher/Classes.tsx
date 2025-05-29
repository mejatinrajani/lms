
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  Users,
  Clock,
  MapPin,
  BookOpen,
  FileText,
  CheckSquare
} from 'lucide-react';

interface ClassData {
  id: number;
  name: string;
  grade: string;
  section: string;
  students: number;
  room: string;
  schedule: string;
  time: string;
  nextTopic: string;
  pendingAssignments: number;
  attendanceNeeded: boolean;
}

const Classes: React.FC = () => {
  const classes: ClassData[] = [
    {
      id: 1,
      name: 'Mathematics',
      grade: '10',
      section: 'A',
      students: 32,
      room: '101',
      schedule: 'Mon, Wed, Fri',
      time: '09:00 - 09:45',
      nextTopic: 'Quadratic Equations',
      pendingAssignments: 2,
      attendanceNeeded: true
    },
    {
      id: 2,
      name: 'Mathematics',
      grade: '9',
      section: 'B',
      students: 28,
      room: '102',
      schedule: 'Mon, Wed, Fri',
      time: '10:00 - 10:45',
      nextTopic: 'Linear Algebra',
      pendingAssignments: 1,
      attendanceNeeded: true
    },
    {
      id: 3,
      name: 'Mathematics',
      grade: '11',
      section: 'C',
      students: 30,
      room: '103',
      schedule: 'Tue, Thu',
      time: '11:00 - 12:15',
      nextTopic: 'Calculus Fundamentals',
      pendingAssignments: 0,
      attendanceNeeded: false
    }
  ];

  const todayClasses = classes.filter((_, index) => index < 2);
  
  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">My Classes</h1>
          <p className="text-muted-foreground">
            Manage your teaching classes and activities
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" /> Today's Classes
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.length > 0 ? (
                todayClasses.map(cls => (
                  <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <div className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{cls.name} - Grade {cls.grade}{cls.section}</h3>
                          <div className="flex flex-wrap mt-1 gap-y-1">
                            <span className="flex items-center text-sm text-muted-foreground mr-4">
                              <Clock className="h-4 w-4 mr-1" />
                              {cls.time}
                            </span>
                            <span className="flex items-center text-sm text-muted-foreground mr-4">
                              <MapPin className="h-4 w-4 mr-1" />
                              Room {cls.room}
                            </span>
                            <span className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              {cls.students} students
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {cls.attendanceNeeded && (
                        <Button variant="secondary" size="sm" className="flex items-center">
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Mark Attendance
                        </Button>
                      )}
                      <Button size="sm">Class Details</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No classes scheduled for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="recent">Recent Activities</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Lessons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-0 border-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map(cls => (
                <Card key={cls.id} className="overflow-hidden">
                  <div className="bg-primary/10 p-4">
                    <h3 className="text-lg font-medium">{cls.name}</h3>
                    <Badge variant="outline" className="mt-1">Grade {cls.grade}{cls.section}</Badge>
                  </div>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Students</span>
                        <span className="font-medium">{cls.students}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Schedule</span>
                        <span className="font-medium">{cls.schedule}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Room</span>
                        <span className="font-medium">{cls.room}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Next Topic</span>
                        <span className="font-medium">{cls.nextTopic}</span>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span>{cls.pendingAssignments} pending assignments</span>
                          </div>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="p-0 border-none">
            <Card>
              <CardHeader>
                <CardTitle>Recent Class Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">Recent class activities will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="p-0 border-none">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">Upcoming lessons and topics will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Classes;
