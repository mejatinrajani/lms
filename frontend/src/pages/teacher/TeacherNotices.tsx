
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bell, Send, Plus, Calendar, Users } from 'lucide-react';

const TeacherNotices: React.FC = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      content: 'Parent-teacher meeting scheduled for next week. Please prepare progress reports.',
      date: '2024-01-15',
      priority: 'high',
      recipient: 'parents'
    },
    {
      id: 2,
      title: 'Assignment Submission',
      content: 'Reminder: Math assignment due tomorrow.',
      date: '2024-01-14',
      priority: 'medium',
      recipient: 'students'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: '',
    recipient: '',
    targetClass: '',
    targetSection: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice = {
      id: notices.length + 1,
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices([newNotice, ...notices]);
    toast.success('Notice sent successfully!');
    setShowCreateForm(false);
    setFormData({
      title: '',
      content: '',
      priority: '',
      recipient: '',
      targetClass: '',
      targetSection: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRecipientIcon = (recipient: string) => {
    switch (recipient) {
      case 'students': return <Users className="h-4 w-4" />;
      case 'parents': return <Users className="h-4 w-4" />;
      case 'all': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notices</h1>
              <p className="text-muted-foreground">
                Send and manage notices for your classes
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          </div>
        </div>

        {/* Create Notice Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Create New Notice
              </CardTitle>
              <CardDescription>
                Send a notice to students, parents, or specific classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Notice Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Notice Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Send To *</Label>
                    <Select value={formData.recipient} onValueChange={(value) => handleChange('recipient', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="students">My Students</SelectItem>
                        <SelectItem value="parents">Parents of My Students</SelectItem>
                        <SelectItem value="all">All (Students & Parents)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetClass">Class</Label>
                    <Select value={formData.targetClass} onValueChange={(value) => handleChange('targetClass', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9">Class 9</SelectItem>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="11">Class 11</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetSection">Section</Label>
                    <Select value={formData.targetSection} onValueChange={(value) => handleChange('targetSection', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Section A</SelectItem>
                        <SelectItem value="B">Section B</SelectItem>
                        <SelectItem value="C">Section C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Notice
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notices List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Notices</h2>
          {notices.map((notice) => (
            <Card key={notice.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{notice.title}</h3>
                      <Badge className={`${getPriorityColor(notice.priority)} text-white`}>
                        {notice.priority}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{notice.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {notice.date}
                      </div>
                      <div className="flex items-center gap-1">
                        {getRecipientIcon(notice.recipient)}
                        {notice.recipient}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherNotices;
