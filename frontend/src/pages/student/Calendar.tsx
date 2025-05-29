
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, BookOpen, Bell, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Event {
  id: number;
  title: string;
  date: string;
  time?: string;
  type: 'class' | 'exam' | 'event' | 'assignment' | 'holiday';
  description?: string;
  location?: string;
}

const Calendar: React.FC = () => {
  // Mock current date (for demo purposes)
  const [currentDate] = useState(new Date('2025-05-17'));
  
  // Mock calendar events
  const events: Event[] = [
    { id: 1, title: 'Mathematics Test', date: '2025-05-20', time: '10:00 AM', type: 'exam', location: 'Room 101' },
    { id: 2, title: 'Science Project Due', date: '2025-05-25', type: 'assignment' },
    { id: 3, title: 'Sports Day', date: '2025-05-28', time: '09:00 AM - 04:00 PM', type: 'event', location: 'School Grounds' },
    { id: 4, title: 'Parent-Teacher Meeting', date: '2025-06-02', time: '04:00 PM - 06:00 PM', type: 'event' },
    { id: 5, title: 'English Essay Submission', date: '2025-06-05', type: 'assignment' },
    { id: 6, title: 'Summer Vacation Begins', date: '2025-06-15', type: 'holiday' },
    { id: 7, title: 'Mathematics Class', date: '2025-05-19', time: '09:00 AM - 09:45 AM', type: 'class', location: 'Room 101' },
    { id: 8, title: 'Science Lab', date: '2025-05-19', time: '10:00 AM - 11:30 AM', type: 'class', location: 'Lab 2' },
    { id: 9, title: 'English Literature', date: '2025-05-19', time: '01:00 PM - 01:45 PM', type: 'class', location: 'Room 105' },
    { id: 10, title: 'History Class', date: '2025-05-20', time: '11:00 AM - 11:45 AM', type: 'class', location: 'Room 302' },
    { id: 11, title: 'Computer Science', date: '2025-05-21', time: '02:00 PM - 03:30 PM', type: 'class', location: 'Lab 3' },
    { id: 12, title: 'Physics Test', date: '2025-05-22', time: '10:00 AM', type: 'exam', location: 'Room 203' },
  ];
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week the month starts on (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const currentDay = currentDate.getDate();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  // Create calendar grid
  const calendarGrid = [];
  let day = 1;
  
  // Previous month days to show
  const prevMonthDays = [];
  if (firstDayOfMonth > 0) {
    const prevMonthDaysCount = getDaysInMonth(year, month - 1);
    for (let i = prevMonthDaysCount - firstDayOfMonth + 1; i <= prevMonthDaysCount; i++) {
      prevMonthDays.push(i);
    }
  }
  
  const getEventsForDay = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'class':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'assignment':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'holiday':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch(type) {
      case 'class':
        return <BookOpen className="h-3 w-3 mr-1" />;
      case 'exam':
        return <FileText className="h-3 w-3 mr-1" />;
      case 'event':
        return <CalendarIcon className="h-3 w-3 mr-1" />;
      case 'assignment':
        return <FileText className="h-3 w-3 mr-1" />;
      case 'holiday':
        return <Bell className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  // Get upcoming events (next 7 days)
  const today = new Date('2025-05-17');
  const nextWeek = new Date('2025-05-17');
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today && eventDate <= nextWeek;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <Link to="/student" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Academic Calendar</h1>
          <p className="text-muted-foreground">
            View your classes, exams, assignments, and school events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{monthName} {year}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
                    <div key={index} className="text-center p-2 text-sm font-medium">
                      {dayName}
                    </div>
                  ))}

                  {/* Previous month days */}
                  {prevMonthDays.map((day) => (
                    <div key={`prev-${day}`} className="p-1">
                      <div className="h-24 p-1 text-muted-foreground bg-muted/30 rounded-md opacity-50">
                        <div className="text-right text-xs">{day}</div>
                      </div>
                    </div>
                  ))}

                  {/* Current month days */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const dayNumber = index + 1;
                    const isCurrentDay = dayNumber === currentDay;
                    const dayEvents = getEventsForDay(dayNumber, month, year);
                    
                    return (
                      <div key={dayNumber} className="p-1">
                        <div className={`h-24 p-1 rounded-md overflow-hidden ${isCurrentDay ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/30'}`}>
                          <div className={`text-right text-xs ${isCurrentDay ? 'font-bold' : ''}`}>{dayNumber}</div>
                          <div className="mt-1 space-y-1 overflow-y-auto" style={{ maxHeight: '80%' }}>
                            {dayEvents.slice(0, 3).map((event) => (
                              <div 
                                key={event.id} 
                                className={`px-1 py-0.5 text-xs rounded truncate flex items-center ${getEventTypeColor(event.type)}`}
                                title={event.title}
                              >
                                {getEventTypeIcon(event.type)}
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-center text-muted-foreground">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Fill remaining grid spaces */}
                  {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, index) => (
                    <div key={`next-${index}`} className="p-1">
                      <div className="h-24 p-1 text-muted-foreground bg-muted/30 rounded-md opacity-50">
                        <div className="text-right text-xs">{index + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const eventDate = new Date(event.date);
                    const isToday = eventDate.toDateString() === today.toDateString();
                    const formattedDate = eventDate.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric'
                    });
                    
                    return (
                      <div 
                        key={event.id} 
                        className={`p-3 rounded-md border ${isToday ? 'border-primary bg-primary/5' : 'border-border'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium">{event.title}</div>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {formattedDate} {event.time && `• ${event.time}`}
                        </div>
                        {event.location && (
                          <div className="text-xs text-muted-foreground">
                            Location: {event.location}
                          </div>
                        )}
                        {event.description && (
                          <div className="text-xs mt-1">
                            {event.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {upcomingEvents.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No upcoming events in the next 7 days
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Legend</CardTitle>
            <CardDescription>Types of events on your calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="h-4 w-4 rounded-full bg-blue-500"></span>
                <span>Classes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-4 w-4 rounded-full bg-red-500"></span>
                <span>Exams</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-4 w-4 rounded-full bg-purple-500"></span>
                <span>Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-4 w-4 rounded-full bg-amber-500"></span>
                <span>Assignments</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-4 w-4 rounded-full bg-green-500"></span>
                <span>Holidays</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Academic Schedule</CardTitle>
            <CardDescription>Important dates for the academic year</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>May 20-25, 2025</TableCell>
                  <TableCell>Mid-Term Exams</TableCell>
                  <TableCell><Badge className="bg-red-100 text-red-800">Exam</Badge></TableCell>
                  <TableCell>All subjects</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>May 28, 2025</TableCell>
                  <TableCell>Sports Day</TableCell>
                  <TableCell><Badge className="bg-purple-100 text-purple-800">Event</Badge></TableCell>
                  <TableCell>School grounds</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>June 2, 2025</TableCell>
                  <TableCell>Parent-Teacher Meeting</TableCell>
                  <TableCell><Badge className="bg-purple-100 text-purple-800">Event</Badge></TableCell>
                  <TableCell>4:00 PM - 6:00 PM</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>June 15-30, 2025</TableCell>
                  <TableCell>Final Exams</TableCell>
                  <TableCell><Badge className="bg-red-100 text-red-800">Exam</Badge></TableCell>
                  <TableCell>All subjects</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>July 1, 2025</TableCell>
                  <TableCell>Summer Vacation Begins</TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-800">Holiday</Badge></TableCell>
                  <TableCell>School closed until August 15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
