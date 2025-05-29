
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const Assignments: React.FC = () => {
  // Mock assignment data
  const pendingAssignments = [
    {
      id: 1,
      title: 'Mathematics - Quadratic Equations',
      subject: 'Mathematics',
      dueDate: '2025-05-25',
      givenDate: '2025-05-15',
      teacher: 'Mr. Smith',
      progress: 25,
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'English - Shakespeare Essay',
      subject: 'English Literature',
      dueDate: '2025-05-28',
      givenDate: '2025-05-10',
      teacher: 'Ms. Williams',
      progress: 60,
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Physics - Wave Properties Lab Report',
      subject: 'Physics',
      dueDate: '2025-06-01',
      givenDate: '2025-05-20',
      teacher: 'Mrs. Johnson',
      progress: 10,
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'History - World War II Research',
      subject: 'History',
      dueDate: '2025-05-23',
      givenDate: '2025-05-08',
      teacher: 'Mr. Davis',
      progress: 80,
      status: 'pending',
      priority: 'high'
    }
  ];

  const completedAssignments = [
    {
      id: 101,
      title: 'Biology - Cell Structure Diagram',
      subject: 'Biology',
      dueDate: '2025-05-10',
      givenDate: '2025-05-01',
      teacher: 'Mrs. Thompson',
      score: '85/100',
      status: 'completed',
      feedback: 'Good work on the diagrams. Add more detail to the explanations.'
    },
    {
      id: 102,
      title: 'Chemistry - Periodic Table Quiz',
      subject: 'Chemistry',
      dueDate: '2025-05-08',
      givenDate: '2025-05-02',
      teacher: 'Mr. Wilson',
      score: '92/100',
      status: 'completed',
      feedback: 'Excellent understanding of element properties.'
    },
    {
      id: 103,
      title: 'Computer Science - Python Functions',
      subject: 'Computer Science',
      dueDate: '2025-05-12',
      givenDate: '2025-05-05',
      teacher: 'Ms. Brown',
      score: '78/100',
      status: 'completed',
      feedback: 'Good attempt, but work on code efficiency and documentation.'
    }
  ];

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityBadge = (priority: string, daysRemaining: number) => {
    if (daysRemaining < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Medium Priority</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Low Priority</Badge>;
    }
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <Link to="/student" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Assignments</h1>
          <p className="text-muted-foreground">
            View and manage your pending and completed assignments
          </p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedAssignments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingAssignments.map(assignment => {
              const daysRemaining = getDaysRemaining(assignment.dueDate);
              
              return (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.subject}</CardDescription>
                      </div>
                      {getPriorityBadge(assignment.priority, daysRemaining)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <span className="text-muted-foreground">Due Date: </span>
                          <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                          {daysRemaining <= 3 && daysRemaining > 0 && (
                            <Badge variant="outline" className="ml-2 text-xs bg-yellow-50 text-yellow-800">
                              {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                            </Badge>
                          )}
                          {daysRemaining <= 0 && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Overdue by {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="text-muted-foreground">Assigned: </span>
                          {new Date(assignment.givenDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="text-muted-foreground">Teacher: </span>
                          {assignment.teacher}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Assignment Progress</span>
                        <span className="font-medium">{assignment.progress}%</span>
                      </div>
                      <Progress value={assignment.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Submit Assignment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedAssignments.map(assignment => (
              <Card key={assignment.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>{assignment.subject}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-800">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <span className="text-muted-foreground">Submitted: </span>
                        <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">Teacher: </span>
                        {assignment.teacher}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="text-muted-foreground">Score: </span>
                        <Badge variant="secondary">{assignment.score}</Badge>
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/40 p-3 rounded-md mb-4">
                    <h4 className="text-sm font-medium mb-1">Teacher's Feedback:</h4>
                    <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      View Submission
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Assignments;
