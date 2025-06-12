import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2 } from 'lucide-react';
import { academicAPI} from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';
import { coreAPI } from '@/services/api';

interface Student {
  id: number;
  name: string;
  rollNo: string;
  marks: string;
}

interface Class {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
  class_assigned_id: number;
}

interface Subject {
  id: number;
  name: string;
}

interface ExamType {
  id: number;
  name: string;
  short_code: string;
}

const UploadMarks: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedExamTypeId, setSelectedExamTypeId] = useState<number | null>(null);
  const [testDetails, setTestDetails] = useState({
    title: '',
    totalMarks: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch classes, sections, subjects, and exam types
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classesRes, sectionsRes, subjectsRes, examTypesRes] = await Promise.all([
          coreAPI.classes.list(),
          coreAPI.sections.list(),
          coreAPI.subjects.list(),
          academicAPI.examTypes.list(),
        ]);

        // Log raw responses
        console.log('Raw Classes Response:', classesRes);
        console.log('Raw Sections Response:', sectionsRes);
        console.log('Raw Subjects Response:', subjectsRes);
        console.log('Raw Exam Types Response:', examTypesRes);

        // Extract data
        const classesData = classesRes.data.results || classesRes.data || [];
        const sectionsData = sectionsRes.data.results || sectionsRes.data || [];
        const subjectsData = subjectsRes.data.results || subjectsRes.data || [];
        const examTypesData = examTypesRes.data.results || examTypesRes.data || [];

        // Log extracted data
        console.log('Classes Data:', classesData);
        console.log('Sections Data:', sectionsData);
        console.log('Subjects Data:', subjectsData);
        console.log('Exam Types Data:', examTypesData);

        setClasses(classesData);
        setSections(sectionsData);
        setSubjects(subjectsData);
        setExamTypes(examTypesData);

        // Set initial selections
        if (classesData.length > 0) {
          setSelectedClassId(classesData[0].id);
        }
        if (subjectsData.length > 0) {
          setSelectedSubjectId(subjectsData[0].id);
        }
        if (examTypesData.length > 0) {
          setSelectedExamTypeId(examTypesData[0].id);
        }

        // Toast warnings for empty data
        if (classesData.length === 0) {
          toast({
            title: 'Warning',
            description: 'No classes available. Please contact the administrator.',
            variant: 'destructive',
          });
        }
        if (sectionsData.length === 0) {
          toast({
            title: 'Warning',
            description: 'No sections available. Please contact the administrator.',
            variant: 'destructive',
          });
        }
        if (subjectsData.length === 0) {
          toast({
            title: 'Warning',
            description: 'No subjects available. Please contact the administrator.',
            variant: 'destructive',
          });
        }
        if (examTypesData.length === 0) {
          toast({
            title: 'Warning',
            description: 'No exam types available. Please contact the administrator.',
            variant: 'destructive',
          });
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        toast({
          title: 'Error',
          description: err.response?.data?.detail || 'Failed to fetch data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Log state changes
  useEffect(() => {
    console.log('Classes State:', classes);
    console.log('Sections State:', sections);
    console.log('Subjects State:', subjects);
    console.log('Exam Types State:', examTypes);
  }, [classes, sections, subjects, examTypes]);

  // Filter sections based on selected class
  const filteredSections = sections.filter(
    (section) => section.class_assigned_id === selectedClassId
  );

  // Log filtered sections
  useEffect(() => {
    console.log('Filtered Sections:', filteredSections);
  }, [filteredSections]);

  // Reset section when class changes
  useEffect(() => {
    if (selectedClassId && filteredSections.length > 0) {
      setSelectedSectionId(filteredSections[0].id);
    } else {
      setSelectedSectionId(null);
    }
  }, [selectedClassId, filteredSections]);

  // Fetch students when class and section change
  useEffect(() => {
    if (selectedClassId && selectedSectionId) {
      setLoading(true);
      academicAPI
        .getStudents(selectedClassId, selectedSectionId)
        .then((res) => {
          console.log('Raw Students Response:', res);
          const studentsData = res.data.results || res.data || [];
          console.log('Students Data:', studentsData);
          setStudents(
            studentsData.map((student: any) => ({
              id: student.id,
              name:
                student.user?.full_name ||
                [student.user?.first_name, student.user?.last_name].filter(Boolean).join(' ') ||
                'Unknown Student',
              rollNo: student.roll_number || 'N/A',
              marks: '',
            }))
          );
        })
        .catch((err) => {
          console.error('getStudents error:', err);
          setStudents([]);
          toast({
            title: 'Error',
            description: err.response?.data?.detail || 'Failed to fetch students',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
    }
  }, [selectedClassId, selectedSectionId, toast]);

  const updateStudentMarks = (studentId: number, marks: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, marks } : student
      )
    );
  };

  const handleSave = async () => {
    if (
      !selectedClassId ||
      !selectedSectionId ||
      !selectedSubjectId ||
      !selectedExamTypeId ||
      !testDetails.title ||
      !testDetails.totalMarks
    ) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields (Class, Section, Subject, Exam Type, Title, Total Marks)',
        variant: 'destructive',
      });
      return;
    }

    const totalMarksNum = Number(testDetails.totalMarks);
    if (isNaN(totalMarksNum) || totalMarksNum <= 0) {
      toast({
        title: 'Error',
        description: 'Total Marks must be a positive number',
        variant: 'destructive',
      });
      return;
    }

    // Validate student marks
    for (const student of students) {
      if (student.marks !== '') {
        const marksNum = Number(student.marks);
        if (isNaN(marksNum) || marksNum < 0 || marksNum > totalMarksNum) {
          toast({
            title: 'Error',
            description: `Invalid marks for ${student.name}. Marks must be between 0 and ${testDetails.totalMarks}`,
            variant: 'destructive',
          });
          return;
        }
      }
    }

    setSaving(true);
    try {
      // Create Exam
      const examPayload = {
        name: testDetails.title,
        exam_type: selectedExamTypeId,
        class_assigned: selectedClassId,
        section: selectedSectionId,
        subject: selectedSubjectId,
        date: testDetails.date,
        start_time: '09:00:00',
        end_time: '10:00:00',
        max_marks: totalMarksNum,
        description: testDetails.description,
      };
      console.log('Exam Payload:', examPayload);
      const examRes = await academicAPI.exams.create(examPayload);
      console.log('Exam Response:', examRes);
      const examId = examRes.data.id;

      // Upload marks for each student
      const markPromises = students
        .filter((student) => student.marks !== '')
        .map((student) =>
          academicAPI.marks.create({
            student: student.id,
            exam: examId,
            marks_obtained: Number(student.marks),
            remarks: '',
          })
        );

      await Promise.all(markPromises);

      toast({
        title: 'Success',
        description: 'Marks uploaded successfully!',
      });
      navigate('/teacher');
    } catch (err: any) {
      console.error('Save error:', err.response?.data || err);
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to upload marks',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Loading state for initial fetch
  if (loading && !selectedClassId) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6 p-4">
        <div>
          <Link
            to="/teacher"
            className="text-sm text-muted-foreground hover:text-primary transition-colors mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Upload Student Marks</h1>
          <p className="text-sm text-muted-foreground">Upload test results and marks for your students</p>
        </div>

        <Card className="bg-background border-muted">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold">Test Details</CardTitle>
            <CardDescription>Enter the details about the test/assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Chapter 5 Quiz"
                  value={testDetails.title}
                  onChange={(e) => setTestDetails({ ...testDetails, title: e.target.value })}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type</Label>
                <Select
                  value={selectedExamTypeId?.toString() || 'none'}
                  onValueChange={(value) =>
                    setSelectedExamTypeId(value === 'none' ? null : Number(value))
                  }
                  disabled={loading || saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Exam Type</SelectItem>
                    {examTypes.length > 0 ? (
                      examTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name || `Exam Type ${type.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No exam types available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={selectedSubjectId?.toString() || 'none'}
                  onValueChange={(value) =>
                    setSelectedSubjectId(value === 'none' ? null : Number(value))
                  }
                  disabled={loading || saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Subject</SelectItem>
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name || `Subject ${subject.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No subjects available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={selectedClassId?.toString() || 'none'}
                  onValueChange={(value) =>
                    setSelectedClassId(value === 'none' ? null : Number(value))
                  }
                  disabled={loading || saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Class</SelectItem>
                    {classes.length > 0 ? (
                      classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name || `Class ${cls.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No classes available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={selectedSectionId?.toString() || 'none'}
                  onValueChange={(value) =>
                    setSelectedSectionId(value === 'none' ? null : Number(value))
                  }
                  disabled={loading || saving || !selectedClassId || filteredSections.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Section</SelectItem>
                    {filteredSections.length > 0 ? (
                      filteredSections.map((section) => (
                        <SelectItem key={section.id} value={section.id.toString()}>
                          {section.name || `Section ${section.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No sections available for this class
                      </SelectItem>
                    )}
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
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Test Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={testDetails.date}
                  onChange={(e) => setTestDetails({ ...testDetails, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={saving}
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
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-muted">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center text-lg font-semibold">
                  Student Marks -{' '}
                  {classes.find((cls) => cls.id === selectedClassId)?.name || 'Select a Class'}
                  {selectedSectionId &&
                    ` (${filteredSections.find((sec) => sec.id === selectedSectionId)?.name || ''})`}
                </CardTitle>
                <CardDescription>Enter marks for each student</CardDescription>
              </div>
              <Button onClick={handleSave} disabled={loading || saving || students.length === 0}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save All Marks
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground p-2 border-b border-muted">
                  <div className="col-span-2">Roll No</div>
                  <div className="col-span-6">Student Name</div>
                  <div className="col-span-4">Marks Obtained</div>
                </div>
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-12 gap-4 items-center p-3 border-b border-muted rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-2">
                      <Badge variant="outline">{student.rollNo}</Badge>
                    </div>
                    <div className="col-span-6">
                      <span className="font-medium text-sm">{student.name}</span>
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        placeholder="0"
                        max={testDetails.totalMarks}
                        value={student.marks}
                        onChange={(e) => updateStudentMarks(student.id, e.target.value)}
                        className="w-24"
                        disabled={saving}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground" role="alert">
                No students found for this class and section
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UploadMarks;