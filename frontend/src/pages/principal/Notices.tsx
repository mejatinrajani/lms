
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Edit, Trash2, Eye, Loader2, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchNotices, createNotice, deleteNotice, Notice, UserRole } from '@/services/noticeService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// CreateNoticeDialog component for principals
const CreateNoticeDialog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [targetAudience, setTargetAudience] = useState<UserRole[]>(['student']);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

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
          Create New Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Notice</DialogTitle>
          <DialogDescription>
            Create a new notice to be shared with the school community
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
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="parent">Parents</SelectItem>
                <SelectItem value="principal">Principals</SelectItem>
                <SelectItem value="developer">Developers</SelectItem>
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
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Fetch all notices
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: fetchNotices
  });

  // Delete notice mutation
  const deleteNoticeMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast.success('Notice deleted successfully');
    }
  });

  // Handle notice deletion
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      deleteNoticeMutation.mutate(id);
    }
  };

  // Filter notices based on search term, audience, and status
  const filteredNotices = notices.filter((notice: Notice) => {
    // Search term filter
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Audience filter
    const matchesAudience =
      audienceFilter === 'all' ||
      notice.target_audience.includes(audienceFilter as UserRole);
    
    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'important' && notice.is_important) ||
      (statusFilter === 'published'); // All notices are published
    
    return matchesSearch && matchesAudience && matchesStatus;
  });

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">School Notices</h1>
              <p className="text-muted-foreground">
                Create, publish, and manage announcements for the school community
              </p>
            </div>
            <CreateNoticeDialog />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search notices..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audiences</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="parent">Parents</SelectItem>
                <SelectItem value="principal">Principals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 self-end">
            <Badge 
              className={statusFilter === 'all' ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer" : "hover:bg-muted cursor-pointer"} 
              variant={statusFilter === 'all' ? "default" : "outline"}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Badge>
            <Badge 
              className={statusFilter === 'important' ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer" : "hover:bg-muted cursor-pointer"} 
              variant={statusFilter === 'important' ? "default" : "outline"}
              onClick={() => setStatusFilter('important')}
            >
              Important
            </Badge>
            <Badge 
              className={statusFilter === 'published' ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer" : "hover:bg-muted cursor-pointer"} 
              variant={statusFilter === 'published' ? "default" : "outline"}
              onClick={() => setStatusFilter('published')}
            >
              Published
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Notices</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-0">
            <div className="space-y-4">
              {isLoading ? (
                <Card>
                  <CardContent className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </CardContent>
                </Card>
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((notice: Notice) => (
                  <Card key={notice.id} className={notice.is_important ? "border-l-4 border-l-primary" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                          {notice.is_important && (
                            <Badge variant="secondary">
                              <Bell className="h-3 w-3 mr-1" /> Important
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Published</Badge>
                          {notice.target_audience.map((audience, index) => (
                            <Badge key={index} variant="outline">
                              {audience.charAt(0).toUpperCase() + audience.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{notice.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Posted by: {notice.author?.first_name} {notice.author?.last_name}</span>
                          <span className="mx-2">•</span>
                          <span>Date: {new Date(notice.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
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
                      </div>
                    </CardContent>
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
          </TabsContent>

          <TabsContent value="published" className="p-0">
            <div className="space-y-4">
              {isLoading ? (
                <Card>
                  <CardContent className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </CardContent>
                </Card>
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((notice: Notice) => (
                  <Card key={notice.id} className={notice.is_important ? "border-l-4 border-l-primary" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                          {notice.is_important && (
                            <Badge variant="secondary">
                              <Bell className="h-3 w-3 mr-1" /> Important
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {notice.target_audience.map((audience, index) => (
                            <Badge key={index} variant="outline">
                              {audience.charAt(0).toUpperCase() + audience.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{notice.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Posted by: {notice.author?.first_name} {notice.author?.last_name}</span>
                          <span className="mx-2">•</span>
                          <span>Date: {new Date(notice.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(notice.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Notices;
