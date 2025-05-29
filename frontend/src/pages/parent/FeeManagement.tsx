
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FeeManagementComponent from '@/components/shared/FeeManagement';

const ParentFeeManagement: React.FC = () => {
  return (
    <DashboardLayout requiredRole="parent">
      <div className="space-y-6">
        <Link to="/parent" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <FeeManagementComponent userRole="parent" />
      </div>
    </DashboardLayout>
  );
};

export default ParentFeeManagement;
