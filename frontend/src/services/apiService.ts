import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });

          const newToken = response.data.access;
          localStorage.setItem('access_token', newToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    // Log error for debugging
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('Network Error - No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Authentication APIs
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    return response.json();
  },

  getProfile: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/auth/profile/`);
  },
};

// Academic APIs
export const academicAPI = {
  getClasses: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/classes/`);
  },

  createClass: async (classData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/classes/`, {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  getSubjects: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/subjects/`);
  },

  createSubject: async (subjectData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/subjects/`, {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  },

  getMarks: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/marks/`);
  },

  uploadMarks: async (marksData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/marks/`, {
      method: 'POST',
      body: JSON.stringify(marksData),
    });
  },

  // NEW: Fetch students for a class
  getStudents: async (classId: number) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/students/${classId}/`);
  },

  createExam: async (examData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/exams/`, {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },
  uploadMark: async (gradeData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/academic/grades/`, {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  },
};

// Attendance APIs
export const attendanceAPI = {
  getAttendance: async (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    const response = await apiClient.get(`/attendance/${queryParams}`);
    return response.data;
  },

  markAttendance: async (attendanceData: any) => {
    const response = await apiClient.post('/attendance/', attendanceData);
    return response.data;
  },

  bulkMarkAttendance: async (attendanceData: any) => {
    const response = await apiClient.post('/attendance/bulk_mark/', attendanceData);
    return response.data;
  },

  getAttendanceStats: async (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    const response = await apiClient.get(`/attendance/statistics/${queryParams}`);
    return response.data;
  },

  getClassReport: async (classId: string, date?: string) => {
    const queryParams = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/attendance/class-report/${classId}/${queryParams}`);
    return response.data;
  },

  getSummary: async (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    const response = await apiClient.get(`/attendance/summary/${queryParams}`);
    return response.data;
  },
};




// Assignments APIs
export const assignmentsAPI = {
  getAssignments: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/assignments/assignments/`);
  },

  createAssignment: async (assignmentData: any) => {
    const formData = new FormData();
    Object.keys(assignmentData).forEach(key => {
      if (assignmentData[key] instanceof File) {
        formData.append(key, assignmentData[key]);
      } else {
        formData.append(key, assignmentData[key]);
      }
    });

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/assignments/assignments/`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return response.json();
  },

  submitAssignment: async (assignmentId: string, submissionData: any) => {
    const formData = new FormData();
    Object.keys(submissionData).forEach(key => {
      if (submissionData[key] instanceof File) {
        formData.append(key, submissionData[key]);
      } else {
        formData.append(key, submissionData[key]);
      }
    });

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/assignments/assignments/${assignmentId}/submit/`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return response.json();
  },

  getSubmissions: async (assignmentId: string) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/assignments/assignments/${assignmentId}/submissions/`);
  },

  gradeSubmission: async (submissionId: string, gradeData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/assignments/submissions/${submissionId}/grade/`, {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  },
};

// Resources APIs
export const resourcesAPI = {
  getResources: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/resources/study-resources/`);
  },

  uploadResource: async (resourceData: any) => {
    const formData = new FormData();
    Object.keys(resourceData).forEach(key => {
      if (resourceData[key] instanceof File) {
        formData.append(key, resourceData[key]);
      } else {
        formData.append(key, resourceData[key]);
      }
    });

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/resources/study-resources/`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return response.json();
  },

  downloadResource: async (resourceId: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/resources/study-resources/${resourceId}/download/`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.blob();
  },
};

// Fees APIs
export const feesAPI = {
  getFeeStructures: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/fees/structures/`);
  },

  getFeePayments: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/fees/payments/`);
  },

  createFeePayment: async (paymentData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/fees/payments/`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

// Notices APIs
export const noticesAPI = {
  getNotices: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/notices/notices/`);
  },

  createNotice: async (noticeData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/notices/notices/`, {
      method: 'POST',
      body: JSON.stringify(noticeData),
    });
  },

  markNoticeAsRead: async (noticeId: string) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/notices/notices/${noticeId}/mark_read/`, {
      method: 'POST',
    });
  },
};

// Behavior APIs
export const behaviorAPI = {
  getBehaviorLogs: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/behavior/logs/`);
  },

  createBehaviorLog: async (logData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/behavior/logs/`, {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  },
};

// Timetable APIs
export const timetableAPI = {
  getTimetables: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/timetable/timetables/`);
  },

  createTimetable: async (timetableData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/timetable/timetables/`, {
      method: 'POST',
      body: JSON.stringify(timetableData),
    });
  },

  getTimeSlots: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/timetable/time-slots/`);
  },

  getTeacherAvailability: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/timetable/teacher-availability/`);
  },
};

// Communications APIs
export const communicationsAPI = {
  getMessages: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/communications/messages/`);
  },

  sendMessage: async (messageData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/communications/messages/`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getMeetings: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/communications/meetings/`);
  },

  scheduleMeeting: async (meetingData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/communications/meetings/`, {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  },

  getChatRooms: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/communications/chat-rooms/`);
  },

  getChatMessages: async (roomId: string) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/communications/chat-messages/?room=${roomId}`);
  },
};

// Payments APIs
export const paymentsAPI = {
  getPaymentPlans: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/payments/payment-plans/`);
  },

  getTransactions: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/payments/transactions/`);
  },

  initiatePayment: async (paymentData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/payments/transactions/initiate_payment/`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  verifyPayment: async (transactionId: string, verificationData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/payments/transactions/${transactionId}/verify_payment/`, {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  },
};

// Users APIs
export const usersAPI = {
  getUsers: async (role?: string) => {
    const queryParams = role ? `?role=${role}` : '';
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/users/${queryParams}`);
  },

  createUser: async (userData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/users/`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (userId: string, userData: any) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/users/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId: string) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/users/${userId}/`, {
      method: 'DELETE',
    });
  },

  getStudents: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/students/`);
  },

  getTeachers: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/teachers/`);
  },

  getParents: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/parents/`);
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboardStats: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/dashboard/stats/`);
  },

  getRecentActivities: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/core/dashboard/recent-activities/`);
  },
};

export default {
  auth: authAPI,
  academic: academicAPI,
  attendance: attendanceAPI,
  assignments: assignmentsAPI,
  resources: resourcesAPI,
  fees: feesAPI,
  notices: noticesAPI,
  behavior: behaviorAPI,
  timetable: timetableAPI,
  communications: communicationsAPI,
  payments: paymentsAPI,
  users: usersAPI,
  dashboard: dashboardAPI,
};