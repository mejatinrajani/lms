
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BehaviourLogComponent from '@/components/shared/BehaviourLog';

const PrincipalBehaviourLog: React.FC = () => {
  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <BehaviourLogComponent canAdd={true} studentView={false} />
      </div>
    </DashboardLayout>
  );
};

export default PrincipalBehaviourLog;
