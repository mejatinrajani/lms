
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  School, 
  User, 
  BookOpen, 
  Search,
  Plus,
  MoreVertical,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SchoolData {
  id: number;
  name: string;
  location: string;
  principalName: string;
  phone: string;
  email: string;
  studentsCount: number;
  teachersCount: number;
  status: 'active' | 'inactive' | 'maintenance';
  established: string;
}

const Schools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for schools
  const [schools] = useState<SchoolData[]>([
    {
      id: 1,
      name: 'Springfield High School',
      location: 'Springfield, IL',
      principalName: 'Robert Johnson',
      phone: '(555) 123-4567',
      email: 'info@springfieldhigh.edu',
      studentsCount: 650,
      teachersCount: 45,
      status: 'active',
      established: '1985'
    },
    {
      id: 2,
      name: 'Westlake Elementary',
      location: 'Westlake, OH',
      principalName: 'Sarah Williams',
      phone: '(555) 234-5678',
      email: 'office@westlakeelem.edu',
      studentsCount: 320,
      teachersCount: 22,
      status: 'active',
      established: '1992'
    },
    {
      id: 3,
      name: 'Oakridge Middle School',
      location: 'Oakridge, MI',
      principalName: 'Michael Chen',
      phone: '(555) 345-6789',
      email: 'admin@oakridgemiddle.edu',
      studentsCount: 480,
      teachersCount: 35,
      status: 'active',
      established: '1998'
    },
    {
      id: 4,
      name: 'Riverside Academy',
      location: 'Riverside, CA',
      principalName: 'Jennifer Lopez',
      phone: '(555) 456-7890',
      email: 'info@riversideacad.edu',
      studentsCount: 580,
      teachersCount: 40,
      status: 'maintenance',
      established: '2005'
    },
    {
      id: 5,
      name: 'Pinecrest High School',
      location: 'Pinecrest, FL',
      principalName: 'David Miller',
      phone: '(555) 567-8901',
      email: 'office@pinecrest.edu',
      studentsCount: 710,
      teachersCount: 52,
      status: 'active',
      established: '1978'
    }
  ]);

  // Filter schools based on search term
  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.principalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactive</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout requiredRole="developer">
      <div className="space-y-6">
        <div>
          <Link to="/developer" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Schools Management</h1>
              <p className="text-muted-foreground">
                Manage all schools in the Learning Management System
              </p>
            </div>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" /> Add New School
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search schools..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="p-0">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">School Name</th>
                        <th className="text-left p-4 font-medium">Location</th>
                        <th className="text-left p-4 font-medium">Principal</th>
                        <th className="text-left p-4 font-medium">Students</th>
                        <th className="text-left p-4 font-medium">Teachers</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchools.map((school) => (
                        <tr key={school.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="font-medium">{school.name}</div>
                            <div className="text-sm text-muted-foreground">Est. {school.established}</div>
                          </td>
                          <td className="p-4">{school.location}</td>
                          <td className="p-4">{school.principalName}</td>
                          <td className="p-4">{school.studentsCount}</td>
                          <td className="p-4">{school.teachersCount}</td>
                          <td className="p-4">{getStatusBadge(school.status)}</td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit School</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Remove School</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="p-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchools.map((school) => (
                <Card key={school.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{school.name}</span>
                      {getStatusBadge(school.status)}
                    </CardTitle>
                    <CardDescription>{school.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Principal</div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          {school.principalName}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Contact</div>
                        <div className="flex items-center mb-1">
                          <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                          {school.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                          {school.email}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold">{school.studentsCount}</div>
                            <div className="text-xs text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{school.teachersCount}</div>
                            <div className="text-xs text-muted-foreground">Teachers</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/developer/schools/${school.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Schools;
