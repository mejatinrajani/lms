import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, Clock, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usersAPI } from '@/services/apiService';
import { Loader2 } from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  subject?: string;
  email: string;
  phone?: string;
  classes?: number;
  students?: number;
  experience?: string;
  status: string;
  image?: string;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'leave'>('all');
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getTeachers();

        if (!response.data) {
          throw new Error('No data received from server');
        }

        const teachersData = response.data.results || [];
        const transformedTeachers = teachersData.map((teacher: any) => ({
          id: teacher.id || Math.random(),
          name: teacher.user?.name || teacher.name || 'Unknown',
          subject: teacher.subject?.name || teacher.subject || 'Not assigned',
          email: teacher.user?.email || teacher.email || '',
          phone: teacher.phone || 'No phone',
          classes: teacher.classes_count || 0,
          students: teacher.students_count || 0,
          experience: teacher.experience || 'Not specified',
          status: teacher.is_active ? 'active' : 'inactive',
          image: teacher.image || teacher.user?.image || '/default-teacher.png',
        }));

        setTeachers(transformedTeachers);
      } catch (err: any) {
        console.error('Error fetching teachers:', err);
        const errorMessage = err.response?.data?.detail || err.message || 'Failed to load teachers';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      if (filter === 'all') {
        setFilteredTeachers(teachers);
      } else if (filter === 'active') {
        setFilteredTeachers(teachers.filter(teacher => teacher.status === 'active'));
      } else if (filter === 'leave') {
        setFilteredTeachers(teachers.filter(teacher => teacher.status === 'inactive'));
      }
    };

    applyFilter();
  }, [filter, teachers]);

  const handleAddTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTeacher = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      phone: formData.get('phone'),
      status: 'active',
    };

    try {
      // const response = await usersAPI.addTeacher(newTeacher);
      // setTeachers(prev => [...prev, response.data]);
      setIsAddTeacherModalOpen(false);
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="principal">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout requiredRole="principal">
        <div className="text-center text-red-500 p-6">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-semibold text-foreground">Teachers</h1>
            <p className="text-sm text-muted-foreground">
              Manage and view information about teaching staff
            </p>
          </div>
          <Button 
            onClick={() => setIsAddTeacherModalOpen(true)} 
            className="bg-primary hover:bg-primary/90 transition-colors"
          >
            + Add New Teacher
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search teachers..." 
              className="pl-10 bg-background border-muted rounded-lg focus:ring-2 focus:ring-primary transition-all" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`cursor-pointer px-3 py-1 transition-colors ${
                filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </Badge>
            <Badge
              className={`cursor-pointer px-3 py-1 transition-colors ${
                filter === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => setFilter('active')}
            >
              Active
            </Badge>
            <Badge
              className={`cursor-pointer px-3 py-1 transition-colors ${
                filter === 'leave' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => setFilter('leave')}
            >
              On Leave
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-muted rounded-lg">
              <TabsTrigger value="grid" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Grid View</TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="p-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map(teacher => (
                <Card key={teacher.id} className="overflow-hidden bg-background border-muted hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={teacher.image} 
                      alt={teacher.name} 
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className={`absolute top-4 right-4 text-sm font-medium ${
                        teacher.status === 'active' ? 'bg-green-500/90' : 'bg-amber-500/90'
                      }`}
                    >
                      {teacher.status === 'active' ? 'Active' : 'On Leave'}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">{teacher.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Experience: {teacher.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.classes} classes, {teacher.students} students</span>
                      </div>
                      <Button 
                        className="w-full mt-2 bg-primary hover:bg-primary/90 transition-colors" 
                        asChild
                      >
                        <Link to={`/principal/teachers/${teacher.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="p-0">
            <Card className="bg-background border-muted">
              <CardContent className="p-0">
                <div className="rounded-md border border-muted">
                  <div className="grid grid-cols-6 p-4 bg-muted/50 font-medium text-sm">
                    <div className="col-span-2">Name</div>
                    <div>Subject</div>
                    <div>Classes</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {filteredTeachers.map(teacher => (
                    <div 
                      key={teacher.id} 
                      className="grid grid-cols-6 p-4 items-center border-t border-muted hover:bg-muted/50 transition-colors"
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
                            teacher.status === 'active' ? 'bg-green-500/90' : 'bg-amber-500/90'
                          }`}
                        >
                          {teacher.status === 'active' ? 'Active' : 'On Leave'}
                        </Badge>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild className="hover:bg-primary/10 transition-colors">
                          <Link to={`/principal/teachers/${teacher.id}`}>View</Link>
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-primary/10 transition-colors">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isAddTeacherModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 transition-opacity">
            <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Teacher</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddTeacherModalOpen(false)}
                  className="hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <Input name="name" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <Input name="email" type="email" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                  <Input name="subject" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                  <Input name="phone" required className="bg-background border-muted rounded-lg" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddTeacherModalOpen(false)}
                    className="hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">Add Teacher</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Teachers;