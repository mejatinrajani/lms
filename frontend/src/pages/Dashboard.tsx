import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Bell, 
  ClipboardList,
  GraduationCap,
  UserCheck,
  DollarSign,
  MessageSquare
} from "lucide-react";
import { dashboardAPI, noticesAPI, attendanceAPI } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  total_students: number;
  total_teachers: number;
  total_classes: number;
  total_subjects: number;
  attendance_percentage: number;
  pending_assignments: number;
  unread_notices: number;
  fee_payments_pending: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  created_at: string;
  is_read: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load dashboard stats
      const statsData = await dashboardAPI.getDashboardStats();
      setStats(statsData);

      // Load recent activities
      const activitiesData = await dashboardAPI.getRecentActivities();
      setRecentActivities(activitiesData.results || []);

      // Load notices
      const noticesData = await noticesAPI.getNotices();
      setNotices(noticesData.results || []);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markNoticeAsRead = async (noticeId: string) => {
    try {
      await noticesAPI.markNoticeAsRead(noticeId);
      setNotices(prev => 
        prev.map(notice => 
          notice.id === noticeId ? { ...notice, is_read: true } : notice
        )
      );
    } catch (error) {
      console.error('Error marking notice as read:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'default';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDashboardCards = () => {
    if (!stats) return [];

    const baseCards = [
      {
        title: "Total Students",
        value: stats.total_students,
        icon: <GraduationCap className="h-4 w-4" />,
        description: "Active students",
        trend: "+12%"
      },
      {
        title: "Total Teachers",
        value: stats.total_teachers,
        icon: <Users className="h-4 w-4" />,
        description: "Faculty members",
        trend: "+5%"
      },
      {
        title: "Attendance Rate",
        value: `${stats.attendance_percentage}%`,
        icon: <UserCheck className="h-4 w-4" />,
        description: "This month",
        trend: "+8%"
      },
      {
        title: "Pending Assignments",
        value: stats.pending_assignments,
        icon: <ClipboardList className="h-4 w-4" />,
        description: "Due this week",
        trend: "-15%"
      }
    ];

    // Role-specific cards
    if (user?.role === 'PRINCIPAL' || user?.role === 'DEVELOPER') {
      baseCards.push(
        {
          title: "Total Classes",
          value: stats.total_classes,
          icon: <BookOpen className="h-4 w-4" />,
          description: "Active classes",
          trend: "+2%"
        },
        {
          title: "Fee Collections",
          value: `₹${(100000 - stats.fee_payments_pending * 1000).toLocaleString()}`,
          icon: <DollarSign className="h-4 w-4" />,
          description: "This month",
          trend: "+18%"
        }
      );
    }

    return baseCards;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.first_name || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to your {user?.role ? user.role.toLowerCase() : "user"} dashboard
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {getDashboardCards().map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{card.description}</span>
                  <Badge variant="secondary" className="text-xs">
                    {card.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notices">Notices</TabsTrigger>
              <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {user?.role === 'TEACHER' && (
                      <>
                        <Button variant="outline" className="w-full justify-start">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Mark Attendance
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Create Assignment
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Upload Resources
                        </Button>
                      </>
                    )}
                    {user?.role === 'STUDENT' && (
                      <>
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Assignments
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          Check Schedule
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Progress
                        </Button>
                      </>
                    )}
                    {user?.role === 'PARENT' && (
                      <>
                        <Button variant="outline" className="w-full justify-start">
                          <UserCheck className="mr-2 h-4 w-4" />
                          View Attendance
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Academic Progress
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Fee Management
                        </Button>
                      </>
                    )}
                    {(user?.role === 'PRINCIPAL' || user?.role === 'DEVELOPER') && (
                      <>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="mr-2 h-4 w-4" />
                          Manage Users
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Manage Classes
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Reports
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Attendance Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                    <CardDescription>Current month attendance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Attendance</span>
                        <span>{stats?.attendance_percentage}%</span>
                      </div>
                      <Progress value={stats?.attendance_percentage || 0} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>This Week</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Today</span>
                        <span>98%</span>
                      </div>
                      <Progress value={98} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notices" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notices & Announcements
                  </CardTitle>
                  <CardDescription>
                    Latest updates and announcements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notices.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No notices available
                      </p>
                    ) : (
                      notices.slice(0, 5).map((notice) => (
                        <div
                          key={notice.id}
                          className={`p-4 rounded-lg border ${
                            notice.is_read 
                              ? 'bg-gray-50 dark:bg-gray-800' 
                              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium">{notice.title}</h4>
                                <Badge variant={getPriorityColor(notice.priority)}>
                                  {notice.priority}
                                </Badge>
                                {!notice.is_read && (
                                  <Badge variant="secondary">New</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notice.content}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(notice.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {!notice.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markNoticeAsRead(notice.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Latest activities in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No recent activities
                      </p>
                    ) : (
                      recentActivities.slice(0, 10).map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                by {activity.user}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
