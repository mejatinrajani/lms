
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Students: React.FC = () => {
  // Mock data for students
  const [students] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      grade: '10A',
      email: 'alex.j@school.edu',
      parent: 'Michael Johnson',
      parentEmail: 'mjohnson@example.com',
      phone: '(555) 123-4567',
      attendance: 95,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 2,
      name: 'Emma Smith',
      grade: '10A',
      email: 'emma.s@school.edu',
      parent: 'David Smith',
      parentEmail: 'dsmith@example.com',
      phone: '(555) 234-5678',
      attendance: 98,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 3,
      name: 'Ryan Williams',
      grade: '10B',
      email: 'ryan.w@school.edu',
      parent: 'Sarah Williams',
      parentEmail: 'swilliams@example.com',
      phone: '(555) 345-6789',
      attendance: 85,
      status: 'leave',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 4,
      name: 'Sophia Brown',
      grade: '9A',
      email: 'sophia.b@school.edu',
      parent: 'Robert Brown',
      parentEmail: 'rbrown@example.com',
      phone: '(555) 456-7890',
      attendance: 92,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 5,
      name: 'Ethan Davis',
      grade: '9B',
      email: 'ethan.d@school.edu',
      parent: 'Jennifer Davis',
      parentEmail: 'jdavis@example.com',
      phone: '(555) 567-8901',
      attendance: 90,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 6,
      name: 'Olivia Miller',
      grade: '11A',
      email: 'olivia.m@school.edu',
      parent: 'Thomas Miller',
      parentEmail: 'tmiller@example.com',
      phone: '(555) 678-9012',
      attendance: 97,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    }
  ]);

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Students</h1>
              <p className="text-muted-foreground">
                Manage and view information about enrolled students
              </p>
            </div>
            <Button>+ Add New Student</Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search students..." 
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="9a">Class 9A</SelectItem>
                <SelectItem value="9b">Class 9B</SelectItem>
                <SelectItem value="10a">Class 10A</SelectItem>
                <SelectItem value="10b">Class 10B</SelectItem>
                <SelectItem value="11a">Class 11A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 self-end">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">All</Badge>
            <Badge variant="outline" className="hover:bg-muted cursor-pointer">Active</Badge>
            <Badge variant="outline" className="hover:bg-muted cursor-pointer">On Leave</Badge>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="p-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map(student => (
                <Card key={student.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={student.image} 
                      alt={student.name} 
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className={`absolute top-4 right-4 ${
                        student.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                    >
                      {student.status === 'active' ? 'Active' : 'On Leave'}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{student.name}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground">
                      <span className="inline-flex items-center">
                        <GraduationCap className="mr-1 h-4 w-4" /> Class {student.grade}
                      </span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between items-center text-sm">
                          <span>Attendance</span>
                          <span className={`font-medium ${student.attendance > 90 ? 'text-green-600' : student.attendance > 80 ? 'text-amber-600' : 'text-red-600'}`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-1">Parent Contact:</p>
                        <p className="text-sm font-medium">{student.parent}</p>
                        <p className="text-xs text-muted-foreground mt-1">{student.parentEmail}</p>
                      </div>
                      <Button className="w-full mt-2" asChild>
                        <Link to={`/principal/students/${student.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="p-0">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 bg-muted/50 font-medium">
                    <div className="col-span-2">Student</div>
                    <div>Class</div>
                    <div>Attendance</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {students.map(student => (
                    <div 
                      key={student.id} 
                      className="grid grid-cols-6 p-4 items-center border-t"
                    >
                      <div className="col-span-2 flex items-center gap-3">
                        <img 
                          src={student.image} 
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div>{student.grade}</div>
                      <div className={`font-medium ${student.attendance > 90 ? 'text-green-600' : student.attendance > 80 ? 'text-amber-600' : 'text-red-600'}`}>
                        {student.attendance}%
                      </div>
                      <div>
                        <Badge 
                          className={`${
                            student.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                        >
                          {student.status === 'active' ? 'Active' : 'On Leave'}
                        </Badge>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/principal/students/${student.id}`}>View</Link>
                        </Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Students;
