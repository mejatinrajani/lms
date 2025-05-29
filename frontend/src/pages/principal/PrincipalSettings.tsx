
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings, School, Bell, Shield, Clock } from 'lucide-react';

const PrincipalSettings: React.FC = () => {
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: 'Springfield High School',
    address: '123 Education Street, Springfield, IL',
    phone: '(555) 123-4567',
    email: 'info@springfieldhigh.edu',
    website: 'www.springfieldhigh.edu',
    academicYear: '2024-25'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    parentNotifications: true,
    teacherNotifications: true,
    attendanceAlerts: true,
    behaviorAlerts: true
  });

  const [systemSettings, setSystemSettings] = useState({
    allowLateSubmissions: true,
    requireParentApproval: false,
    enableBehaviorTracking: true,
    autoBackup: true,
    maintenanceMode: false
  });

  const [timeSettings, setTimeSettings] = useState({
    schoolStartTime: '08:00',
    schoolEndTime: '15:30',
    lunchStartTime: '12:00',
    lunchEndTime: '13:00',
    periodDuration: '45'
  });

  const handleSchoolSettingsChange = (field: string, value: string) => {
    setSchoolSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemToggle = (field: string, value: boolean) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (field: string, value: string) => {
    setTimeSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = () => {
    // Here you would typically save to your backend
    toast.success('Settings saved successfully!');
  };

  return (
    <DashboardLayout requiredRole="principal">
      <div className="space-y-6">
        <div>
          <Link to="/principal" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">School Settings</h1>
          <p className="text-muted-foreground">
            Manage your school's configuration and preferences
          </p>
        </div>

        <Tabs defaultValue="school" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="school">School Info</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="time">Schedule</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="h-5 w-5 mr-2" />
                  School Information
                </CardTitle>
                <CardDescription>
                  Update your school's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={schoolSettings.schoolName}
                      onChange={(e) => handleSchoolSettingsChange('schoolName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={schoolSettings.academicYear}
                      onChange={(e) => handleSchoolSettingsChange('academicYear', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={schoolSettings.address}
                    onChange={(e) => handleSchoolSettingsChange('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={schoolSettings.phone}
                      onChange={(e) => handleSchoolSettingsChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={schoolSettings.email}
                      onChange={(e) => handleSchoolSettingsChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={schoolSettings.website}
                      onChange={(e) => handleSchoolSettingsChange('website', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how notifications are sent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationToggle('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="parentNotifications">Parent Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications to parents</p>
                    </div>
                    <Switch
                      id="parentNotifications"
                      checked={notificationSettings.parentNotifications}
                      onCheckedChange={(checked) => handleNotificationToggle('parentNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="teacherNotifications">Teacher Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications to teachers</p>
                    </div>
                    <Switch
                      id="teacherNotifications"
                      checked={notificationSettings.teacherNotifications}
                      onCheckedChange={(checked) => handleNotificationToggle('teacherNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="attendanceAlerts">Attendance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert when attendance is low</p>
                    </div>
                    <Switch
                      id="attendanceAlerts"
                      checked={notificationSettings.attendanceAlerts}
                      onCheckedChange={(checked) => handleNotificationToggle('attendanceAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="behaviorAlerts">Behavior Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert for behavior incidents</p>
                    </div>
                    <Switch
                      id="behaviorAlerts"
                      checked={notificationSettings.behaviorAlerts}
                      onCheckedChange={(checked) => handleNotificationToggle('behaviorAlerts', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system behavior and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowLateSubmissions">Allow Late Submissions</Label>
                      <p className="text-sm text-muted-foreground">Allow students to submit assignments after deadline</p>
                    </div>
                    <Switch
                      id="allowLateSubmissions"
                      checked={systemSettings.allowLateSubmissions}
                      onCheckedChange={(checked) => handleSystemToggle('allowLateSubmissions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireParentApproval">Require Parent Approval</Label>
                      <p className="text-sm text-muted-foreground">Require parent approval for certain actions</p>
                    </div>
                    <Switch
                      id="requireParentApproval"
                      checked={systemSettings.requireParentApproval}
                      onCheckedChange={(checked) => handleSystemToggle('requireParentApproval', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableBehaviorTracking">Enable Behavior Tracking</Label>
                      <p className="text-sm text-muted-foreground">Track and log student behavior incidents</p>
                    </div>
                    <Switch
                      id="enableBehaviorTracking"
                      checked={systemSettings.enableBehaviorTracking}
                      onCheckedChange={(checked) => handleSystemToggle('enableBehaviorTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup">Automatic Backup</Label>
                      <p className="text-sm text-muted-foreground">Enable automatic daily backups</p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => handleSystemToggle('autoBackup', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable maintenance mode</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleSystemToggle('maintenanceMode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Schedule Settings
                </CardTitle>
                <CardDescription>
                  Configure school timing and schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolStartTime">School Start Time</Label>
                    <Input
                      id="schoolStartTime"
                      type="time"
                      value={timeSettings.schoolStartTime}
                      onChange={(e) => handleTimeChange('schoolStartTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolEndTime">School End Time</Label>
                    <Input
                      id="schoolEndTime"
                      type="time"
                      value={timeSettings.schoolEndTime}
                      onChange={(e) => handleTimeChange('schoolEndTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lunchStartTime">Lunch Start Time</Label>
                    <Input
                      id="lunchStartTime"
                      type="time"
                      value={timeSettings.lunchStartTime}
                      onChange={(e) => handleTimeChange('lunchStartTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lunchEndTime">Lunch End Time</Label>
                    <Input
                      id="lunchEndTime"
                      type="time"
                      value={timeSettings.lunchEndTime}
                      onChange={(e) => handleTimeChange('lunchEndTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodDuration">Period Duration (minutes)</Label>
                  <Input
                    id="periodDuration"
                    type="number"
                    value={timeSettings.periodDuration}
                    onChange={(e) => handleTimeChange('periodDuration', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span className="font-medium">Reset Password Policy</span>
                    <span className="text-xs text-muted-foreground">Update password requirements</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span className="font-medium">Session Timeout</span>
                    <span className="text-xs text-muted-foreground">Configure session duration</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span className="font-medium">Access Logs</span>
                    <span className="text-xs text-muted-foreground">View system access logs</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span className="font-medium">Data Backup</span>
                    <span className="text-xs text-muted-foreground">Manage data backups</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={saveSettings} size="lg">
            Save All Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrincipalSettings;
