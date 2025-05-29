
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  Calendar, 
  GraduationCap, 
  Bell,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ParentDashboard: React.FC = () => {
  const children = [
    { id: 1, name: 'John Smith', grade: '10A', age: 16 },
    { id: 2, name: 'Sarah Smith', grade: '8B', age: 14 }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2025-05-25', time: '16:00 - 18:00' },
    { id: 2, title: 'School Annual Day', date: '2025-06-15', time: '10:00 - 14:00' }
  ];

  const recentNotices = [
    { id: 1, title: 'Fee Payment Deadline Extension', date: '2025-05-15' },
    { id: 2, title: 'Summer Vacation Schedule', date: '2025-05-12' }
  ];

  const feeStatus = [
    { id: 1, child: 'John Smith', term: 'Term 2', amount: 500, status: 'Paid', dueDate: '2025-04-15', paid: true },
    { id: 2, child: 'Sarah Smith', term: 'Term 2', amount: 450, status: 'Pending', dueDate: '2025-05-20', paid: false }
  ];

  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome! Monitor your children's academic journey.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" /> My Children
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {children.map(child => (
                <div key={child.id} className="flex items-center p-3 border rounded-md">
                  <div className="bg-parent/10 text-parent p-3 rounded-full mr-4">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{child.name}</h3>
                    <div className="flex text-sm text-muted-foreground">
                      <span className="mr-3">Grade: {child.grade}</span>
                      <span>Age: {child.age}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/parent/child/${child.id}`}>Profile</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" /> Fee Status
                </CardTitle>
                <Badge variant="outline">View All</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeStatus.map(fee => (
                  <div key={fee.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">{fee.child} - {fee.term}</h3>
                        <div className="text-sm text-muted-foreground">
                          Due: {new Date(fee.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={fee.paid ? "secondary" : "outline"}>
                        {fee.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">${fee.amount}</span>
                      {!fee.paid && <Button size="sm">Pay Now</Button>}
                      {fee.paid && <Button variant="outline" size="sm">View Receipt</Button>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" /> Upcoming Events
              </CardTitle>
              <CardDescription>
                School events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                      <p>Time: {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/parent/calendar">View Full Calendar</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" /> Important Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotices.map(notice => (
                  <div key={notice.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <h3 className="font-medium">{notice.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Posted: {new Date(notice.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/parent/notices">View All Notices</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" /> Academic Performance
              </CardTitle>
              <CardDescription>
                Latest performance metrics for your children
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {children.map(child => (
                  <div key={child.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{child.name}</h3>
                      <Badge>Grade {child.grade}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Mathematics</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Science</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>English</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Detailed Reports</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
