
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  CheckSquare, 
  Bell,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const upcomingClasses = [
    { id: 1, name: 'Mathematics', time: '09:00 - 09:45', room: 'Room 101', teacher: 'Mr. Smith' },
    { id: 2, name: 'Science', time: '10:00 - 10:45', room: 'Lab 3', teacher: 'Mrs. Johnson' },
    { id: 3, name: 'English', time: '11:30 - 12:15', room: 'Room 105', teacher: 'Ms. Williams' }
  ];

  const pendingAssignments = [
    { id: 1, name: 'Algebra Problems', subject: 'Mathematics', due: '2025-05-20', progress: 30 },
    { id: 2, name: 'Science Project', subject: 'Science', due: '2025-05-25', progress: 60 },
    { id: 3, name: 'Essay Writing', subject: 'English', due: '2025-05-22', progress: 0 }
  ];

  const recentNotices = [
    { id: 1, title: 'Mid-Term Exam Schedule', date: '2025-05-16' },
    { id: 2, title: 'Sports Day Announcement', date: '2025-05-15' }
  ];

  const attendanceSummary = {
    present: 42,
    absent: 3,
    late: 2,
    total: 47,
    percentage: 89
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your academic overview.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" /> Today's Classes
                </CardTitle>
                <Badge variant="outline">
                  {upcomingClasses.length} Classes Today
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map(cls => (
                  <div key={cls.id} className="flex items-center p-3 border rounded-md">
                    <div className="bg-student/10 text-student p-3 rounded-full mr-4">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{cls.name}</h3>
                      <div className="flex text-sm text-muted-foreground">
                        <span className="mr-3">{cls.time}</span>
                        <span className="mr-3">{cls.room}</span>
                        <span>{cls.teacher}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/student/classes">View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/student/classes">View All Classes</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2" /> Attendance
              </CardTitle>
              <CardDescription>
                Your attendance this term
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-student">
                  {attendanceSummary.percentage}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Attendance Rate
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Present</span>
                  <span className="font-medium">{attendanceSummary.present} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Absent</span>
                  <span className="font-medium">{attendanceSummary.absent} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Late</span>
                  <span className="font-medium">{attendanceSummary.late} days</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/student/attendance">View Full Report</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" /> Pending Assignments
            </CardTitle>
            <CardDescription>
              Assignments that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAssignments.map(assignment => (
                <div key={assignment.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">{assignment.name}</h3>
                      <div className="text-sm text-muted-foreground flex items-center space-x-4">
                        <span>{assignment.subject}</span>
                        <span>Due: {new Date(assignment.due).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/student/assignments">Open</Link>
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm flex justify-between">
                      <span>Progress</span>
                      <span>{assignment.progress}%</span>
                    </div>
                    <Progress value={assignment.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/student/assignments">View All Assignments</Link>
            </Button>
          </CardFooter>
        </Card>

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
                <Link to="/student/notices">View All Notices</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" /> Learning Resources
              </CardTitle>
              <CardDescription>
                Recently added study materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-md p-3 hover:bg-muted/50">
                  <div className="font-medium">Mathematics Formula Sheet</div>
                  <div className="text-sm text-muted-foreground">
                    Added by: Mr. Smith | PDF
                  </div>
                </div>
                <div className="border rounded-md p-3 hover:bg-muted/50">
                  <div className="font-medium">Science Lab Guidelines</div>
                  <div className="text-sm text-muted-foreground">
                    Added by: Mrs. Johnson | PDF
                  </div>
                </div>
                <div className="border rounded-md p-3 hover:bg-muted/50">
                  <div className="font-medium">English Literature Notes</div>
                  <div className="text-sm text-muted-foreground">
                    Added by: Ms. Williams | DOC
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/student/resources">View All Resources</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
