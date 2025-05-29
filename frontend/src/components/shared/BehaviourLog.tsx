
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Edit,
  Eye
} from 'lucide-react';

interface BehaviourLogProps {
  canAdd?: boolean;
  studentView?: boolean;
}

const BehaviourLog: React.FC<BehaviourLogProps> = ({ canAdd = false, studentView = false }) => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      student: "John Smith",
      class: "10A",
      type: "positive",
      category: "Academic Excellence",
      description: "Excellent performance in Mathematics quiz. Scored 95% and helped classmates understand complex problems.",
      reportedBy: "Mr. Johnson",
      date: "2025-05-20",
      severity: "low"
    },
    {
      id: 2,
      student: "Sarah Wilson",
      class: "9B",
      type: "negative",
      category: "Discipline Issue",
      description: "Disrupted class by talking continuously during lecture. Warning given.",
      reportedBy: "Mrs. Smith",
      date: "2025-05-19",
      severity: "medium"
    },
    {
      id: 3,
      student: "Mike Johnson",
      class: "11C",
      type: "positive",
      category: "Leadership",
      description: "Led the school cleanup drive and motivated other students to participate actively.",
      reportedBy: "Principal Davis",
      date: "2025-05-18",
      severity: "low"
    }
  ]);

  const [newLog, setNewLog] = useState({
    student: '',
    class: '',
    type: 'positive',
    category: '',
    description: '',
    severity: 'low'
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log = {
      id: logs.length + 1,
      ...newLog,
      reportedBy: "Current User",
      date: new Date().toISOString().split('T')[0]
    };
    setLogs([log, ...logs]);
    setNewLog({
      student: '',
      class: '',
      type: 'positive',
      category: '',
      description: '',
      severity: 'low'
    });
    setIsOpen(false);
  };

  const AddLogDialog = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Behaviour Log
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Behaviour Log</DialogTitle>
          <DialogDescription>
            Record student behaviour for tracking and parent communication
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Student Name</label>
              <Input 
                value={newLog.student}
                onChange={(e) => setNewLog({...newLog, student: e.target.value})}
                placeholder="Enter student name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Class/Section</label>
              <Input 
                value={newLog.class}
                onChange={(e) => setNewLog({...newLog, class: e.target.value})}
                placeholder="e.g., 10A"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newLog.type}
                onChange={(e) => setNewLog({...newLog, type: e.target.value})}
              >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input 
                value={newLog.category}
                onChange={(e) => setNewLog({...newLog, category: e.target.value})}
                placeholder="e.g., Academic, Discipline"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Severity</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={newLog.severity}
              onChange={(e) => setNewLog({...newLog, severity: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={newLog.description}
              onChange={(e) => setNewLog({...newLog, description: e.target.value})}
              placeholder="Detailed description of the behaviour..."
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Log</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Behaviour Log</h1>
          <p className="text-muted-foreground">
            {studentView ? 'Your behaviour records and achievements' : 'Track and manage student behaviour records'}
          </p>
        </div>
        {canAdd && <AddLogDialog />}
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positive Logs</p>
                <p className="text-2xl font-bold text-green-600">
                  {logs.filter(log => log.type === 'positive').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Negative Logs</p>
                <p className="text-2xl font-bold text-red-600">
                  {logs.filter(log => log.type === 'negative').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behaviour Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Behaviour Records</CardTitle>
          <CardDescription>
            {studentView ? 'Your recent behaviour records' : 'Latest behaviour logs for all students'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      log.type === 'positive' ? 'bg-green-100 text-green-600' :
                      log.type === 'negative' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {log.type === 'positive' ? <CheckCircle className="h-4 w-4" /> :
                       log.type === 'negative' ? <AlertTriangle className="h-4 w-4" /> :
                       <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{log.category}</h3>
                      {!studentView && (
                        <p className="text-sm text-muted-foreground">
                          {log.student} - Class {log.class}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      log.type === 'positive' ? 'default' :
                      log.type === 'negative' ? 'destructive' : 'secondary'
                    }>
                      {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">{log.description}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Reported by: {log.reportedBy}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviourLog;
