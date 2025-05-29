
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Calendar: React.FC = () => {
  // Current date
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Mock calendar events
  const events = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2025-05-25', time: '16:00 - 18:00', type: 'meeting' },
    { id: 2, title: 'School Annual Day', date: '2025-06-15', time: '10:00 - 14:00', type: 'event' },
    { id: 3, title: 'Term 3 Exam Begins', date: '2025-05-28', time: 'All Day', type: 'exam' },
    { id: 4, title: 'Science Fair', date: '2025-06-05', time: '13:00 - 16:00', type: 'event' },
    { id: 5, title: 'Holiday - Memorial Day', date: '2025-05-26', time: 'All Day', type: 'holiday' }
  ];

  // Mock calendar days
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3; // Adjust to start with the correct day of week
    return {
      date: day > 0 && day <= 31 ? day : null,
      events: day > 0 && day <= 31 
        ? events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getDate() === day && 
                 eventDate.getMonth() === currentDate.getMonth() &&
                 eventDate.getFullYear() === currentDate.getFullYear();
        }) 
        : []
    };
  });

  // Utility function to get badge color by event type
  const getBadgeClassByType = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'holiday': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <div>
          <Link to="/parent" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Academic Calendar</h1>
          <p className="text-muted-foreground">
            View upcoming events, exams, and holidays
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" /> 
                  {currentMonth} {currentYear}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">Today</Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Days of week */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, i) => (
                  <div 
                    key={i} 
                    className={`border rounded-md min-h-[100px] p-1 ${
                      day.date === currentDate.getDate() 
                      ? 'bg-primary/5 border-primary' 
                      : day.date ? 'hover:bg-muted/50 cursor-pointer' : 'bg-muted/20'
                    }`}
                  >
                    {day.date && (
                      <div className="h-full">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium">{day.date}</span>
                          {day.events.length > 0 && (
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                        <div className="space-y-1 mt-1">
                          {day.events.slice(0, 2).map(event => (
                            <div 
                              key={event.id} 
                              className="text-xs p-1 rounded truncate bg-primary/10 text-primary"
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {day.events.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{day.events.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 30 days events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => (
                    <div key={event.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <Badge className={getBadgeClassByType(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        <h3 className="font-medium">{event.title}</h3>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span className="mr-3">{new Date(event.date).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
