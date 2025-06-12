import api from './api';
import { Class, Section, Student } from './apiService';
import { attendanceAPI } from './api';

export interface AttendanceStatus {
  id: number;
  name: string;
  short_code: string;
  is_present: boolean;
  color_code: string;
}

export interface ClassAttendanceReport {
  class_id: number;
  section_id: number;
  date: string;
  students: {
    student_id: number;
    student_name: string;
    status_code: string;
    status: string;
    remarks: string;
  }[];
}

export interface BulkAttendanceData {
  student: number;
  status: number;
  remarks: string;
}

export interface AttendanceSummary {
  student_id: number;
  month: number;
  year: number;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
}

export const attendanceService = {
  getAttendanceStatuses: async (): Promise<AttendanceStatus[]> => {
    try {
      const response = await attendanceAPI.statuses.list();
      return response.data;
    } catch (error) {
      console.error('getAttendanceStatuses error:', error);
      throw error;
    }
  },

   getClassAttendance: async (classId: number, sectionId: number, date: string) => {
    const response = await api.get(`/attendance/class_report/`, {
      params: { class_id: classId, section_id: sectionId, date }
    });
    return response.data;
  },  

  getAttendanceSummary: async (studentId: number, month: number, year: number): Promise<AttendanceSummary> => {
    try {
      const response = await attendanceAPI.records.statistics(studentId, { month, year });
      return response.data;
    } catch (error) {
      console.error('getAttendanceSummary error:', error);
      throw error;
    }
  },

  bulkMarkAttendance: async (
    classId: number,
    sectionId: number,
    date: string,
    period: number,
    attendanceData: BulkAttendanceData[]
  ) => {
    const payload = {
      class_assigned: classId,
      section: sectionId,
      date,
      period,
      attendance_data: attendanceData
    };
    return api.post('/attendance/bulk_mark/', payload);
  }
};
  
export default attendanceService;