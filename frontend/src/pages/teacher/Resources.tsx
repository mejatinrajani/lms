import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Plus,
  File,
  FileText,
  FileImage,
  FileVideo,
  MoreVertical,
  Filter,
  Upload,
  Download,
  Calendar,
  CheckCircle2,
  Tags,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'presentation' | 'spreadsheet' | 'other';
  fileSize: string;
  uploadDate: string;
  description?: string;
  subject?: string;
  grade?: string;
  section?: string;
  tags?: string[];
  shared: boolean;
  downloadCount: number;
  url?: string;
}

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      title: 'Algebra Fundamentals',
      type: 'pdf',
      fileSize: '2.4 MB',
      uploadDate: '2025-05-10',
      description: 'Basic algebra concepts and formulas',
      subject: 'Mathematics',
      grade: '10',
      section: 'A',
      tags: ['algebra', 'formulas', 'fundamentals'],
      shared: true,
      downloadCount: 45
    },
    {
      id: 2,
      title: 'Quadratic Equations Exercise',
      type: 'doc',
      fileSize: '1.2 MB',
      uploadDate: '2025-05-12',
      description: 'Practice problems for quadratic equations',
      subject: 'Mathematics',
      grade: '10',
      section: 'A',
      tags: ['quadratic', 'exercise', 'problems'],
      shared: true,
      downloadCount: 32
    },
    {
      id: 3,
      title: 'Linear Equations Presentation',
      type: 'presentation',
      fileSize: '5.7 MB',
      uploadDate: '2025-05-15',
      description: 'Slideshow explaining linear equations',
      subject: 'Mathematics',
      grade: '9',
      section: 'B',
      tags: ['linear', 'equations', 'slides'],
      shared: false,
      downloadCount: 0
    },
    {
      id: 4,
      title: 'Geometry Visual Aids',
      type: 'image',
      fileSize: '3.8 MB',
      uploadDate: '2025-05-17',
      description: 'Visual diagrams for geometry concepts',
      subject: 'Mathematics',
      grade: '11',
      section: 'C',
      tags: ['geometry', 'visual', 'diagrams'],
      shared: true,
      downloadCount: 28
    },
    {
      id: 5,
      title: 'Calculus Introduction',
      type: 'video',
      fileSize: '24.5 MB',
      uploadDate: '2025-05-18',
      description: 'Introduction to calculus concepts',
      subject: 'Mathematics',
      grade: '11',
      section: 'C',
      tags: ['calculus', 'introduction', 'video'],
      shared: true,
      downloadCount: 52
    },
    {
      id: 6,
      title: 'Math Quiz Results',
      type: 'spreadsheet',
      fileSize: '1.1 MB',
      uploadDate: '2025-05-20',
      description: 'Quiz results for the latest math assessment',
      subject: 'Mathematics',
      grade: '10',
      section: 'A',
      tags: ['quiz', 'results', 'assessment'],
      shared: false,
      downloadCount: 0
    }
  ]);
  
  // Filter resources based on search term and subject
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || 
      (resource.subject?.toLowerCase() === selectedSubject.toLowerCase());
    
    return matchesSearch && matchesSubject;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Get icon for file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc': return <FileText className="h-8 w-8 text-blue-500" />;
      case 'image': return <FileImage className="h-8 w-8 text-green-500" />;
      case 'video': return <FileVideo className="h-8 w-8 text-purple-500" />;
      case 'presentation': return <File className="h-8 w-8 text-amber-500" />;
      case 'spreadsheet': return <File className="h-8 w-8 text-emerald-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Teaching Resources</h1>
              <p className="text-muted-foreground">
                Manage and share your teaching materials
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                    <DialogDescription>
                      Upload a new teaching resource to your library
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input id="title" placeholder="Resource title" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <Textarea id="description" placeholder="Describe the resource..." rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                        <Input id="subject" defaultValue="Mathematics" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="class" className="text-sm font-medium">Class</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10a">Grade 10-A</SelectItem>
                            <SelectItem value="9b">Grade 9-B</SelectItem>
                            <SelectItem value="11c">Grade 11-C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
                      <Input id="tags" placeholder="e.g. algebra, formulas, practice" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">File</label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">Drag files here or click to browse</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Support for PDF, Word, PowerPoint, Excel, images and videos
                        </p>
                        <Input id="file" type="file" className="hidden" />
                        <Button size="sm" onClick={() => document.getElementById('file')?.click()}>
                          Browse Files
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="share" />
                      <label htmlFor="share" className="text-sm font-medium">
                        Share with students
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Upload Resource</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="shrink-0">
                <Upload className="h-4 w-4 mr-2" /> Import
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedSubject('all')}>
                  All Subjects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSubject('mathematics')}>
                  Mathematics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>PDF Documents</DropdownMenuItem>
                <DropdownMenuItem>Word Documents</DropdownMenuItem>
                <DropdownMenuItem>Presentations</DropdownMenuItem>
                <DropdownMenuItem>Images</DropdownMenuItem>
                <DropdownMenuItem>Videos</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-0 border-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="bg-muted/30 p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(resource.type)}
                      <div className="ml-4">
                        <Badge variant="outline" className="uppercase text-xs mb-1">
                          {resource.type}
                        </Badge>
                        <h3 className="font-medium truncate">{resource.title}</h3>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>
                          {resource.shared ? 'Make Private' : 'Share with Students'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">File size:</span>
                        <span>{resource.fileSize}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Uploaded:</span>
                        <span>{formatDate(resource.uploadDate)}</span>
                      </div>
                      
                      {resource.grade && resource.section && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Class:</span>
                          <Badge variant="outline">
                            Grade {resource.grade}-{resource.section}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={resource.shared ? "default" : "secondary"}>
                          {resource.shared ? 'Shared' : 'Private'}
                        </Badge>
                      </div>
                      
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="pt-3">
                          <div className="flex items-center gap-2 mb-1.5 text-sm text-muted-foreground">
                            <Tags className="h-4 w-4" /> Tags:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0 px-4 pb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Download className="h-4 w-4 mr-1" />
                      {resource.downloadCount} downloads
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredResources.length === 0 && (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8">
                      <File className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="mb-4 text-muted-foreground">No resources found matching your criteria</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" /> Add Resource
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          {/* Resource upload dialog content (same as above) */}
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="shared" className="p-0 border-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .filter(resource => resource.shared)
                .map((resource) => (
                  <Card key={resource.id} className="overflow-hidden">
                    <div className="bg-muted/30 p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {getFileIcon(resource.type)}
                        <div className="ml-4">
                          <Badge variant="outline" className="uppercase text-xs mb-1">
                            {resource.type}
                          </Badge>
                          <h3 className="font-medium truncate">{resource.title}</h3>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>
                            {resource.shared ? 'Make Private' : 'Share with Students'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">File size:</span>
                          <span>{resource.fileSize}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span>{formatDate(resource.uploadDate)}</span>
                        </div>
                        
                        {resource.grade && resource.section && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Class:</span>
                            <Badge variant="outline">
                              Grade {resource.grade}-{resource.section}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={resource.shared ? "default" : "secondary"}>
                            {resource.shared ? 'Shared' : 'Private'}
                          </Badge>
                        </div>
                        
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="pt-3">
                            <div className="flex items-center gap-2 mb-1.5 text-sm text-muted-foreground">
                              <Tags className="h-4 w-4" /> Tags:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {resource.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 px-4 pb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloadCount} downloads
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="private" className="p-0 border-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .filter(resource => !resource.shared)
                .map((resource) => (
                  <Card key={resource.id} className="overflow-hidden">
                    <div className="bg-muted/30 p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {getFileIcon(resource.type)}
                        <div className="ml-4">
                          <Badge variant="outline" className="uppercase text-xs mb-1">
                            {resource.type}
                          </Badge>
                          <h3 className="font-medium truncate">{resource.title}</h3>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>
                            {resource.shared ? 'Make Private' : 'Share with Students'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">File size:</span>
                          <span>{resource.fileSize}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span>{formatDate(resource.uploadDate)}</span>
                        </div>
                        
                        {resource.grade && resource.section && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Class:</span>
                            <Badge variant="outline">
                              Grade {resource.grade}-{resource.section}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={resource.shared ? "default" : "secondary"}>
                            {resource.shared ? 'Shared' : 'Private'}
                          </Badge>
                        </div>
                        
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="pt-3">
                            <div className="flex items-center gap-2 mb-1.5 text-sm text-muted-foreground">
                              <Tags className="h-4 w-4" /> Tags:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {resource.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 px-4 pb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloadCount} downloads
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="p-0 border-none">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                .slice(0, 6)
                .map((resource) => (
                  <Card key={resource.id} className="overflow-hidden">
                    <div className="bg-muted/30 p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {getFileIcon(resource.type)}
                        <div className="ml-4">
                          <Badge variant="outline" className="uppercase text-xs mb-1">
                            {resource.type}
                          </Badge>
                          <h3 className="font-medium truncate">{resource.title}</h3>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>
                            {resource.shared ? 'Make Private' : 'Share with Students'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">File size:</span>
                          <span>{resource.fileSize}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span>{formatDate(resource.uploadDate)}</span>
                        </div>
                        
                        {resource.grade && resource.section && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Class:</span>
                            <Badge variant="outline">
                              Grade {resource.grade}-{resource.section}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={resource.shared ? "default" : "secondary"}>
                            {resource.shared ? 'Shared' : 'Private'}
                          </Badge>
                        </div>
                        
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="pt-3">
                            <div className="flex items-center gap-2 mb-1.5 text-sm text-muted-foreground">
                              <Tags className="h-4 w-4" /> Tags:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {resource.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 px-4 pb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloadCount} downloads
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Resources;
