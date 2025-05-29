
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Star, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ViewSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      rollNo: '001',
      assignmentTitle: 'Algebra Problems Set 1',
      submittedAt: '2025-05-18 14:30',
      status: 'submitted',
      grade: '',
      feedback: '',
      fileUrl: 'assignment1.pdf'
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      rollNo: '002',
      assignmentTitle: 'Algebra Problems Set 1',
      submittedAt: '2025-05-17 16:45',
      status: 'graded',
      grade: '85',
      feedback: 'Good work! Need to improve on problem solving approach.',
      fileUrl: 'assignment2.pdf'
    },
    {
      id: 3,
      studentName: 'Charlie Brown',
      rollNo: '003',
      assignmentTitle: 'Algebra Problems Set 1',
      submittedAt: '',
      status: 'pending',
      grade: '',
      feedback: '',
      fileUrl: ''
    }
  ]);

  const [gradingSubmission, setGradingSubmission] = useState(null);

  const handleGrade = (submissionId: number, grade: string, feedback: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId
        ? { ...sub, grade, feedback, status: 'graded' }
        : sub
    ));
    setGradingSubmission(null);
    alert('Grade submitted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500';
      case 'graded': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher/assignments" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Assignments
          </Link>
          <h1 className="text-3xl font-bold mb-2">Assignment Submissions</h1>
          <p className="text-muted-foreground">
            Review and grade student assignment submissions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Algebra Problems Set 1 - Submissions</CardTitle>
            <CardDescription>
              Due: May 20, 2025 | Total Students: 30 | Submitted: 20
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map(submission => (
                <div key={submission.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{submission.studentName}</h3>
                      <p className="text-sm text-muted-foreground">Roll No: {submission.rollNo}</p>
                      {submission.submittedAt && (
                        <p className="text-sm text-muted-foreground">
                          Submitted: {submission.submittedAt}
                        </p>
                      )}
                    </div>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>

                  {submission.fileUrl && (
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{submission.fileUrl}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}

                  {submission.status === 'graded' && (
                    <div className="bg-muted/50 p-3 rounded-md mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Grade: {submission.grade}/100</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 mt-1" />
                        <p className="text-sm">{submission.feedback}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {submission.status === 'submitted' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            onClick={() => setGradingSubmission(submission)}
                          >
                            Grade Assignment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Grade Assignment</DialogTitle>
                            <DialogDescription>
                              Grade {submission.studentName}'s submission
                            </DialogDescription>
                          </DialogHeader>
                          <GradingForm 
                            submission={submission} 
                            onSubmit={handleGrade}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                    {submission.status === 'graded' && (
                      <Button variant="outline">
                        Edit Grade
                      </Button>
                    )}
                    {submission.status === 'pending' && (
                      <span className="text-sm text-muted-foreground">
                        Not submitted yet
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const GradingForm: React.FC<{ submission: any; onSubmit: (id: number, grade: string, feedback: string) => void }> = ({ 
  submission, 
  onSubmit 
}) => {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!grade) {
      alert('Please enter a grade');
      return;
    }
    onSubmit(submission.id, grade, feedback);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="grade">Grade (out of 100)</Label>
        <Input
          id="grade"
          type="number"
          max="100"
          min="0"
          placeholder="85"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea
          id="feedback"
          placeholder="Provide feedback to the student..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Submit Grade
      </Button>
    </div>
  );
};

export default ViewSubmissions;
