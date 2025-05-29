
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
  PlusCircle,
  User,
  Mail,
  Phone,
  MoreVertical
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ParentData {
  id: number;
  name: string;
  email: string;
  phone: string;
  children: {
    name: string;
    grade: string;
    section: string;
  }[];
  lastLogin: string;
  profileImage: string;
}

const Parents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for parents
  const [parents] = useState<ParentData[]>([
    {
      id: 1,
      name: 'Michael Smith',
      email: 'michael.smith@example.com',
      phone: '(555) 123-4567',
      children: [
        { name: 'John Smith', grade: '10', section: 'A' }
      ],
      lastLogin: '2025-05-15',
      profileImage: ''
    },
    {
      id: 2,
      name: 'Jennifer Wilson',
      email: 'jennifer.wilson@example.com',
      phone: '(555) 234-5678',
      children: [
        { name: 'Sarah Wilson', grade: '8', section: 'B' }
      ],
      lastLogin: '2025-05-16',
      profileImage: ''
    },
    {
      id: 3,
      name: 'Robert Brown',
      email: 'robert.brown@example.com',
      phone: '(555) 345-6789',
      children: [
        { name: 'Michael Brown', grade: '9', section: 'A' },
        { name: 'Emily Brown', grade: '6', section: 'C' }
      ],
      lastLogin: '2025-05-10',
      profileImage: ''
    },
    {
      id: 4,
      name: 'Lisa Johnson',
      email: 'lisa.johnson@example.com',
      phone: '(555) 456-7890',
      children: [
        { name: 'David Johnson', grade: '11', section: 'A' }
      ],
      lastLogin: '2025-05-17',
      profileImage: ''
    },
    {
      id: 5,
      name: 'James Davis',
      email: 'james.davis@example.com',
      phone: '(555) 567-8901',
      children: [
        { name: 'Sophia Davis', grade: '10', section: 'B' },
        { name: 'Matthew Davis', grade: '7', section: 'A' }
      ],
      lastLogin: '2025-05-12',
      profileImage: ''
    }
  ]);

  // Filter parents based on search term
  const filteredParents = parents.filter(parent => 
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.children.some(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.grade.includes(searchTerm) ||
      child.section.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
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
              <h1 className="text-3xl font-bold mb-1">Parent Management</h1>
              <p className="text-muted-foreground">
                View and manage parent accounts
              </p>
            </div>
            <Button className="shrink-0">
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Parent
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search parents or children..."
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
                    <th className="text-left p-4 font-medium">Parent</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-left p-4 font-medium">Children</th>
                    <th className="text-left p-4 font-medium">Last Login</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParents.map((parent) => (
                    <tr key={parent.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarImage src={parent.profileImage} />
                            <AvatarFallback>{parent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{parent.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {parent.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                            {parent.email}
                          </div>
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                            {parent.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          {parent.children.map((child, index) => (
                            <div key={index} className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{child.name}</span>
                              <Badge variant="outline" className="ml-2">
                                Grade {child.grade}{child.section}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">{formatDate(parent.lastLogin)}</td>
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
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Children</DropdownMenuItem>
                            <DropdownMenuItem>Access Logs</DropdownMenuItem>
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

export default Parents;
