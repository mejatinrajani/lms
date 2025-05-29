
import { apiService } from './apiService';

export interface Message {
  id: string;
  sender: number;
  recipients: number[];
  subject: string;
  content: string;
  message_type: string;
  priority: string;
  attachment?: File;
  is_urgent: boolean;
  sent_at: string;
  sender_details?: any;
  read_count: number;
}

export interface ChatRoom {
  id: number;
  name: string;
  room_type: string;
  members: number[];
  created_by: number;
  is_active: boolean;
  created_at: string;
  last_message?: any;
}

export interface ChatMessage {
  id: number;
  room: number;
  sender: number;
  content: string;
  attachment?: File;
  reply_to?: number;
  sent_at: string;
  sender_details?: any;
}

export interface ParentTeacherMeeting {
  id: number;
  teacher: number;
  parent: number;
  student: number;
  subject: string;
  description: string;
  scheduled_date: string;
  duration_minutes: number;
  meeting_link: string;
  meeting_room: string;
  status: string;
  notes: string;
}

export const communicationService = {
  // Messages
  getMessages: () => apiService.get<Message[]>('/communications/messages/'),
  
  sendMessage: (data: Partial<Message>) => 
    apiService.post<Message>('/communications/messages/', data),
  
  markAsRead: (messageId: string) =>
    apiService.post(`/communications/messages/${messageId}/mark_as_read/`),
  
  getUnreadMessages: () => apiService.get<Message[]>('/communications/messages/unread/'),
  
  // Chat Rooms
  getChatRooms: () => apiService.get<ChatRoom[]>('/communications/chat-rooms/'),
  
  createChatRoom: (data: Partial<ChatRoom>) =>
    apiService.post<ChatRoom>('/communications/chat-rooms/', data),
  
  // Chat Messages
  getChatMessages: (roomId: number) => 
    apiService.get<ChatMessage[]>(`/communications/chat-messages/?room_id=${roomId}`),
  
  sendChatMessage: (data: Partial<ChatMessage>) =>
    apiService.post<ChatMessage>('/communications/chat-messages/', data),
  
  // Parent-Teacher Meetings
  getMeetings: () => apiService.get<ParentTeacherMeeting[]>('/communications/meetings/'),
  
  scheduleMeeting: (data: Partial<ParentTeacherMeeting>) =>
    apiService.post<ParentTeacherMeeting>('/communications/meetings/', data),
  
  updateMeeting: (id: number, data: Partial<ParentTeacherMeeting>) =>
    apiService.put<ParentTeacherMeeting>(`/communications/meetings/${id}/`, data),
};
