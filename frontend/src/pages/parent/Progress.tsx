
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Target, 
  BookOpen,
  BarChart3,
  Trophy,
  CheckCircle
} from 'lucide-react';

const ProgressPage: React.FC = () => {
  const children = [
    {
      id: 1,
      name: "John Smith",
      grade: "10A",
      overallProgress: 85,
      subjects: [
        { name: "Mathematics", current: 92, target: 95, trend: "up" },
        { name: "Science", current: 88, target: 90, trend: "up" },
        { name: "English", current: 78, target: 85, trend: "down" },
        { name: "History", current: 85, target: 80, trend: "up" },
        { name: "Geography", current: 80, target: 85, trend: "stable" }
      ]
    },
    {
      id: 2,
      name: "Sarah Smith",
      grade: "8B",
      overallProgress: 78,
      subjects: [
        { name: "Mathematics", current: 75, target: 80, trend: "up" },
        { name: "Science", current: 82, target: 85, trend: "up" },
        { name: "English", current: 88, target: 90, trend: "up" },
        { name: "Social Studies", current: 70, target: 75, trend: "down" }
      ]
    }
  ];

  const achievements = [
    {
      id: 1,
      student: "John Smith",
      title: "Mathematics Excellence",
      description: "Scored highest in quarterly exam",
      date: "2025-05-15",
      type: "academic"
    },
    {
      id: 2,
      student: "Sarah Smith",
      title: "Perfect Attendance",
      description: "100% attendance for the month",
      date: "2025-05-10",
      type: "attendance"
    },
    {
      id: 3,
      student: "John Smith",
      title: "Science Fair Winner",
      description: "First place in school science fair",
      date: "2025-05-05",
      type: "competition"
    }
  ];

  const goals = [
    {
      id: 1,
      student: "John Smith",
      subject: "English",
      current: 78,
      target: 85,
      deadline: "2025-06-30",
      status: "in-progress"
    },
    {
      id: 2,
      student: "Sarah Smith",
      subject: "Mathematics",
      current: 75,
      target: 80,
      deadline: "2025-06-30",
      status: "in-progress"
    },
    {
      id: 3,
      student: "Sarah Smith",
      subject: "Social Studies",
      current: 70,
      target: 75,
      deadline: "2025-06-15",
      status: "at-risk"
    }
  ];

  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <div>
          <Link to="/parent" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Academic Progress</h1>
          <p className="text-muted-foreground">
            Track your children's academic progress and achievements
          </p>
        </div>

        {/* Overall Progress Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          {children.map(child => (
            <Card key={child.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{child.name}</span>
                  <Badge variant="outline">Grade {child.grade}</Badge>
                </CardTitle>
                <CardDescription>Overall Academic Performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span className="font-medium">{child.overallProgress}%</span>
                    </div>
                    <Progress value={child.overallProgress} className="h-3" />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/parent/child/${child.id}/academics`}>
                      View Detailed Report
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subject-wise Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Subject-wise Progress
            </CardTitle>
            <CardDescription>
              Detailed breakdown of performance in each subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children.map(child => (
              <div key={child.id} className="mb-8 last:mb-0">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                  {child.name} - Grade {child.grade}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {child.subjects.map((subject, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{subject.name}</h4>
                        <div className="flex items-center">
                          <TrendingUp className={`h-4 w-4 mr-1 ${
                            subject.trend === 'up' ? 'text-green-600' :
                            subject.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`} />
                          <span className="text-sm font-medium">{subject.current}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current</span>
                          <span>{subject.current}%</span>
                        </div>
                        <Progress value={subject.current} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Target: {subject.target}%</span>
                          <span className={
                            subject.current >= subject.target ? 'text-green-600' : 'text-orange-600'
                          }>
                            {subject.current >= subject.target ? 'Target Met' : 
                             `${subject.target - subject.current}% to go`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Recent Achievements
              </CardTitle>
              <CardDescription>
                Latest accomplishments and recognitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      achievement.type === 'academic' ? 'bg-blue-100 text-blue-600' :
                      achievement.type === 'attendance' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {achievement.type === 'academic' ? <BookOpen className="h-4 w-4" /> :
                       achievement.type === 'attendance' ? <CheckCircle className="h-4 w-4" /> :
                       <Trophy className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {achievement.description}
                      </p>
                      <p className="text-xs font-medium text-primary">
                        {achievement.student}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Learning Goals
              </CardTitle>
              <CardDescription>
                Current academic targets and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map(goal => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{goal.subject}</h4>
                        <p className="text-sm text-muted-foreground">{goal.student}</p>
                      </div>
                      <Badge variant={
                        goal.status === 'completed' ? 'default' :
                        goal.status === 'at-risk' ? 'destructive' : 'secondary'
                      }>
                        {goal.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress: {goal.current}% → {goal.target}%</span>
                        <span>{Math.round((goal.current / goal.target) * 100)}% complete</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                        <span>{goal.target - goal.current} points needed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Progress Analytics
            </CardTitle>
            <CardDescription>
              Visual representation of academic performance trends
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>Interactive progress charts would appear here</p>
              <p className="text-sm">Showing trends, comparisons, and insights</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
