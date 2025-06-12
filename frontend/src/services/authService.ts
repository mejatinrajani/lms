import { AxiosError } from 'axios';
import api, { authAPI } from '@/services/api';
import axios from 'axios';


export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  role: string;
  first_name: string;
  last_name: string;
  school_id?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  profile?: any;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

class AuthService {
  async login(credentials:LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authAPI.register(userData);
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }

  async logout(): Promise<void> {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string, newPasswordConfirm: string): Promise<void> {
    try {
      await api.post('/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      });
    } catch (error: any) {
      console.error('Password change error:', error);
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getUserRole(): string | null {
    const user = this.getStoredUser();
    return user?.role || null;
  }
}

export default new AuthService();