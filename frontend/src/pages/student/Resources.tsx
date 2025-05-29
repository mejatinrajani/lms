
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, Download, BookOpen, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ResourceCard: React.FC<{
  id: number;
  title: string;
  type: string;
  subject: string;
  uploadedBy: string;
  uploadedDate: string;
  size?: string;
  description: string;
}> = ({ id, title, type, subject, uploadedBy, uploadedDate, size, description }) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <Card key={id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`p-2 rounded-md mr-3 ${
              type.toLowerCase() === 'pdf' ? 'bg-red-100 text-red-700' : 
              type.toLowerCase() === 'video' ? 'bg-blue-100 text-blue-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {getIcon()}
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                <Badge variant="outline">{type}</Badge>
                <span className="ml-2">{subject}</span>
                {size && <span className="ml-2">{size}</span>}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Uploaded by {uploadedBy} on {new Date(uploadedDate).toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              View
            </Button>
            <Button size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Resources: React.FC = () => {
  // Mock resources data
  const resourcesData = {
    textbooks: [
      {
        id: 1,
        title: 'Mathematics Textbook',
        type: 'PDF',
        subject: 'Mathematics',
        uploadedBy: 'Mr. Smith',
        uploadedDate: '2025-04-10',
        size: '8.5 MB',
        description: 'Complete mathematics textbook for Grade 10. Covers algebra, geometry, and trigonometry.'
      },
      {
        id: 2,
        title: 'Physics Fundamentals',
        type: 'PDF',
        subject: 'Physics',
        uploadedBy: 'Mrs. Johnson',
        uploadedDate: '2025-04-12',
        size: '12.3 MB',
        description: 'Physics textbook covering mechanics, thermodynamics, and wave properties.'
      },
      {
        id: 3,
        title: 'English Literature Anthology',
        type: 'PDF',
        subject: 'English',
        uploadedBy: 'Ms. Williams',
        uploadedDate: '2025-04-15',
        size: '10.1 MB',
        description: 'Collection of literary works including Shakespeare, Dickens, and modern authors.'
      }
    ],
    worksheets: [
      {
        id: 101,
        title: 'Algebra Practice Problems',
        type: 'PDF',
        subject: 'Mathematics',
        uploadedBy: 'Mr. Smith',
        uploadedDate: '2025-05-01',
        size: '2.1 MB',
        description: 'Practice worksheet for quadratic equations and inequalities.'
      },
      {
        id: 102,
        title: 'Physics Lab Worksheet',
        type: 'PDF',
        subject: 'Physics',
        uploadedBy: 'Mrs. Johnson',
        uploadedDate: '2025-05-05',
        size: '1.8 MB',
        description: 'Worksheet for the upcoming pendulum experiment with data tables.'
      }
    ],
    videos: [
      {
        id: 201,
        title: 'Introduction to Calculus',
        type: 'Video',
        subject: 'Mathematics',
        uploadedBy: 'Mr. Smith',
        uploadedDate: '2025-05-08',
        size: '45:20 min',
        description: 'Video lecture explaining the fundamentals of calculus with examples.'
      },
      {
        id: 202,
        title: 'Understanding Shakespeare',
        type: 'Video',
        subject: 'English',
        uploadedBy: 'Ms. Williams',
        uploadedDate: '2025-05-10',
        size: '38:15 min',
        description: 'Analysis of Shakespeare\'s major works and literary techniques.'
      }
    ],
    notes: [
      {
        id: 301,
        title: 'Chemistry Unit 5 Notes',
        type: 'PDF',
        subject: 'Chemistry',
        uploadedBy: 'Mr. Wilson',
        uploadedDate: '2025-05-12',
        size: '3.2 MB',
        description: 'Comprehensive notes on organic chemistry reactions and mechanisms.'
      },
      {
        id: 302,
        title: 'History Timeline',
        type: 'PDF',
        subject: 'History',
        uploadedBy: 'Mr. Davis',
        uploadedDate: '2025-05-14',
        size: '1.5 MB',
        description: 'Timeline of major world events from 1900-1950.'
      }
    ]
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <Link to="/student" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
          <p className="text-muted-foreground">
            Access study materials, textbooks, worksheets, and educational videos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search resources..." 
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Subjects</DropdownMenuItem>
                <DropdownMenuItem>Mathematics</DropdownMenuItem>
                <DropdownMenuItem>Physics</DropdownMenuItem>
                <DropdownMenuItem>Chemistry</DropdownMenuItem>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>History</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Types</DropdownMenuItem>
                <DropdownMenuItem>PDFs</DropdownMenuItem>
                <DropdownMenuItem>Videos</DropdownMenuItem>
                <DropdownMenuItem>Worksheets</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Latest First</DropdownMenuItem>
                <DropdownMenuItem>Oldest First</DropdownMenuItem>
                <DropdownMenuItem>A-Z</DropdownMenuItem>
                <DropdownMenuItem>Z-A</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-5 w-full mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
            <TabsTrigger value="worksheets">Worksheets</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {[...resourcesData.textbooks, ...resourcesData.worksheets, ...resourcesData.videos, ...resourcesData.notes].map(resource => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </TabsContent>
          
          <TabsContent value="textbooks" className="space-y-4">
            {resourcesData.textbooks.map(resource => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </TabsContent>
          
          <TabsContent value="worksheets" className="space-y-4">
            {resourcesData.worksheets.map(resource => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-4">
            {resourcesData.videos.map(resource => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            {resourcesData.notes.map(resource => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Resources;
