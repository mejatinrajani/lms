
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  BookOpen,
  FileText,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Event {
  id: number;
  title: string;
  start: string; // ISO date string with time
  end: string; // ISO date string with time
  type: 'class' | 'meeting' | 'assignment' | 'exam' | 'personal';
  location?: string;
  description?: string;
  className?: string;
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Mathematics 10A",
      start: "2025-05-22T09:00:00",
      end: "2025-05-22T09:45:00",
      type: "class",
      location: "Room 101",
      description: "Quadratic Equations",
      className: "Mathematics 10A"
    },
    {
      id: 2,
      title: "Mathematics 9B",
      start: "2025-05-22T10:00:00",
      end: "2025-05-22T10:45:00",
      type: "class",
      location: "Room 102",
      description: "Linear Equations",
      className: "Mathematics 9B"
    },
    {
      id: 3,
      title: "Department Meeting",
      start: "2025-05-22T14:00:00",
      end: "2025-05-22T15:00:00",
      type: "meeting",
      location: "Staff Room"
    },
    {
      id: 4,
      title: "Algebra Quiz Due",
      start: "2025-05-25T23:59:00",
      end: "2025-05-25T23:59:00",
      type: "assignment",
      className: "Mathematics 10A"
    },
    {
      id: 5,
      title: "Mid-Term Exam",
      start: "2025-05-27T09:00:00",
      end: "2025-05-27T11:00:00",
      type: "exam",
      location: "Exam Hall",
      className: "Mathematics 11C"
    }
  ]);
  
  // Generate calendar days for the current month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push({
        date: null,
        isCurrentMonth: false
      });
    }
    
    // Add cells for days in the current month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    return daysArray;
  };
  
  // Format date
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }) => {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.start.startsWith(dateString));
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  // Get the background color for event types
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'assignment': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'exam': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'personal': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };
  
  // Get today's date string
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  // Create a new event
  const createNewEvent = (formData: FormData) => {
    const newEvent: Event = {
      id: events.length + 1,
      title: formData.get('title') as string,
      type: formData.get('type') as Event['type'],
      start: `${formData.get('date')}T${formData.get('startTime')}:00`,
      end: `${formData.get('date')}T${formData.get('endTime')}:00`,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      className: formData.get('className') as string,
    };
    
    setEvents([...events, newEvent]);
  };

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Calendar</h1>
              <p className="text-muted-foreground">
                Manage your schedule and upcoming events
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Add a new event to your calendar
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  createNewEvent(new FormData(e.target as HTMLFormElement));
                }}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input id="title" name="title" placeholder="Event title" required />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="type" className="text-sm font-medium">Event Type</label>
                      <Select name="type" defaultValue="class">
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class">Class</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="className" className="text-sm font-medium">Class (optional)</label>
                      <Select name="className">
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics 10A">Mathematics 10A</SelectItem>
                          <SelectItem value="Mathematics 9B">Mathematics 9B</SelectItem>
                          <SelectItem value="Mathematics 11C">Mathematics 11C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="date" className="text-sm font-medium">Date</label>
                      <Input type="date" id="date" name="date" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
                        <Input type="time" id="startTime" name="startTime" required />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
                        <Input type="time" id="endTime" name="endTime" required />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="location" className="text-sm font-medium">Location (optional)</label>
                      <Input id="location" name="location" placeholder="Event location" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
                      <Textarea id="description" name="description" placeholder="Event description" rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Event</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="month" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="mx-4 font-medium">
                {formatDate(currentMonth)}
              </span>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="month" className="p-0 border-none">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-7 bg-muted/50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={index} className="p-2 text-center font-medium text-sm border-b">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {generateCalendarDays().map((day, index) => {
                    const isToday = day.date?.toISOString().split('T')[0] === todayString;
                    const isSelected = day.date && selectedDate && 
                      day.date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
                    
                    const dayEvents = day.date ? getEventsForDate(day.date) : [];
                    
                    return (
                      <div 
                        key={index} 
                        className={`min-h-[110px] p-1 border relative ${day.isCurrentMonth ? '' : 'bg-muted/30'} ${isSelected ? 'bg-primary/5' : ''}`}
                        onClick={() => day.date && setSelectedDate(day.date)}
                      >
                        <div className={`text-right p-1 ${isToday ? 'bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center ml-auto' : ''}`}>
                          {day.date?.getDate()}
                        </div>
                        <div className="space-y-1 mt-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div 
                              key={event.id} 
                              className={`text-xs truncate rounded px-1 py-0.5 ${getEventTypeColor(event.type)}`}
                              title={event.title}
                            >
                              {formatTime(event.start)} {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-muted-foreground pl-1">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="week" className="p-0 border-none">
            <Card>
              <CardHeader>
                <CardTitle>Week View</CardTitle>
                <CardDescription>
                  View your schedule for the current week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">Week view will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="day" className="p-0 border-none">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Day View</CardTitle>
                  <CardDescription>
                    {selectedDate ? formatDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">Today</Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <Input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value))} />
                    </div>
                    
                    <div className="space-y-2">
                      {getEventsForDate(selectedDate).length > 0 ? (
                        getEventsForDate(selectedDate).map(event => (
                          <div 
                            key={event.id} 
                            className={`rounded-md overflow-hidden border ${event.type === 'class' ? 'border-blue-200' : event.type === 'meeting' ? 'border-purple-200' : event.type === 'assignment' ? 'border-amber-200' : event.type === 'exam' ? 'border-red-200' : 'border-green-200'}`}
                          >
                            <div className={`p-3 ${getEventTypeColor(event.type)}`}>
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                                </div>
                                {event.location && (
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                                {event.className && (
                                  <div className="flex items-center">
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    <span>{event.className}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {event.description && (
                              <div className="p-3">
                                <p>{event.description}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-8 bg-muted/20 rounded-md">
                          <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <h3 className="text-lg font-medium mb-1">No Events</h3>
                          <p className="text-muted-foreground mb-4">
                            There are no events scheduled for this day
                          </p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button>
                                <Plus className="h-4 w-4 mr-2" /> Add Event
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              {/* Event creation form similar to the one above */}
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">Please select a date to view events</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agenda" className="p-0 border-none">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Agenda View</CardTitle>
                    <CardDescription>
                      Your upcoming events and schedule
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Today's events */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Today</h3>
                    <div className="space-y-2">
                      {events
                        .filter(event => event.start.startsWith(todayString))
                        .map(event => (
                          <div 
                            key={event.id} 
                            className="flex bg-card rounded-md border overflow-hidden" 
                          >
                            <div className={`w-2 ${event.type === 'class' ? 'bg-blue-500' : event.type === 'meeting' ? 'bg-purple-500' : event.type === 'assignment' ? 'bg-amber-500' : event.type === 'exam' ? 'bg-red-500' : 'bg-green-500'}`}>
                            </div>
                            <div className="p-3 flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{event.title}</h4>
                                <Badge variant="outline">
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                                </div>
                                {event.location && (
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                                {event.className && (
                                  <div className="flex items-center">
                                    <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span>{event.className}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      {events.filter(event => event.start.startsWith(todayString)).length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No events scheduled for today</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Upcoming events */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Upcoming</h3>
                    <div className="space-y-2">
                      {events
                        .filter(event => {
                          const eventDate = new Date(event.start);
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          tomorrow.setHours(0, 0, 0, 0);
                          return eventDate >= tomorrow;
                        })
                        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                        .slice(0, 5)
                        .map(event => (
                          <div 
                            key={event.id} 
                            className="flex bg-card rounded-md border overflow-hidden" 
                          >
                            <div className={`w-2 ${event.type === 'class' ? 'bg-blue-500' : event.type === 'meeting' ? 'bg-purple-500' : event.type === 'assignment' ? 'bg-amber-500' : event.type === 'exam' ? 'bg-red-500' : 'bg-green-500'}`}>
                            </div>
                            <div className="p-3 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{event.title}</h4>
                                  <div className="text-sm text-muted-foreground">
                                    {formatDate(new Date(event.start), { weekday: 'long', month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                                <Badge variant="outline">
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                                </div>
                                {event.location && (
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
