import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save } from 'lucide-react';
import { academicAPI } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';

interface Student {
  id: number;
  name: string;
  rollNo: string;
  marks: string;
}

interface ClassSection {
  id: number;
  name: string;
  section?: string;
}

interface Subject {
  id: number;
  name: string;
}

const testTypes = [
  { value: 'unit_test', label: 'Unit Test' },
  { value: 'mid_term', label: 'Mid Term' },
  { value: 'final', label: 'Final Exam' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'project', label: 'Project' },
];

const UploadMarks: React.FC = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | ''>('');
  const [testDetails, setTestDetails] = useState({
    title: '',
    type: '',
    totalMarks: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  // Fetch classes and subjects on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          academicAPI.getClasses(),
          academicAPI.getSubjects(),
        ]);
        const classesArray = Array.isArray(classesRes) ? classesRes : classesRes?.results || [];
        const subjectsArray = Array.isArray(subjectsRes) ? subjectsRes : subjectsRes?.results || [];
        setClasses(classesArray);
        setSubjects(subjectsArray);
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch classes or subjects", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClassId) {
      setLoading(true);
      academicAPI.getStudents(Number(selectedClassId))
        .then(res => {
          const studentsArray = Array.isArray(res) ? res : res?.results || [];
          setStudents(studentsArray.map((student: any) => ({
            id: student.id,
            name: student.user?.full_name ||
              [student.user?.first_name, student.user?.last_name].filter(Boolean).join(' ') ||
              'Student',
            rollNo: student.roll_number || '',
            marks: '',
          })));
        })
        .catch(() => {
          setStudents([]);
          toast({ title: "Error", description: "Failed to fetch students", variant: "destructive" });
        })
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
    }
  }, [selectedClassId, toast]);

  const updateStudentMarks = (studentId: number, marks: string) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, marks } : student
    ));
  };

  const handleSave = async () => {
    if (!selectedClassId || !selectedSubjectId || !testDetails.type || !testDetails.totalMarks || !testDetails.title) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // 1. Create Exam
      const examPayload = {
        name: testDetails.title,
        exam_type: testDetails.type,
        class_assigned: selectedClassId,
        subject: selectedSubjectId,
        date: testDetails.date,
        start_time: "09:00:00",
        end_time: "10:00:00",
        max_marks: Number(testDetails.totalMarks),
        description: testDetails.description,
      };
      const examRes = await academicAPI.createExam(examPayload);
      const examId = examRes.id;

      // 2. Upload marks for each student
      for (const student of students) {
        if (student.marks !== '') {
          await academicAPI.uploadMark({
            student: student.id,
            exam: examId,
            marks_obtained: Number(student.marks),
            remarks: '',
          });
        }
      }
      toast({ title: "Success", description: "Marks uploaded successfully!" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload marks", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Upload Student Marks</h1>
          <p className="text-muted-foreground">
            Upload test results and marks for your students
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
            <CardDescription>Enter the details about the test/assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Chapter 5 Quiz"
                  value={testDetails.title}
                  onChange={(e) => setTestDetails({ ...testDetails, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Test Type</Label>
                <Select value={testDetails.type} onValueChange={(value) => setTestDetails({ ...testDetails, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={String(selectedSubjectId)} onValueChange={(value) => setSelectedSubjectId(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(subjects) && subjects.map(subject => (
                      <SelectItem key={subject.id} value={String(subject.id)}>{subject.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Class</Label>
                <Select value={String(selectedClassId)} onValueChange={(value) => setSelectedClassId(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(classes) && classes.map(cls => (
                      <SelectItem key={cls.id} value={String(cls.id)}>
                        {cls.name}{cls.section ? ` (${cls.section})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  placeholder="100"
                  value={testDetails.totalMarks}
                  onChange={(e) => setTestDetails({ ...testDetails, totalMarks: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Test Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={testDetails.date}
                  onChange={(e) => setTestDetails({ ...testDetails, date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Additional notes about the test..."
                value={testDetails.description}
                onChange={(e) => setTestDetails({ ...testDetails, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Student Marks</CardTitle>
                <CardDescription>Enter marks for each student</CardDescription>
              </div>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save All Marks'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground p-2 border-b">
                <div>Roll No</div>
                <div className="col-span-2">Student Name</div>
                <div>Marks Obtained</div>
              </div>
              {students.map(student => (
                <div key={student.id} className="grid grid-cols-4 gap-4 items-center p-3 border rounded-lg">
                  <div>
                    <Badge variant="outline">{student.rollNo}</Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="0"
                      max={testDetails.totalMarks}
                      value={student.marks}
                      onChange={(e) => updateStudentMarks(student.id, e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UploadMarks;
