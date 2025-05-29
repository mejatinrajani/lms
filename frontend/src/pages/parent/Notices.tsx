
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Notices: React.FC = () => {
  // Mock data for notices
  const notices = [
    {
      id: 1,
      title: 'Fee Payment Deadline Extension',
      content: 'The deadline for payment of Term 3 fees has been extended to June 30, 2025. Please ensure timely payment to avoid late charges.',
      date: '2025-05-15',
      author: 'Principal Johnson',
      category: 'Administration',
      important: true
    },
    {
      id: 2,
      title: 'Summer Vacation Schedule',
      content: 'The school will be closed for summer vacation from July 1 to August 15, 2025. Classes will resume on August 16, 2025.',
      date: '2025-05-12',
      author: 'Principal Johnson',
      category: 'General'
    },
    {
      id: 3,
      title: 'Parent-Teacher Meeting',
      content: 'A parent-teacher meeting is scheduled for May 25, 2025 from 4:00 PM to 6:00 PM. All parents are requested to attend.',
      date: '2025-05-10',
      author: 'Ms. Williams',
      category: 'Meeting',
      important: true
    },
    {
      id: 4,
      title: 'Annual Sports Day',
      content: 'The annual sports day will be held on June 10, 2025 at the school grounds. Students should come in their sports uniform.',
      date: '2025-05-08',
      author: 'Mr. Brown',
      category: 'Event'
    },
    {
      id: 5,
      title: 'Change in Timetable',
      content: 'There will be a change in the timetable for Grade 10 from next week. The updated timetable is available on the student portal.',
      date: '2025-05-05',
      author: 'Academic Head',
      category: 'Academic'
    }
  ];

  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <div>
          <Link to="/parent" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">School Notices</h1>
              <p className="text-muted-foreground">
                Important announcements and updates from the school
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">All</Badge>
              <Badge variant="outline" className="hover:bg-muted cursor-pointer">Important</Badge>
              <Badge variant="outline" className="hover:bg-muted cursor-pointer">General</Badge>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search notices..." 
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {notices.map(notice => (
            <Card key={notice.id} className={notice.important ? "border-l-4 border-l-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                    {notice.important && (
                      <Badge variant="secondary">
                        <Bell className="h-3 w-3 mr-1" /> Important
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline">{notice.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{notice.content}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Posted by: {notice.author}</span>
                  <span>Date: {new Date(notice.date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notices;
