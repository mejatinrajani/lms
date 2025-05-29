
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

interface HelpSupportProps {
  userRole: string;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ userRole }) => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to login page and click 'Forgot Password'. Enter your email to receive reset instructions.",
      category: "Account"
    },
    {
      question: "How can I check my attendance?",
      answer: "Navigate to the Attendance section in your dashboard to view detailed attendance records.",
      category: "Academic"
    },
    {
      question: "Where can I find my class timetable?",
      answer: "Your timetable is available in the Classes or Calendar section of your dashboard.",
      category: "Schedule"
    },
    {
      question: "How do I contact my teacher?",
      answer: "Use the Messages feature or check the teacher's contact information in the Classes section.",
      category: "Communication"
    }
  ];

  const tickets = [
    { id: 1, title: "Login Issue", status: "Resolved", date: "2025-05-20", priority: "High" },
    { id: 2, title: "Grade Question", status: "In Progress", date: "2025-05-19", priority: "Medium" },
    { id: 3, title: "System Bug Report", status: "Open", date: "2025-05-18", priority: "Low" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help and support for your {userRole} portal
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-2">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Get instant help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-2">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Phone Support</CardTitle>
            <CardDescription>Call us during business hours</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium">+1 (555) 123-4567</p>
            <p className="text-sm text-muted-foreground">Mon-Fri 9AM-5PM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-2">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Email Support</CardTitle>
            <CardDescription>Send us a detailed message</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium">support@schoollms.com</p>
            <p className="text-sm text-muted-foreground">Response within 24hrs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Submit a Ticket
            </CardTitle>
            <CardDescription>
              Can't find what you're looking for? Submit a support ticket
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select className="w-full p-2 border rounded-md">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Please provide detailed information about your issue..." 
                rows={4}
              />
            </div>
            <Button className="w-full">Submit Ticket</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              My Support Tickets
            </CardTitle>
            <CardDescription>
              Track your submitted support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{ticket.title}</h3>
                    <Badge variant={
                      ticket.status === 'Resolved' ? 'default' :
                      ticket.status === 'In Progress' ? 'secondary' : 'outline'
                    }>
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>#{ticket.id} • {ticket.date}</span>
                    <span className={`font-medium ${
                      ticket.priority === 'High' ? 'text-red-600' :
                      ticket.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{faq.question}</h3>
                  <Badge variant="outline">{faq.category}</Badge>
                </div>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
