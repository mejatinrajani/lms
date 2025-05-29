
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Teachers: React.FC = () => {
  // Mock data for teachers
  const [teachers] = useState([
    {
      id: 1,
      name: 'John Smith',
      subject: 'Mathematics',
      email: 'j.smith@school.edu',
      phone: '(555) 123-4567',
      classes: 4,
      students: 120,
      experience: '10 years',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 2,
      name: 'Sarah Davis',
      subject: 'English Literature',
      email: 's.davis@school.edu',
      phone: '(555) 234-5678',
      classes: 5,
      students: 145,
      experience: '8 years',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      subject: 'Physics',
      email: 'm.johnson@school.edu',
      phone: '(555) 345-6789',
      classes: 3,
      students: 85,
      experience: '12 years',
      status: 'on leave',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 4,
      name: 'Emily Wilson',
      subject: 'History',
      email: 'e.wilson@school.edu',
      phone: '(555) 456-7890',
      classes: 4,
      students: 110,
      experience: '5 years',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 5,
      name: 'Robert Brown',
      subject: 'Biology',
      email: 'r.brown@school.edu',
      phone: '(555) 567-8901',
      classes: 4,
      students: 105,
      experience: '15 years',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      id: 6,
      name: 'Jennifer Lee',
      subject: 'Chemistry',
      email: 'j.lee@school.edu',
      phone: '(555) 678-9012',
      classes: 3,
      students: 90,
      experience: '7 years',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
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
              <h1 className="text-3xl font-bold mb-2">Teachers</h1>
              <p className="text-muted-foreground">
                Manage and view information about teaching staff
              </p>
            </div>
            <Button>+ Add New Teacher</Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search teachers..." 
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
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
              {teachers.map(teacher => (
                <Card key={teacher.id} className="overflow-hidden">
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={teacher.image} 
                      alt={teacher.name} 
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className={`absolute top-4 right-4 ${
                        teacher.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                    >
                      {teacher.status === 'active' ? 'Active' : 'On Leave'}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{teacher.name}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground">{teacher.subject}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Experience: {teacher.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.classes} classes, {teacher.students} students</span>
                      </div>
                      <Button className="w-full mt-2" asChild>
                        <Link to={`/principal/teachers/${teacher.id}`}>View Profile</Link>
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
                    <div className="col-span-2">Name</div>
                    <div>Subject</div>
                    <div>Classes</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {teachers.map(teacher => (
                    <div 
                      key={teacher.id} 
                      className="grid grid-cols-6 p-4 items-center border-t"
                    >
                      <div className="col-span-2 flex items-center gap-3">
                        <img 
                          src={teacher.image} 
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                      <div>{teacher.subject}</div>
                      <div>{teacher.classes} classes</div>
                      <div>
                        <Badge 
                          className={`${
                            teacher.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                        >
                          {teacher.status === 'active' ? 'Active' : 'On Leave'}
                        </Badge>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/principal/teachers/${teacher.id}`}>View</Link>
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

export default Teachers;
