
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FeeManagementComponent from '@/components/shared/FeeManagement';

const StudentFeeManagement: React.FC = () => {
  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <Link to="/student" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <FeeManagementComponent userRole="student" />
      </div>
    </DashboardLayout>
  );
};

export default StudentFeeManagement;
