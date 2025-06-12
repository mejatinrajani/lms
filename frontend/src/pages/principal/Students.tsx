import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, GraduationCap, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usersAPI } from '@/services/apiService';
import { Loader2 } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  grade?: string;
  email: string;
  phone?: string;
  attendance?: number;
  status: string;
  image?: string;
  parent?: {
    name: string;
    email: string;
  };
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'leave'>('all');
  const [classFilter, setClassFilter] = useState('all');
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getStudents();
        console.log('Students data:', response.data);

        // Ensure response.data is an array or use a fallback
        const studentsData = Array.isArray(response.data) ? response.data : response.data.results || [];
        
        const transformedStudents = studentsData.map((student: any) => ({
          id: student.id || Math.random(),
          name: student.name || 'Unknown',
          grade: student.grade || 'Not assigned',
          email: student.email || '',
          phone: student.phone || 'No phone',
          attendance: student.attendance_percentage || 0,
          status: student.status || 'active',
          image: student.image || '/default-student.png',
          parent: student.parent && {
            name: student.parent.name || 'Unknown',
            email: student.parent.email || ''
          }
        }));

        setStudents(transformedStudents);
      } catch (err: any) {
        console.error('Error fetching students:', err);
        setError(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      let filtered = students;
      if (filter === 'active') {
        filtered = filtered.filter(student => student.status === 'active');
      } else if (filter === 'leave') {
        filtered = filtered.filter(student => student.status === 'inactive');
      }
      if (classFilter !== 'all') {
        filtered = filtered.filter(student => student.grade === classFilter);
      }
      setFilteredStudents(filtered);
    };

    applyFilter();
  }, [filter, classFilter, students]);

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newStudent = {
      name: formData.get('name'),
      email: formData.get('email'),
      grade: formData.get('grade'),
      phone: formData.get('phone'),
      parentName: formData.get('parentName'),
      parentEmail: formData.get('parentEmail'),
      status: 'active',
    };

    try {
      // const response = await usersAPI.addStudent(newStudent);
      // setStudents(prev => [...prev, response.data]);
      setIsAddStudentModalOpen(false);
    } catch (error) {
      console.error('Error adding student:', error);
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
            <h1 className="text-2xl font-semibold text-foreground">Students</h1>
            <p className="text-sm text-muted-foreground">
              Manage and view information about enrolled students
            </p>
          </div>
          <Button 
            onClick={() => setIsAddStudentModalOpen(true)} 
            className="bg-primary hover:bg-primary/90 transition-colors"
          >
            + Add New Student
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search students..." 
                className="pl-10 bg-background border-muted rounded-lg focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <Select onValueChange={setClassFilter} defaultValue="all">
              <SelectTrigger className="w-[180px] bg-background border-muted rounded-lg">
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
              {filteredStudents.map(student => (
                <Card key={student.id} className="overflow-hidden bg-background border-muted hover:shadow-md transition-shadow">
                  <div className="aspect-square relative">
                    <img 
                      src={student.image} 
                      alt={student.name} 
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className={`absolute top-4 right-4 text-sm font-medium ${
                        student.status === 'active' ? 'bg-green-500/90' : 'bg-amber-500/90'
                      }`}
                    >
                      {student.status === 'active' ? 'Active' : 'On Leave'}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center">
                        <GraduationCap className="mr-1 h-4 w-4" /> Class {student.grade}
                      </span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between items-center">
                          <span>Attendance</span>
                          <span className={`font-medium ${student.attendance > 90 ? 'text-green-600' : student.attendance > 80 ? 'text-amber-600' : 'text-red-600'}`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-1">Parent Contact:</p>
                        <p className="text-sm font-medium">{student.parent?.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{student.parent?.email}</p>
                      </div>
                      <Button 
                        className="w-full mt-2 bg-primary hover:bg-primary/90 transition-colors" 
                        asChild
                      >
                        <Link to={`/principal/students/${student.id}`}>View Profile</Link>
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
                    <div className="col-span-2">Student</div>
                    <div>Class</div>
                    <div>Attendance</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {filteredStudents.map(student => (
                    <div 
                      key={student.id} 
                      className="grid grid-cols-6 p-4 items-center border-t border-muted hover:bg-muted/50 transition-colors"
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
                            student.status === 'active' ? 'bg-green-500/90' : 'bg-amber-500/90'
                          }`}
                        >
                          {student.status === 'active' ? 'Active' : 'On Leave'}
                        </Badge>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild className="hover:bg-primary/10 transition-colors">
                          <Link to={`/principal/students/${student.id}`}>View</Link>
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

        {isAddStudentModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 transition-opacity">
            <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Student</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <Input name="name" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <Input name="email" type="email" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Grade</label>
                  <Select name="grade" required>
                    <SelectTrigger className="bg-background border-muted rounded-lg">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9a">Class 9A</SelectItem>
                      <SelectItem value="9b">Class 9B</SelectItem>
                      <SelectItem value="10a">Class 10A</SelectItem>
                      <SelectItem value="10b">Class 10B</SelectItem>
                      <SelectItem value="11a">Class 11A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                  <Input name="phone" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Parent Name</label>
                  <Input name="parentName" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Parent Email</label>
                  <Input name="parentEmail" type="email" required className="bg-background border-muted rounded-lg" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddStudentModalOpen(false)}
                    className="hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">Add Student</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Students;