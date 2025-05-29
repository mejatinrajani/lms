
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CheckSquare, 
  Bell,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
  Settings,
  UserPlus,
  FileText,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const PrincipalDashboard: React.FC = () => {
  const quickStats = {
    totalStudents: 847,
    totalTeachers: 45,
    totalClasses: 28,
    attendanceRate: 94,
    pendingApprovals: 12,
    activeNotices: 8
  };

  const recentActivities = [
    { id: 1, action: 'New teacher registration', user: 'Sarah Johnson', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Class timetable updated', user: 'System', time: '4 hours ago', type: 'update' },
    { id: 3, action: 'Important notice published', user: 'You', time: '1 day ago', type: 'notice' },
    { id: 4, action: 'Student admission approved', user: 'Admin Office', time: '2 days ago', type: 'approval' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Meeting', date: 'Jan 25, 2024', time: '2:00 PM' },
    { id: 2, title: 'Mid-term Examinations', date: 'Feb 1-15, 2024', time: 'All Day' },
    { id: 3, title: 'Annual Sports Day', date: 'Feb 20, 2024', time: '9:00 AM' }
  ];

  const pendingTasks = [
    { id: 1, task: 'Review teacher attendance reports', priority: 'high', dueDate: 'Today' },
    { id: 2, task: 'Approve new student admissions', priority: 'medium', dueDate: 'Tomorrow' },
    { id: 3, task: 'Update school policies', priority: 'low', dueDate: 'This Week' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Principal Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your school overview and management center.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/principal/notices">
                <Bell className="h-4 w-4 mr-2" />
                Create Notice
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/principal/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{quickStats.totalStudents}</div>
              <p className="text-xs text-blue-600">+12 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Teachers</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{quickStats.totalTeachers}</div>
              <p className="text-xs text-green-600">2 new this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{quickStats.totalClasses}</div>
              <p className="text-xs text-purple-600">All active</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Attendance</CardTitle>
              <CheckSquare className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">{quickStats.attendanceRate}%</div>
              <p className="text-xs text-orange-600">This week avg</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Pending</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">{quickStats.pendingApprovals}</div>
              <p className="text-xs text-red-600">Need attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700">Notices</CardTitle>
              <Bell className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-800">{quickStats.activeNotices}</div>
              <p className="text-xs text-indigo-600">Active notices</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <Button asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/principal/add-teacher">
                  <UserPlus className="h-6 w-6" />
                  <span className="text-sm">Add Teacher</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/principal/add-student">
                  <GraduationCap className="h-6 w-6" />
                  <span className="text-sm">Add Student</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/principal/add-parent">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Add Parent</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/principal/create-class">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm">Create Class</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/principal/timetable">
                  <Clock className="h-6 w-6" />
                  <span className="text-sm">Edit Timetable</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/principal/notices">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Create Notice</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest updates and actions in your school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center space-x-3 border-b pb-3 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'update' ? 'bg-green-100 text-green-600' :
                      activity.type === 'notice' ? 'bg-orange-100 text-orange-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'user' ? <UserPlus className="h-4 w-4" /> :
                       activity.type === 'update' ? <Settings className="h-4 w-4" /> :
                       activity.type === 'notice' ? <Bell className="h-4 w-4" /> :
                       <CheckSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{activity.user}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/principal/activity-log">View All Activities</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Events
              </CardTitle>
              <CardDescription>
                Important dates and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {event.date} • {event.time}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/principal/calendar">View Full Calendar</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Pending Tasks
            </CardTitle>
            <CardDescription>
              Items requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <div>
                      <p className="font-medium">{task.task}</p>
                      <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Action
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PrincipalDashboard;
