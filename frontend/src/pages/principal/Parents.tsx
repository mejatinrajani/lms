import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, PlusCircle, User, Mail, Phone, MoreVertical, X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { usersAPI } from '@/services/apiService';
import { Loader2 } from 'lucide-react';

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
  const [parents, setParents] = useState<ParentData[]>([]);
  const [filteredParents, setFilteredParents] = useState<ParentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getParents();
        console.log('Parents data:', response.data);

        // Ensure response.data is an array or use a fallback
        const parentsData = Array.isArray(response.data) ? response.data : response.data.results || [];

        const transformedParents = parentsData.map((parent: any) => ({
          id: parent.id || Math.random(),
          name: parent.name || 'Unknown',
          email: parent.email || '',
          phone: parent.phone || 'No phone',
          children: (parent.children || []).map((child: any) => ({
            name: child.name || 'Unknown',
            grade: child.grade || '',
            section: child.section || ''
          })),
          lastLogin: parent.last_login || new Date().toISOString(),
          profileImage: parent.image || '/default-parent.png'
        }));

        setParents(transformedParents);
      } catch (err: any) {
        console.error('Error fetching parents:', err);
        setError(err.message || 'Failed to load parents');
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  useEffect(() => {
    const filtered = parents.filter(parent => 
      parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.children.some(child => 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.grade.includes(searchTerm) ||
        child.section.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredParents(filtered);
  }, [searchTerm, parents]);

  const handleAddParent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newParent = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      childName: formData.get('childName'),
      childGrade: formData.get('childGrade'),
      childSection: formData.get('childSection'),
    };

    try {
      // const response = await usersAPI.addParent(newParent);
      // setParents(prev => [...prev, response.data]);
      setIsAddParentModalOpen(false);
    } catch (error) {
      console.error('Error adding parent:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
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
            <h1 className="text-2xl font-semibold text-foreground">Parent Management</h1>
            <p className="text-sm text-muted-foreground">
              View and manage parent accounts
            </p>
          </div>
          <Button 
            onClick={() => setIsAddParentModalOpen(true)}
            className="bg-primary hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Parent
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search parents or children..."
                className="pl-8 w-full bg-background border-muted rounded-lg focus:ring-2 focus:ring-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
              Filter
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
              Export
            </Button>
          </div>
        </div>

        <Card className="bg-background border-muted">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium text-sm">Parent</th>
                    <th className="text-left p-4 font-medium text-sm">Contact</th>
                    <th className="text-left p-4 font-medium text-sm">Children</th>
                    <th className="text-left p-4 font-medium text-sm">Last Login</th>
                    <th className="text-right p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParents.map((parent) => (
                    <tr key={parent.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarImage src={parent.profileImage} />
                            <AvatarFallback>{parent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{parent.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {parent.id}</div>
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
                              <Badge variant="outline" className="ml-2 border-muted">
                                Grade {child.grade}{child.section}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{formatDate(parent.lastLogin)}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
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

        {isAddParentModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 transition-opacity">
            <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Parent</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddParentModalOpen(false)}
                  className="hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddParent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <Input name="name" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <Input name="email" type="email" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                  <Input name="phone" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Child Name</label>
                  <Input name="childName" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Child Grade</label>
                  <Input name="childGrade" required className="bg-background border-muted rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Child Section</label>
                  <Input name="childSection" required className="bg-background border-muted rounded-lg" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddParentModalOpen(false)}
                    className="hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">Add Parent</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Parents;