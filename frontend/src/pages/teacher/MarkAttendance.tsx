import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CheckSquare, 
  Calendar, 
  Search, 
  Save,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { attendanceAPI, academicAPI } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';

interface Student {
  id: number;
  name: string;
  rollNo: string;
  status: string;
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

const MarkAttendance: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Fetch classes and subjects on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          academicAPI.getClasses(),
          academicAPI.getSubjects()
        ]);
        // Ensure array for classes
        const classesArray = Array.isArray(classesRes)
          ? classesRes
          : classesRes?.results || [];
        setClasses(classesArray);

        // Ensure array for subjects
        const subjectsArray = Array.isArray(subjectsRes)
          ? subjectsRes
          : subjectsRes?.results || [];
        setSubjects(subjectsArray);

        if (classesArray.length > 0) {
          setSelectedClassId(classesArray[0].id);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch classes or subjects",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClassId) {
      fetchStudentsForClass(selectedClassId);
    }
    // eslint-disable-next-line
  }, [selectedClassId]);

  const fetchStudentsForClass = async (classId: number) => {
    setLoading(true);
    try {
      const response = await academicAPI.getStudents(classId);
      // Ensure response is always an array
      const studentsArray = Array.isArray(response)
        ? response
        : response?.results || [];
      setStudents(
        studentsArray.map((student: any) => ({
          id: student.id,
          name:
            student.user?.full_name ||
            [student.user?.first_name, student.user?.last_name].filter(Boolean).join(' ') ||
            'Student',
          rollNo: student.roll_number || '',
          status: 'present',
        }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  const updateAttendance = (studentId: number, status: string) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, status: 'present' })));
  };

  const handleSave = async () => {
    if (!selectedClassId) {
      toast({
        title: "Error",
        description: "Please select a class",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const attendanceData = {
        class_session: selectedClassId,
        subject: subjectId || null,
        date: selectedDate,
        attendance_data: students.map(student => ({
          student_id: student.id,
          status: student.status,
          remarks: ''
        }))
      };
      await attendanceAPI.bulkMarkAttendance(attendanceData);
      toast({
        title: "Success",
        description: "Attendance saved successfully!",
      });
      navigate('/teacher/attendance');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const attendanceStats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    excused: students.filter(s => s.status === 'excused').length
  };

  if (loading && !selectedClassId) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Mark Attendance</h1>
          <p className="text-muted-foreground">
            Record daily attendance for your classes
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Attendance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedClassId ?? ''}
                  onChange={(e) => setSelectedClassId(Number(e.target.value))}
                  disabled={loading}
                >
                  {Array.isArray(classes) && classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}{cls.section ? ` (${cls.section})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject (Optional)</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={subjectId}
                  onChange={(e) => setSubjectId(Number(e.target.value))}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Student</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Name or Roll No..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Excused</p>
                  <p className="text-2xl font-bold text-blue-600">{attendanceStats.excused}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Students - {classes.find(cls => cls.id === selectedClassId)?.name}
                </CardTitle>
                <CardDescription>
                  Mark attendance for {new Date(selectedDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={markAllPresent} disabled={loading}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Mark All Present
                </Button>
                <Button onClick={handleSave} disabled={loading || saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground p-2 border-b">
                  <div className="col-span-1">Roll No</div>
                  <div className="col-span-4">Student Name</div>
                  <div className="col-span-7">Attendance Status</div>
                </div>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <div key={student.id} className="grid grid-cols-12 gap-4 items-center p-3 border rounded-lg hover:bg-muted/50">
                      <div className="col-span-1">
                        <Badge variant="outline">{student.rollNo}</Badge>
                      </div>
                      <div className="col-span-4">
                        <span className="font-medium">{student.name}</span>
                      </div>
                      <div className="col-span-7">
                        <div className="flex space-x-2">
                          <Button
                            variant={student.status === 'present' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateAttendance(student.id, 'present')}
                            className="flex-1"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            variant={student.status === 'absent' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => updateAttendance(student.id, 'absent')}
                            className="flex-1"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                          <Button
                            variant={student.status === 'late' ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => updateAttendance(student.id, 'late')}
                            className="flex-1"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Late
                          </Button>
                          <Button
                            variant={student.status === 'excused' ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => updateAttendance(student.id, 'excused')}
                            className="flex-1"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Excused
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No students found in this class
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendance;