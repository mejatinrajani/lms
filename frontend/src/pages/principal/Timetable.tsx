import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Timetable: React.FC = () => {
  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  // Time slots
  const timeSlots = [
    "08:00 - 08:45",
    "08:50 - 09:35",
    "09:40 - 10:25",
    "10:40 - 11:25",
    "11:30 - 12:15",
    "12:20 - 13:05",
    "13:45 - 14:30",
    "14:35 - 15:20"
  ];

  // Mock timetable data
  const timetableData = {
    "10A": {
      "Monday": [
        { subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
        { subject: "Physics", teacher: "Ms. Johnson", room: "102" },
        { subject: "English", teacher: "Mrs. Davis", room: "103" },
        { subject: "Break", teacher: "", room: "" },
        { subject: "Chemistry", teacher: "Mr. Brown", room: "104" },
        { subject: "Physical Education", teacher: "Mr. Wilson", room: "Gym" },
        { subject: "Lunch", teacher: "", room: "" },
        { subject: "History", teacher: "Ms. Taylor", room: "105" }
      ],
      "Tuesday": [
        { subject: "Biology", teacher: "Ms. White", room: "106" },
        { subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
        { subject: "Geography", teacher: "Mr. Lewis", room: "107" },
        { subject: "Break", teacher: "", room: "" },
        { subject: "Computer Science", teacher: "Mrs. Clark", room: "108" },
        { subject: "Art", teacher: "Ms. Allen", room: "109" },
        { subject: "Lunch", teacher: "", room: "" },
        { subject: "Music", teacher: "Mr. Young", room: "110" }
      ],
      // Other days would follow the same pattern
    },
    "9B": {
      // Similar structure for other classes
    }
  };

  const renderTimetableCell = (subject: string, teacher: string, room: string) => {
    if (subject === "Break" || subject === "Lunch") {
      return (
        <div className="bg-muted text-center p-2 h-full flex flex-col justify-center">
          <div className="font-medium">{subject}</div>
        </div>
      );
    }
    
    return (
      <div className="border rounded p-2 h-full">
        <div className="font-medium">{subject}</div>
        <div className="text-xs text-muted-foreground">{teacher}</div>
        <div className="text-xs text-muted-foreground">Room: {room}</div>
      </div>
    );
  };

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">School Timetable</h1>
              <p className="text-muted-foreground">
                View and manage class schedules
              </p>
            </div>
            <Button className="shrink-0">
              Edit Timetable
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-64">
            <Select defaultValue="10A">
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10A">Grade 10-A</SelectItem>
                <SelectItem value="10B">Grade 10-B</SelectItem>
                <SelectItem value="9A">Grade 9-A</SelectItem>
                <SelectItem value="9B">Grade 9-B</SelectItem>
                <SelectItem value="8A">Grade 8-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-64">
            <Select defaultValue="current">
              <SelectTrigger>
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Term</SelectItem>
                <SelectItem value="term1">Term 1</SelectItem>
                <SelectItem value="term2">Term 2</SelectItem>
                <SelectItem value="term3">Term 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            Print Timetable
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grade 10-A Weekly Timetable</CardTitle>
            <CardDescription>Term 2, 2025 Academic Year</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly">
              <TabsList className="mb-6">
                <TabsTrigger value="weekly">Weekly View</TabsTrigger>
                <TabsTrigger value="daily">Daily View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="weekly" className="p-0 border-none">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                      <tr>
                        <th className="border bg-muted/50 p-2 w-20">Time</th>
                        {days.map(day => (
                          <th key={day} className="border bg-muted/50 p-2">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((timeSlot, timeIndex) => (
                        <tr key={timeSlot}>
                          <td className="border p-2 text-center bg-muted/20 font-medium text-sm">
                            {timeSlot}
                          </td>
                          {days.map(day => {
                            const cellData = timetableData["10A"]?.[day]?.[timeIndex] || { subject: "", teacher: "", room: "" };
                            return (
                              <td key={`${day}-${timeIndex}`} className="border p-1 h-24">
                                {cellData.subject ? 
                                  renderTimetableCell(cellData.subject, cellData.teacher, cellData.room) : 
                                  <div className="h-full"></div>
                                }
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="daily" className="p-0 border-none">
                <div className="p-6 text-center text-muted-foreground">
                  Select a day to view the detailed daily schedule
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Timetable;
