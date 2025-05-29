
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, CalendarIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Notice {
  id: string;
  title: string;
  content: string;
  author: {
    first_name: string;
    last_name: string;
  };
  is_important: boolean;
  created_at: string;
  category: string;
}

const StudentNotices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading] = useState(false);

  // Mock data for demonstration
  const notices: Notice[] = [
    {
      id: '1',
      title: 'Mid-Term Examination Schedule Released',
      content: 'The mid-term examination schedule for all classes has been released. Please check your class timetables for specific dates and times. Make sure to prepare well and bring all necessary materials.',
      author: { first_name: 'John', last_name: 'Smith' },
      is_important: true,
      created_at: '2024-01-15T10:00:00Z',
      category: 'Academic'
    },
    {
      id: '2',
      title: 'Annual Sports Day - Registration Open',
      content: 'Registration for the Annual Sports Day is now open. Students interested in participating should register with their respective PE teachers by January 25th.',
      author: { first_name: 'Sarah', last_name: 'Johnson' },
      is_important: false,
      created_at: '2024-01-14T14:30:00Z',
      category: 'Events'
    },
    {
      id: '3',
      title: 'Library Hours Extended',
      content: 'The school library will now remain open until 6 PM on weekdays to accommodate students studying for examinations.',
      author: { first_name: 'Mike', last_name: 'Wilson' },
      is_important: false,
      created_at: '2024-01-13T09:15:00Z',
      category: 'General'
    },
    {
      id: '4',
      title: 'Parent-Teacher Meeting Scheduled',
      content: 'Parent-Teacher meetings are scheduled for January 28th. Parents are requested to confirm their attendance with the class teacher.',
      author: { first_name: 'Emily', last_name: 'Davis' },
      is_important: true,
      created_at: '2024-01-12T11:45:00Z',
      category: 'Meetings'
    }
  ];

  // Filter notices based on search term and selected filters
  const filteredNotices = notices.filter((notice: Notice) => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'important' && notice.is_important);
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      notice.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const getNoticeIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic':
        return '📚';
      case 'events':
        return '🎉';
      case 'meetings':
        return '👥';
      default:
        return '📢';
    }
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <Link to="/student" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">School Notices</h1>
              <p className="text-muted-foreground">
                Stay updated with important announcements and updates from the school
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {filteredNotices.length} Notice{filteredNotices.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search notices by title or content..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="meetings">Meetings</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  <Badge 
                    className={filter === 'all' ? "bg-primary text-primary-foreground cursor-pointer" : "bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"} 
                    onClick={() => handleFilterChange('all')}
                  >
                    All
                  </Badge>
                  <Badge 
                    className={filter === 'important' ? "bg-red-500 text-white cursor-pointer" : "bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"} 
                    onClick={() => handleFilterChange('important')}
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    Important
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notices List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(null).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice: Notice) => (
              <Card key={notice.id} className={`transition-all duration-200 hover:shadow-md ${notice.is_important ? "border-l-4 border-l-red-500 bg-red-50/30" : "hover:bg-muted/30"}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl mt-1">
                        {getNoticeIcon(notice.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg leading-tight">{notice.title}</CardTitle>
                          {notice.is_important && (
                            <Badge variant="destructive" className="text-xs">
                              <Bell className="h-3 w-3 mr-1" /> 
                              Important
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {notice.category}
                          </Badge>
                          <span>•</span>
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {new Date(notice.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm mb-4 text-muted-foreground leading-relaxed">
                    {notice.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-3">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Posted by:</span> 
                      {notice.author?.first_name} {notice.author?.last_name}
                    </span>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-medium mb-2">No notices found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchTerm || filter !== 'all' || categoryFilter !== 'all' 
                    ? "No notices match your current search criteria. Try adjusting your filters."
                    : "There are no notices available at the moment. Check back later for updates."
                  }
                </p>
                {(searchTerm || filter !== 'all' || categoryFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                      setCategoryFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Load More Button */}
        {filteredNotices.length > 5 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="px-8">
              Load More Notices
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col gap-1">
                <Link to="/student/calendar">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-xs">Calendar</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col gap-1">
                <Link to="/student/assignments">
                  <Bell className="h-4 w-4" />
                  <span className="text-xs">Assignments</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col gap-1">
                <Link to="/student/classes">
                  <Search className="h-4 w-4" />
                  <span className="text-xs">Classes</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col gap-1">
                <Link to="/student/resources">
                  <Filter className="h-4 w-4" />
                  <span className="text-xs">Resources</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentNotices;
