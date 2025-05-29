
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  School, 
  User, 
  BarChart4, 
  BookOpen, 
  Lightbulb,
  Shield,
  Settings,
  AlertTriangle,
  Server,
  Users,
  Activity
} from 'lucide-react';

const DeveloperDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Schools',
      value: 5,
      icon: <School className="h-4 w-4" />,
      description: 'Active schools in the system',
      link: '/developer/schools'
    },
    {
      title: 'Total Principals',
      value: 5,
      icon: <User className="h-4 w-4" />,
      description: 'School principals',
      link: '/developer/principals'
    },
    {
      title: 'Total Teachers',
      value: 48,
      icon: <BookOpen className="h-4 w-4" />,
      description: 'Across all schools',
      link: '/developer/teachers'
    },
    {
      title: 'Total Students',
      value: 1250,
      icon: <Users className="h-4 w-4" />,
      description: 'Enrolled students',
      link: '/developer/students'
    }
  ];

  // System health metrics
  const systemHealth = [
    { name: 'CPU Usage', value: 42, status: 'normal' },
    { name: 'Memory Usage', value: 68, status: 'warning' },
    { name: 'Disk Space', value: 24, status: 'normal' },
    { name: 'Database Load', value: 56, status: 'normal' }
  ];

  // Recent activities
  const recentActivities = [
    { action: 'New school added', user: 'System Admin', time: '10 minutes ago' },
    { action: 'Principal account created', user: 'System Admin', time: '1 hour ago' },
    { action: 'System backup completed', user: 'Automated Task', time: '3 hours ago' },
    { action: 'Security settings updated', user: 'System Admin', time: '5 hours ago' },
    { action: 'Database optimized', user: 'Automated Task', time: '1 day ago' }
  ];

  // Get status color
  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-amber-500';
      case 'critical': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <DashboardLayout requiredRole="developer">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Developer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the LMS system administration dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Link key={i} to={stat.link} className="block">
              <Card className="hover:border-primary transition-colors">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{stat.title}</CardTitle>
                  <div className="bg-primary/10 p-2 rounded-full">{stat.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart4 className="h-5 w-5 mr-2" /> System Usage
              </CardTitle>
              <CardDescription>
                Active users over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                [Activity chart visualization would appear here]
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" /> Quick Actions
              </CardTitle>
              <CardDescription>
                Common system administration tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link to="/developer/schools" className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                <h3 className="font-medium flex items-center">
                  <School className="h-4 w-4 mr-2" />
                  Add New School
                </h3>
                <p className="text-sm text-muted-foreground">
                  Register a new school in the system
                </p>
              </Link>
              
              <Link to="/developer/principals" className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                <h3 className="font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Create Principal Account
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add a new principal and assign to a school
                </p>
              </Link>
              
              <Link to="/developer/settings" className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                <h3 className="font-medium flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure global system settings
                </p>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" /> System Health
              </CardTitle>
              <CardDescription>
                Current status of system resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((metric, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <span className={`text-sm font-medium ${getHealthStatusColor(metric.status)}`}>
                        {metric.value}%
                      </span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View System Alerts
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" /> Recent Activity
              </CardTitle>
              <CardDescription>
                Recent system events and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex justify-between items-start border-b last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">By {activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">View All Activity</Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" /> System Security
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3">
              <p className="mb-4">Your system security certificate will expire in 45 days. We recommend renewing it before expiration to avoid service interruptions.</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Lock className="h-4 w-4 mr-2" />
                  Renew Certificate
                </Button>
                <Button variant="secondary" size="sm">Security Settings</Button>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 rounded-full bg-amber-100 p-4">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperDashboard;

function Lock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
