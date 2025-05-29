
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HelpSupportComponent from '@/components/shared/HelpSupport';

const TeacherHelpSupport: React.FC = () => {
  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        <Link to="/teacher" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <HelpSupportComponent userRole="teacher" />
      </div>
    </DashboardLayout>
  );
};

export default TeacherHelpSupport;
