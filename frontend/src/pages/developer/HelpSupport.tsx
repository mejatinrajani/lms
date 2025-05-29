
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HelpSupportComponent from '@/components/shared/HelpSupport';

const DeveloperHelpSupport: React.FC = () => {
  return (
    <DashboardLayout requiredRole="developer">
      <div className="space-y-6">
        <Link to="/developer" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <HelpSupportComponent userRole="developer" />
      </div>
    </DashboardLayout>
  );
};

export default DeveloperHelpSupport;
