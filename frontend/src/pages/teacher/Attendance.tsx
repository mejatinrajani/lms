import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { attendanceAPI } from '@/services/apiService';

const TeacherAttendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Update the data fetching
  useEffect(() => {
    attendanceAPI.getAttendance()
      .then(data => {
        // Transform data to match your frontend expectations
        const transformedData = data.map((record: any) => ({
          id: record.id,
          class_name: record.class_name || record.class_session?.name,
          class_section: record.class_section || record.class_session?.section,
          subject_name: record.subject_name || record.subject?.name,
          date: record.date,
          present: record.status === 'present' ? 1 : 0,
          absent: record.status === 'absent' ? 1 : 0,
          late: record.status === 'late' ? 1 : 0,
          excused: record.status === 'excused' ? 1 : 0,
          totalStudents: 1 // Since each record is for one student
        }));
        setAttendanceRecords(transformedData);
      })
      .catch(error => {
        console.error('Error fetching attendance:', error);
        setAttendanceRecords([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getAttendancePercentage = (present: number, total: number) => {
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex justify-center items-center h-64">Loading...</div>
      </DashboardLayout>
    );
  }

  // Calculate summary stats
  const totalClasses = attendanceRecords.length;
  const totalStudents = attendanceRecords.reduce((sum, rec) => sum + (rec.totalStudents || 0), 0);
  const totalPresent = attendanceRecords.reduce((sum, rec) => sum + (rec.present || 0), 0);
  const avgAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Attendance Records</h1>
              <p className="text-muted-foreground">
                View and manage attendance for your classes
              </p>
            </div>
            <Button asChild>
              <Link to="/teacher/mark-attendance">
                <Users className="h-4 w-4 mr-2" />
                Mark Attendance
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Classes scheduled for today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAttendanceColor(avgAttendance)}`}>{avgAttendance}%</div>
              <p className="text-xs text-muted-foreground">
                Average across all classes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Students across all classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
            <CardDescription>
              View attendance records for your classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceRecords.length === 0 && (
                <div className="text-center text-muted-foreground">No attendance records found.</div>
              )}
              {attendanceRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{record.class_name || record.class || 'Class'}</h3>
                        <p className="text-sm text-muted-foreground">{record.subject_name || record.subject || ''}</p>
                      </div>
                      <Badge variant="outline">{record.date}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">{record.present}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">{record.absent}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{record.late}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Late</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getAttendanceColor(getAttendancePercentage(record.present, record.totalStudents))}`}>
                        {getAttendancePercentage(record.present, record.totalStudents)}%
                      </div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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

export default TeacherAttendance;
