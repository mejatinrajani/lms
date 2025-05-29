
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthContext';
import { 
  Search, 
  PlusCircle, 
  Bell, 
  Calendar, 
  Edit,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react';
import { fetchNotices, deleteNotice, Notice, createNotice, UserRole } from '@/services/noticeService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// CreateNoticeDialog component
const CreateNoticeDialog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [targetAudience, setTargetAudience] = useState<UserRole[]>(['student']);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createNoticeMutation = useMutation({
    mutationFn: async () => {
      return await createNotice({
        title,
        content,
        is_important: isImportant,
        target_audience: targetAudience
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setTitle('');
      setContent('');
      setIsImportant(false);
      setTargetAudience(['student']);
      setIsOpen(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNoticeMutation.mutate();
  };
  
  const handleTargetAudienceChange = (value: string) => {
    setTargetAudience([value as UserRole]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Notice</DialogTitle>
          <DialogDescription>
            Create a new notice to be shared with your classes
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input 
              id="title" 
              placeholder="Notice title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">Content</label>
            <Textarea 
              id="content" 
              placeholder="Notice content" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="targetAudience" className="text-sm font-medium">Target Audience</label>
            <Select 
              value={targetAudience[0]} 
              onValueChange={handleTargetAudienceChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                  <SelectItem value="parent">Parents</SelectItem>
                  <SelectItem value="principal">Principal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="important" 
              checked={isImportant}
              onCheckedChange={(checked) => setIsImportant(checked === true)}
            />
            <label htmlFor="important" className="text-sm font-medium">Mark as important</label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createNoticeMutation.isPending}
            >
              {createNoticeMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : 'Create Notice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Notices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'important' | 'published'>('all');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch notices from the backend
  const { data: notices = [], isLoading, error } = useQuery({
    queryKey: ['notices'],
    queryFn: fetchNotices
  });

  // Delete notice mutation
  const deleteNoticeMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    }
  });

  // Filter notices based on search term and filter
  const filteredNotices = notices.filter((notice: Notice) => {
    // Search term filter
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'important' && notice.is_important) ||
      (filter === 'published' && true); // All notices are published in this implementation
    
    return matchesSearch && matchesFilter;
  });

  // Handle notice deletion
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      deleteNoticeMutation.mutate(id);
    }
  };

  if (error) {
    toast.error('Failed to load notices');
  }

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Notices</h1>
              <p className="text-muted-foreground">
                Create and manage notices for your classes
              </p>
            </div>
            <CreateNoticeDialog />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notices..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'important' ? 'default' : 'outline'} 
              size="sm" 
              className="flex items-center"
              onClick={() => setFilter('important')}
            >
              <Bell className="h-4 w-4 mr-2 text-amber-500" />
              Important
            </Button>
            <Button 
              variant={filter === 'published' ? 'default' : 'outline'} 
              size="sm" 
              className="flex items-center"
              onClick={() => setFilter('published')}
            >
              Published
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice: Notice) => (
              <Card key={notice.id} className={notice.is_important ? "border-amber-200" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {notice.is_important && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Important</Badge>
                        )}
                        {notice.target_audience && notice.target_audience.map((target, i) => (
                          <Badge key={i} variant="outline">{target}</Badge>
                        ))}
                      </div>
                      <CardTitle className="text-lg">{notice.title}</CardTitle>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(notice.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <CardDescription>
                    By {notice.author?.first_name} {notice.author?.last_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{notice.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      0 views
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(notice.id)}
                      disabled={deleteNoticeMutation.isPending}
                    >
                      {deleteNoticeMutation.isPending && notice.id === deleteNoticeMutation.variables ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notices found</p>
                <CreateNoticeDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notices;
