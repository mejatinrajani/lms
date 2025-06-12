import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData, AuthResponse } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  profile: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      setUser(null);
      setProfile(null);
      return;
    }
    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      if (user) {
        setUser(user);
        setProfile(user.profile || null);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setProfile(response.user.profile || null);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      setProfile(updatedUser.profile || null);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setUser(user);
        setProfile(user.profile || null);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Profile refresh failed:', error);
      throw error;
    }
  };

  // --- ADD THIS FUNCTION ---
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.register(data);
      setUser(response.user);
      setProfile(response.user.profile || null);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    refreshProfile,
    register, // <-- Add register to context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;