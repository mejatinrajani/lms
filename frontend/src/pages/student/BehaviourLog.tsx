
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BehaviourLogComponent from '@/components/shared/BehaviourLog';

const StudentBehaviourLog: React.FC = () => {
  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <Link to="/student" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <BehaviourLogComponent canAdd={false} studentView={true} />
      </div>
    </DashboardLayout>
  );
};

export default StudentBehaviourLog;
