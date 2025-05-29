
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Send, Edit, Trash2, Users, School, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Notice {
  id: number;
  title: string;
  content: string;
  audience: string[];
  isImportant: boolean;
  sentTo: string;
  createdAt: string;
  status: 'draft' | 'sent';
}

const PrincipalNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: 'School Annual Day Celebration',
      content: 'We are pleased to announce the annual day celebration will be held on December 15th.',
      audience: ['Whole School'],
      isImportant: true,
      sentTo: 'Whole School',
      createdAt: '2025-05-20',
      status: 'sent'
    },
    {
      id: 2,
      title: 'Parent-Teacher Meeting',
      content: 'Parent-teacher meeting is scheduled for this Saturday. Please mark your attendance.',
      audience: ['Parents', 'Teachers'],
      isImportant: false,
      sentTo: 'Parents & Teachers',
      createdAt: '2025-05-18',
      status: 'sent'
    }
  ]);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    audience: [] as string[],
    isImportant: false,
    targetType: 'sections' as 'sections' | 'roles' | 'whole-school'
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const sections = [
    'Grade 9 - Section A',
    'Grade 9 - Section B', 
    'Grade 10 - Section A',
    'Grade 10 - Section B',
    'Grade 11 - Section A',
    'Grade 12 - Section A'
  ];

  const roles = ['Students', 'Teachers', 'Parents'];

  const handleAudienceChange = (item: string, checked: boolean) => {
    if (checked) {
      setNewNotice(prev => ({
        ...prev,
        audience: [...prev.audience, item]
      }));
    } else {
      setNewNotice(prev => ({
        ...prev,
        audience: prev.audience.filter(s => s !== item)
      }));
    }
  };

  const handleTargetTypeChange = (type: 'sections' | 'roles' | 'whole-school') => {
    setNewNotice(prev => ({
      ...prev,
      targetType: type,
      audience: type === 'whole-school' ? ['Whole School'] : []
    }));
  };

  const handleSendNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      alert('Please fill in all required fields.');
      return;
    }

    if (newNotice.targetType !== 'whole-school' && newNotice.audience.length === 0) {
      alert('Please select at least one audience.');
      return;
    }

    const notice: Notice = {
      id: notices.length + 1,
      title: newNotice.title,
      content: newNotice.content,
      audience: newNotice.audience,
      isImportant: newNotice.isImportant,
      sentTo: newNotice.audience.length === 1 ? newNotice.audience[0] : 'Multiple Recipients',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'sent'
    };

    setNotices([notice, ...notices]);
    setNewNotice({
      title: '',
      content: '',
      audience: [],
      isImportant: false,
      targetType: 'sections'
    });
    setShowCreateDialog(false);
    alert('Notice sent successfully!');
  };

  const handleDeleteNotice = (id: number) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter(notice => notice.id !== id));
    }
  };

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">School Notices</h1>
              <p className="text-muted-foreground">
                Send and manage notices to students, teachers, and parents
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Notice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Notice</DialogTitle>
                  <DialogDescription>
                    Send a notice to specific sections, roles, or the whole school
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Notice Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter notice title"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Notice Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter notice content"
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select 
                      value={newNotice.targetType} 
                      onValueChange={(value: 'sections' | 'roles' | 'whole-school') => handleTargetTypeChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sections">Specific Sections</SelectItem>
                        <SelectItem value="roles">User Roles</SelectItem>
                        <SelectItem value="whole-school">Whole School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newNotice.targetType === 'sections' && (
                    <div className="space-y-2">
                      <Label>Select Sections</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {sections.map(section => (
                          <div key={section} className="flex items-center space-x-2">
                            <Checkbox
                              id={section}
                              checked={newNotice.audience.includes(section)}
                              onCheckedChange={(checked) => handleAudienceChange(section, Boolean(checked))}
                            />
                            <Label htmlFor={section} className="text-sm font-normal">
                              {section}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {newNotice.targetType === 'roles' && (
                    <div className="space-y-2">
                      <Label>Select Roles</Label>
                      <div className="space-y-2">
                        {roles.map(role => (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                              id={role}
                              checked={newNotice.audience.includes(role)}
                              onCheckedChange={(checked) => handleAudienceChange(role, Boolean(checked))}
                            />
                            <Label htmlFor={role} className="text-sm font-normal">
                              {role}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="important"
                      checked={newNotice.isImportant}
                      onCheckedChange={(checked) => setNewNotice({...newNotice, isImportant: Boolean(checked)})}
                    />
                    <Label htmlFor="important">Mark as Important</Label>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSendNotice} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Notice
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notices</CardTitle>
              <CardDescription>
                Notices you've sent to the school community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notices.map(notice => (
                  <div key={notice.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{notice.title}</h3>
                          {notice.isImportant && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Important
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {notice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notice.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>Sent to: {notice.sentTo}</span>
                          </div>
                          <span>Date: {notice.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteNotice(notice.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {notice.audience.map((audience, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrincipalNotices;
