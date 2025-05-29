
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Receipt,
  History
} from 'lucide-react';

interface FeeManagementProps {
  userRole: 'student' | 'parent' | 'teacher' | 'principal';
}

const FeeManagement: React.FC<FeeManagementProps> = ({ userRole }) => {
  const [fees] = useState([
    {
      id: 1,
      type: "Tuition Fee",
      amount: 1500,
      dueDate: "2025-06-15",
      status: "pending",
      term: "Summer 2025",
      description: "Quarterly tuition fee for regular classes"
    },
    {
      id: 2,
      type: "Laboratory Fee",
      amount: 200,
      dueDate: "2025-06-15",
      status: "paid",
      term: "Summer 2025",
      description: "Science laboratory usage and materials",
      paidDate: "2025-05-10"
    },
    {
      id: 3,
      type: "Sports Fee",
      amount: 150,
      dueDate: "2025-07-01",
      status: "pending",
      term: "Summer 2025",
      description: "Sports activities and equipment"
    },
    {
      id: 4,
      type: "Transport Fee",
      amount: 300,
      dueDate: "2025-05-30",
      status: "overdue",
      term: "Summer 2025",
      description: "School bus transportation service"
    }
  ]);

  const [registrations] = useState([
    {
      id: 1,
      event: "Annual Sports Day",
      fee: 50,
      deadline: "2025-06-01",
      status: "registered",
      registrationDate: "2025-05-15"
    },
    {
      id: 2,
      event: "Science Fair Competition",
      fee: 25,
      deadline: "2025-06-10",
      status: "pending",
      registrationDate: null
    },
    {
      id: 3,
      event: "Cultural Program",
      fee: 30,
      deadline: "2025-06-20",
      status: "pending",
      registrationDate: null
    }
  ]);

  const handlePayment = (feeId: number) => {
    // Payment logic would go here
    alert(`Payment initiated for fee ID: ${feeId}`);
  };

  const handleRegistration = (eventId: number) => {
    // Registration logic would go here
    alert(`Registration initiated for event ID: ${eventId}`);
  };

  const totalPending = fees.filter(fee => fee.status === 'pending' || fee.status === 'overdue')
                         .reduce((sum, fee) => sum + fee.amount, 0);

  const totalPaid = fees.filter(fee => fee.status === 'paid')
                       .reduce((sum, fee) => sum + fee.amount, 0);

  const isViewOnly = userRole === 'teacher' || userRole === 'principal';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
        <p className="text-muted-foreground">
          {isViewOnly ? 'View student fee status and registrations' : 'Manage your fees and event registrations'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold text-red-600">${totalPending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${totalPaid}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Fees</p>
                <p className="text-2xl font-bold text-orange-600">
                  {fees.filter(fee => fee.status === 'overdue').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Registrations</p>
                <p className="text-2xl font-bold">
                  {registrations.filter(reg => reg.status === 'registered').length}/{registrations.length}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fee Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Fee Payments
            </CardTitle>
            <CardDescription>
              {isViewOnly ? 'Student fee payment status' : 'Your fee payment status and dues'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fees.map(fee => (
                <div key={fee.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{fee.type}</h3>
                      <p className="text-sm text-muted-foreground">{fee.description}</p>
                      <p className="text-sm text-muted-foreground">Term: {fee.term}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${fee.amount}</p>
                      <Badge variant={
                        fee.status === 'paid' ? 'default' :
                        fee.status === 'overdue' ? 'destructive' : 'secondary'
                      }>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {new Date(fee.dueDate).toLocaleDateString()}
                      {fee.paidDate && (
                        <span className="ml-2">• Paid: {new Date(fee.paidDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    {!isViewOnly && fee.status !== 'paid' && (
                      <Button 
                        size="sm" 
                        onClick={() => handlePayment(fee.id)}
                        variant={fee.status === 'overdue' ? 'destructive' : 'default'}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>
                    )}
                    {fee.status === 'paid' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Event Registrations
            </CardTitle>
            <CardDescription>
              {isViewOnly ? 'Student event registration status' : 'Register for upcoming school events'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registrations.map(reg => (
                <div key={reg.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{reg.event}</h3>
                      <p className="text-sm text-muted-foreground">Registration Fee: ${reg.fee}</p>
                    </div>
                    <Badge variant={reg.status === 'registered' ? 'default' : 'outline'}>
                      {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Deadline: {new Date(reg.deadline).toLocaleDateString()}
                      </div>
                      {reg.registrationDate && (
                        <div className="flex items-center mt-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Registered: {new Date(reg.registrationDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {!isViewOnly && reg.status !== 'registered' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleRegistration(reg.id)}
                      >
                        Register Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History (for paid users) */}
      {!isViewOnly && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Payment History
            </CardTitle>
            <CardDescription>
              View your complete payment history and download receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Your payment history will appear here once you make payments
              </p>
              <Button variant="outline" className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                Download All Receipts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeeManagement;
