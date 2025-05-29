import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Case-insensitive role check
  if (
    requiredRole &&
    user.role &&
    !(
      Array.isArray(requiredRole)
        ? requiredRole.map(r => r.toLowerCase()).includes(user.role.toLowerCase())
        : user.role.toLowerCase() === requiredRole.toLowerCase()
    )
  ) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  // Render sidebar, header, and main content
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
