
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus,
  FileText,
  Clock,
  Calendar,
  PenLine,
  MoreVertical,
  ChevronDown,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assignment {
  id: number;
  title: string;
  description: string;
  class: string;
  dueDate: string;
  assignedDate: string;
  status: 'draft' | 'assigned' | 'graded';
  submissionCount: number;
  totalStudents: number;
}

const Assignments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Algebra Word Problems',
      description: 'Solve the word problems on pages 45-48 in your textbook.',
      class: 'Mathematics 10A',
      dueDate: '2025-05-25',
      assignedDate: '2025-05-18',
      status: 'assigned',
      submissionCount: 18,
      totalStudents: 32,
    },
    {
      id: 2,
      title: 'Linear Equations Quiz',
      description: 'Complete the online quiz covering linear equations.',
      class: 'Mathematics 9B',
      dueDate: '2025-05-22',
      assignedDate: '2025-05-15',
      status: 'assigned',
      submissionCount: 10,
      totalStudents: 28,
    },
    {
      id: 3,
      title: 'Calculus Introduction',
      description: 'Read Chapter 1 and answer the review questions.',
      class: 'Mathematics 11C',
      dueDate: '2025-05-28',
      assignedDate: '2025-05-19',
      status: 'draft',
      submissionCount: 0,
      totalStudents: 30,
    },
    {
      id: 4,
      title: 'Mid-Term Review',
      description: 'Complete the review worksheet for the upcoming mid-term exam.',
      class: 'Mathematics 10A',
      dueDate: '2025-05-20',
      assignedDate: '2025-05-10',
      status: 'graded',
      submissionCount: 32,
      totalStudents: 32,
    },
  ]);
  
  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-3xl font-bold mb-1">Assignments</h1>
              <p className="text-muted-foreground">
                Create, manage and grade assignments for your classes
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" /> Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                  <DialogDescription>
                    Fill in the details of the new assignment. Click create when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input id="title" placeholder="Assignment title" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="class" className="text-sm font-medium">Class</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math10a">Mathematics 10A</SelectItem>
                        <SelectItem value="math9b">Mathematics 9B</SelectItem>
                        <SelectItem value="math11c">Mathematics 11C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                    <Input type="date" id="dueDate" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the assignment..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create & Publish</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assignments..."
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
                <DropdownMenuItem>All Assignments</DropdownMenuItem>
                <DropdownMenuItem>Draft</DropdownMenuItem>
                <DropdownMenuItem>Assigned</DropdownMenuItem>
                <DropdownMenuItem>Graded</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Mathematics 10A</DropdownMenuItem>
                <DropdownMenuItem>Mathematics 9B</DropdownMenuItem>
                <DropdownMenuItem>Mathematics 11C</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Assignments</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-0 border-none">
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">{assignment.class}</Badge>
                        </div>
                        <CardTitle>{assignment.title}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Submissions</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>{assignment.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-y-2 gap-x-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Assigned: {formatDate(assignment.assignedDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <PenLine className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Submissions: {assignment.submissionCount}/{assignment.totalStudents}</span>
                      </div>
                    </div>
                    
                    {assignment.status === 'assigned' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Submission progress</span>
                          <span>{Math.round((assignment.submissionCount / assignment.totalStudents) * 100)}%</span>
                        </div>
                        <Progress value={(assignment.submissionCount / assignment.totalStudents) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {assignment.status === 'draft' ? (
                      <Button size="sm">Publish</Button>
                    ) : assignment.status === 'assigned' ? (
                      <Button size="sm">Grade</Button>
                    ) : (
                      <Button size="sm" variant="outline">View Results</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="p-0 border-none">
            <div className="space-y-4">
              {filteredAssignments
                .filter(a => a.status === 'assigned')
                .map((assignment) => (
                  <Card key={assignment.id}>
                    {/* Same card structure as above */}
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getStatusColor(assignment.status)}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Badge>
                            <Badge variant="outline">{assignment.class}</Badge>
                          </div>
                          <CardTitle>{assignment.title}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Submissions</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>{assignment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-y-2 gap-x-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Assigned: {formatDate(assignment.assignedDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <PenLine className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Submissions: {assignment.submissionCount}/{assignment.totalStudents}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Submission progress</span>
                          <span>{Math.round((assignment.submissionCount / assignment.totalStudents) * 100)}%</span>
                        </div>
                        <Progress value={(assignment.submissionCount / assignment.totalStudents) * 100} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm">Grade</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="draft" className="p-0 border-none">
            <div className="space-y-4">
              {filteredAssignments
                .filter(a => a.status === 'draft')
                .map((assignment) => (
                  // Similar card structure
                  <Card key={assignment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-gray-200 text-gray-800">Draft</Badge>
                            <Badge variant="outline">{assignment.class}</Badge>
                          </div>
                          <CardTitle>{assignment.title}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>{assignment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Publish</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="graded" className="p-0 border-none">
            <div className="space-y-4">
              {filteredAssignments
                .filter(a => a.status === 'graded')
                .map((assignment) => (
                  // Similar card structure
                  <Card key={assignment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-green-100 text-green-800">Graded</Badge>
                            <Badge variant="outline">{assignment.class}</Badge>
                          </div>
                          <CardTitle>{assignment.title}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Export Grades</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>{assignment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-y-2 gap-x-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Assigned: {formatDate(assignment.assignedDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <PenLine className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Submissions: {assignment.submissionCount}/{assignment.totalStudents}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">View Results</Button>
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

export default Assignments;
