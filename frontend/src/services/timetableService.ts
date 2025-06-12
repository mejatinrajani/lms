
import api  from './api';

export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_break: boolean;
  break_name: string;
  order: number;
}

export interface Timetable {
  id: number;
  class_assigned: number;
  subject: number;
  teacher: number;
  day_of_week: string;
  time_slot: number;
  room_number: string;
  is_active: boolean;
  created_at: string;
  subject_details?: any;
  teacher_details?: any;
  class_details?: any;
  time_slot_details?: TimeSlot;
}

export const timetableService = {
  // Time Slots
  getTimeSlots: () =>api.get<TimeSlot[]>('/timetable/time-slots/'),
  
  createTimeSlot: (data: Partial<TimeSlot>) => 
    api.post<TimeSlot>('/timetable/time-slots/', data),
  
  // Timetables
  getTimetables: () =>api.get<Timetable[]>('/timetable/timetables/'),
  
  getTimetableByClass: (classId: number, day?: string) => {
    const params = new URLSearchParams();
    params.append('class_id', classId.toString());
    if (day) params.append('day', day);
    return api.get<Timetable[]>(`/timetable/timetables/by_class/?${params}`);
  },
  
  getTimetableByTeacher: (teacherId: number, day?: string) => {
    const params = new URLSearchParams();
    params.append('teacher_id', teacherId.toString());
    if (day) params.append('day', day);
    return api.get<Timetable[]>(`/timetable/timetables/by_teacher/?${params}`);
  },
  
  createTimetable: (data: Partial<Timetable>) => 
    api.post<Timetable>('/timetable/timetables/', data),
  
  updateTimetable: (id: number, data: Partial<Timetable>) =>
    api.put<Timetable>(`/timetable/timetables/${id}/`, data),
  
  deleteTimetable: (id: number) =>api.delete(`/timetable/timetables/${id}/`),
  
  // Teacher Availability
  getTeacherAvailability: () =>api.get('/timetable/teacher-availability/'),
  
  updateTeacherAvailability: (data: any) =>
    api.post('/timetable/teacher-availability/', data),
};
