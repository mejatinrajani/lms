
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, LineChart, PieChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, Cell } from 'recharts';
import { ArrowLeft, Book, GraduationCap, Award, TrendingUp, BarChart4 } from 'lucide-react';

const ChildAcademicPerformance: React.FC = () => {
  const { childId } = useParams();
  
  // Mock data
  const childInfo = {
    id: childId,
    name: "Alex Johnson",
    grade: "10th Grade",
    school: "Springfield High School",
    academicYear: "2024-2025"
  };

  // Academic performance data
  const subjectsData = [
    { subject: 'Mathematics', grade: 'A', percentage: 92, color: '#8B5CF6' },
    { subject: 'Science', grade: 'A-', percentage: 89, color: '#10B981' },
    { subject: 'English', grade: 'B+', percentage: 87, color: '#3B82F6' },
    { subject: 'History', grade: 'B', percentage: 84, color: '#F59E0B' },
    { subject: 'Art', grade: 'A', percentage: 95, color: '#EC4899' },
    { subject: 'Physical Education', grade: 'A-', percentage: 90, color: '#6366F1' }
  ];

  // Attendance data
  const attendanceData = [
    { month: 'Sept', present: 21, absent: 1, late: 0 },
    { month: 'Oct', present: 20, absent: 2, late: 1 },
    { month: 'Nov', present: 19, absent: 0, late: 3 },
    { month: 'Dec', present: 15, absent: 0, late: 0 },
    { month: 'Jan', present: 22, absent: 0, late: 0 },
    { month: 'Feb', present: 18, absent: 2, late: 2 },
    { month: 'Mar', present: 21, absent: 1, late: 0 },
    { month: 'Apr', present: 22, absent: 0, late: 0 }
  ];

  // Progress data over time
  const progressData = [
    { month: 'Sept', math: 75, science: 68, english: 80, history: 65 },
    { month: 'Oct', math: 78, science: 72, english: 82, history: 70 },
    { month: 'Nov', math: 82, science: 75, english: 85, history: 75 },
    { month: 'Dec', math: 85, science: 80, english: 83, history: 78 },
    { month: 'Jan', math: 88, science: 83, english: 86, history: 82 },
    { month: 'Feb', math: 90, science: 85, english: 88, history: 85 },
    { month: 'Mar', math: 92, science: 89, english: 87, history: 84 },
    { month: 'Apr', math: 92, science: 89, english: 87, history: 84 }
  ];

  // Standardized test scores
  const testScores = [
    { test: 'Mid-Term Exam', score: 88, average: 75 },
    { test: 'Science Project', score: 92, average: 80 },
    { test: 'Math Contest', score: 95, average: 78 },
    { test: 'English Essay', score: 85, average: 82 }
  ];

  // PIECHART COLORS
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Attendance pie chart data
  const attendanceSummary = [
    { name: 'Present', value: 158 },
    { name: 'Absent', value: 6 },
    { name: 'Late', value: 6 }
  ];

  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link to={`/parent/child/${childId}`} className="flex items-center text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Child Details
            </Link>
            <h1 className="text-3xl font-bold">{childInfo.name}'s Academic Performance</h1>
            <p className="text-muted-foreground">{childInfo.grade} • {childInfo.school} • {childInfo.academicYear}</p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>
          
          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="p-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">GPA</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.8/4.0</div>
                  <p className="text-xs text-muted-foreground mt-1">Top 15% of class</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">Attendance</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">96%</div>
                  <p className="text-xs text-muted-foreground mt-1">Present days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">Test Average</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">90%</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all subjects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+7%</div>
                  <p className="text-xs text-muted-foreground mt-1">Since last semester</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectsData.map((subject) => (
                      <div key={subject.subject} className="space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                          <span>{subject.subject}</span>
                          <span>{subject.grade} ({subject.percentage}%)</span>
                        </div>
                        <Progress value={subject.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={attendanceSummary}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {attendanceSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* GRADES TAB */}
          <TabsContent value="grades" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2" /> Subject Grades
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subjectsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" name="Grade (%)" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* ATTENDANCE TAB */}
          <TabsContent value="attendance" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="#10B981" />
                    <Bar dataKey="absent" name="Absent" fill="#EF4444" />
                    <Bar dataKey="late" name="Late" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* PROGRESS TAB */}
          <TabsContent value="progress" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="math" name="Math" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="science" name="Science" stroke="#10B981" />
                    <Line type="monotone" dataKey="english" name="English" stroke="#3B82F6" />
                    <Line type="monotone" dataKey="history" name="History" stroke="#F59E0B" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* TESTS TAB */}
          <TabsContent value="tests" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle>Standardized Test Scores</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={testScores}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="test" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" name="Student Score" fill="#8B5CF6" />
                    <Bar dataKey="average" name="Class Average" fill="#9CA3AF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ChildAcademicPerformance;
