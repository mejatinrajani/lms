
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  School
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface PrincipalData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  schoolId: number;
  profileImage: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

const Principals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for principals
  const [principals] = useState<PrincipalData[]>([
    {
      id: 1,
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@springfieldhigh.edu',
      phone: '(555) 123-4567',
      school: 'Springfield High School',
      schoolId: 1,
      profileImage: '',
      status: 'active',
      joinDate: '2018-05-12'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@westlakeelem.edu',
      phone: '(555) 234-5678',
      school: 'Westlake Elementary',
      schoolId: 2,
      profileImage: '',
      status: 'active',
      joinDate: '2019-08-15'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@oakridgemiddle.edu',
      phone: '(555) 345-6789',
      school: 'Oakridge Middle School',
      schoolId: 3,
      profileImage: '',
      status: 'active',
      joinDate: '2020-01-20'
    },
    {
      id: 4,
      firstName: 'Jennifer',
      lastName: 'Lopez',
      email: 'jennifer.lopez@riversideacad.edu',
      phone: '(555) 456-7890',
      school: 'Riverside Academy',
      schoolId: 4,
      profileImage: '',
      status: 'pending',
      joinDate: '2023-11-05'
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.miller@pinecrest.edu',
      phone: '(555) 567-8901',
      school: 'Pinecrest High School',
      schoolId: 5,
      profileImage: '',
      status: 'active',
      joinDate: '2015-07-10'
    }
  ]);

  // Filter principals based on search term
  const filteredPrincipals = principals.filter(principal => 
    `${principal.firstName} ${principal.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    principal.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    principal.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Format join date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
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
              <h1 className="text-3xl font-bold mb-1">Principals Management</h1>
              <p className="text-muted-foreground">
                Manage all school principals in the system
              </p>
            </div>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" /> Add New Principal
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search principals..."
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

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Principal</th>
                    <th className="text-left p-4 font-medium">School</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Joined</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrincipals.map((principal) => (
                    <tr key={principal.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarImage src={principal.profileImage} />
                            <AvatarFallback>{principal.firstName[0]}{principal.lastName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{principal.firstName} {principal.lastName}</div>
                            <div className="text-sm text-muted-foreground">ID: {principal.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <School className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Link to={`/developer/schools/${principal.schoolId}`} className="hover:text-primary">
                            {principal.school}
                          </Link>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                            {principal.email}
                          </div>
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                            {principal.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(principal.status)}</td>
                      <td className="p-4">{formatDate(principal.joinDate)}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Deactivate Account</DropdownMenuItem>
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
      </div>
    </DashboardLayout>
  );
};

export default Principals;
