
export type UserRole = 'developer' | 'principal' | 'teacher' | 'student' | 'parent';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface School {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  principal?: User;
}

export interface Class {
  id: number;
  name: string;
  school: School;
  teachers: User[];
  students: User[];
}

export interface Section {
  id: number;
  name: string;
  class: Class;
  teacher: User;
  students: User[];
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface Attendance {
  id: number;
  student: User;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  section: Section;
  submittedBy: User;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: User;
  targetAudience: 'all' | 'teachers' | 'students' | 'parents';
  targetClasses?: number[];
  targetSections?: number[];
  isImportant: boolean;
}

export interface Dashboard {
  attendanceSummary?: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  recentNotices: Notice[];
  upcomingEvents?: any[];
  quickStats?: {
    [key: string]: {
      label: string;
      value: number | string;
      icon?: string;
      change?: number;
    }
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: any) => Promise<any>;
  error: string | null;
}

export type SidebarItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
  submenu?: SidebarItem[];
};
