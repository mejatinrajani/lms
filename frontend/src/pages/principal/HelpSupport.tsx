
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HelpSupportComponent from '@/components/shared/HelpSupport';

const PrincipalHelpSupport: React.FC = () => {
  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <HelpSupportComponent userRole="principal" />
      </div>
    </DashboardLayout>
  );
};

export default PrincipalHelpSupport;
