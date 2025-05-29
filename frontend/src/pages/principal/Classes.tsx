
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  GraduationCap,
  Users,
  Clock,
  MapPin,
  Calendar,
  Filter
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClassData {
  id: number;
  name: string;
  grade: string;
  section: string;
  teacher: string;
  teacherId: number;
  students: number;
  room: string;
  schedule: string;
  startTime: string;
  endTime: string;
}

const Classes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for classes
  const [classes] = useState<ClassData[]>([
    {
      id: 1,
      name: 'Mathematics',
      grade: '10',
      section: 'A',
      teacher: 'John Smith',
      teacherId: 1,
      students: 32,
      room: '101',
      schedule: 'Mon, Wed, Fri',
      startTime: '09:00',
      endTime: '09:45'
    },
    {
      id: 2,
      name: 'Physics',
      grade: '10',
      section: 'A',
      teacher: 'Emily Johnson',
      teacherId: 2,
      students: 32,
      room: '102',
      schedule: 'Mon, Wed, Fri',
      startTime: '10:00',
      endTime: '10:45'
    },
    {
      id: 3,
      name: 'Chemistry',
      grade: '10',
      section: 'A',
      teacher: 'Michael Brown',
      teacherId: 3,
      students: 30,
      room: '103',
      schedule: 'Tue, Thu',
      startTime: '09:00',
      endTime: '10:30'
    },
    {
      id: 4,
      name: 'Biology',
      grade: '10',
      section: 'A',
      teacher: 'Sarah Wilson',
      teacherId: 4,
      students: 31,
      room: '104',
      schedule: 'Tue, Thu',
      startTime: '11:00',
      endTime: '12:30'
    },
    {
      id: 5,
      name: 'English Literature',
      grade: '10',
      section: 'A',
      teacher: 'Robert Taylor',
      teacherId: 5,
      students: 32,
      room: '105',
      schedule: 'Mon, Wed, Fri',
      startTime: '11:00',
      endTime: '11:45'
    }
  ]);

  // Filter classes based on search term
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.grade.includes(searchTerm) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Classes Management</h1>
              <p className="text-muted-foreground">
                Manage all classes and sections in your school
              </p>
            </div>
            <Button className="shrink-0">
              Create New Class
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Classes</TabsTrigger>
              <TabsTrigger value="grade10">Grade 10</TabsTrigger>
              <TabsTrigger value="grade9">Grade 9</TabsTrigger>
              <TabsTrigger value="grade8">Grade 8</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search classes..."
                  className="pl-8 w-full sm:w-[260px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="p-0 border-none">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">Class</th>
                        <th className="text-left p-4 font-medium">Teacher</th>
                        <th className="text-left p-4 font-medium">Students</th>
                        <th className="text-left p-4 font-medium">Schedule</th>
                        <th className="text-left p-4 font-medium">Room</th>
                        <th className="text-center p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClasses.map((cls) => (
                        <tr key={cls.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                                <GraduationCap className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">{cls.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Grade {cls.grade}-{cls.section}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Link to={`/principal/teachers/${cls.teacherId}`} className="hover:text-primary">
                              {cls.teacher}
                            </Link>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              {cls.students} students
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                {cls.schedule}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {cls.startTime} - {cls.endTime}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              Room {cls.room}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grade10" className="p-0 border-none">
            <Card>
              <CardHeader>
                <CardTitle>Grade 10 Classes</CardTitle>
                <CardDescription>Showing all classes for Grade 10</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Grade 10 classes content would appear here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grade9" className="p-0 border-none">
            <Card>
              <CardHeader>
                <CardTitle>Grade 9 Classes</CardTitle>
                <CardDescription>Showing all classes for Grade 9</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Grade 9 classes content would appear here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grade8" className="p-0 border-none">
            <Card>
              <CardHeader>
                <CardTitle>Grade 8 Classes</CardTitle>
                <CardDescription>Showing all classes for Grade 8</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Grade 8 classes content would appear here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Classes;
