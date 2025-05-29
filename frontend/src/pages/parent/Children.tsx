
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Clock,
  CheckCircle2,
  XCircle,
  BadgeCheck
} from 'lucide-react';

interface ChildData {
  id: number;
  name: string;
  grade: string;
  age: number;
  profileImage: string;
  attendance: number;
  nextExam: string;
  upcomingAssignments: number;
  recentMarks: {
    subject: string;
    mark: string;
    date: string;
  }[];
  todaysAttendance: 'present' | 'absent' | 'late';
}

const Children: React.FC = () => {
  // Mock data for children
  const children: ChildData[] = [
    {
      id: 1,
      name: 'John Smith',
      grade: '10A',
      age: 16,
      profileImage: '',
      attendance: 92,
      nextExam: '2025-05-25',
      upcomingAssignments: 3,
      recentMarks: [
        { subject: 'Mathematics', mark: 'A', date: '2025-05-10' },
        { subject: 'Science', mark: 'B+', date: '2025-05-08' },
        { subject: 'English', mark: 'A-', date: '2025-05-12' }
      ],
      todaysAttendance: 'present'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      grade: '8B',
      age: 14,
      profileImage: '',
      attendance: 88,
      nextExam: '2025-05-27',
      upcomingAssignments: 4,
      recentMarks: [
        { subject: 'Mathematics', mark: 'B', date: '2025-05-11' },
        { subject: 'Science', mark: 'A', date: '2025-05-09' },
        { subject: 'History', mark: 'B+', date: '2025-05-13' }
      ],
      todaysAttendance: 'present'
    }
  ];

  const getAttendanceIcon = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late':
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getAttendanceText = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return 'Present today';
      case 'absent':
        return 'Absent today';
      case 'late':
        return 'Late today';
    }
  };

  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <div>
          <Link to="/parent" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">My Children</h1>
          <p className="text-muted-foreground">
            Monitor your children's academic progress
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {children.map(child => (
            <Card key={child.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={child.profileImage} />
                      <AvatarFallback className="text-lg">{child.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{child.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">Grade {child.grade}</Badge>
                        <span className="text-sm text-muted-foreground">{child.age} years old</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getAttendanceIcon(child.todaysAttendance)}
                    <span className="text-sm ml-1">{getAttendanceText(child.todaysAttendance)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <div className="flex items-center text-primary mb-1">
                      <BadgeCheck className="h-5 w-5 mr-1" />
                      <span className="font-medium">Attendance</span>
                    </div>
                    <div className="text-2xl font-bold">{child.attendance}%</div>
                  </div>
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <div className="flex items-center text-primary mb-1">
                      <Calendar className="h-5 w-5 mr-1" />
                      <span className="font-medium">Next Exam</span>
                    </div>
                    <div className="text-lg font-medium">
                      {new Date(child.nextExam).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center mb-2">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Recent Performance
                    </h3>
                    <div className="space-y-2">
                      {child.recentMarks.map((mark, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
                          <span>{mark.subject}</span>
                          <div className="flex items-center">
                            <Badge className="mr-2">{mark.mark}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(mark.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <Button asChild>
                      <Link to={`/parent/child/${child.id}`}>View Full Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Children;
