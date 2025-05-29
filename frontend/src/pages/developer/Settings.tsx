import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon,
  Shield,
  Database,
  Server,
  Mail,
  Bell,
  Lock,
  Palette,
  Globe,
  TerminalSquare,
  ArrowLeft
} from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <DashboardLayout requiredRole="developer">
      <div className="space-y-6">
        <div>
          <Link to="/developer" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            <ArrowLeft className="h-4 w-4 inline mr-1" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">System Settings</h1>
              <p className="text-muted-foreground">
                Configure global system settings for the Learning Management System
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 shrink-0">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 w-full">
                <TabsTrigger value="general" className="justify-start w-full mb-1">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start w-full mb-1">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="database" className="justify-start w-full mb-1">
                  <Database className="h-4 w-4 mr-2" />
                  Database
                </TabsTrigger>
                <TabsTrigger value="integrations" className="justify-start w-full mb-1">
                  <Server className="h-4 w-4 mr-2" />
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full mb-1">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="mail" className="justify-start w-full mb-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Mail Server
                </TabsTrigger>
                <TabsTrigger value="appearance" className="justify-start w-full mb-1">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="localization" className="justify-start w-full mb-1">
                  <Globe className="h-4 w-4 mr-2" />
                  Localization
                </TabsTrigger>
                <TabsTrigger value="advanced" className="justify-start w-full">
                  <TerminalSquare className="h-4 w-4 mr-2" />
                  Advanced
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-2">System Information</h3>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="mb-1">
                    <span className="font-medium">Version:</span> 2.5.3
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Last Updated:</span> May 15, 2025
                  </div>
                  <div>
                    <span className="font-medium">Environment:</span> 
                    <Badge variant="outline" className="ml-2 bg-green-50">Production</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              {/* General Settings */}
              <TabsContent value="general" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Configure system-wide general settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="system-name">System Name</Label>
                        <Input id="system-name" defaultValue="LMS School Management System" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Administrator Email</Label>
                        <Input id="admin-email" defaultValue="admin@schoollms.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="site-url">Site URL</Label>
                      <Input id="site-url" defaultValue="https://schoollms.com" />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <Label htmlFor="academic-year">Current Academic Year</Label>
                      <Input id="academic-year" defaultValue="2024-2025" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="system-maintenance"
                        className="rounded border-gray-300"
                        defaultChecked={false}
                      />
                      <Label htmlFor="system-maintenance">Enable System Maintenance Mode</Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="mr-2">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Configure security and authentication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <select 
                        id="password-policy" 
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="standard">Standard (8 chars min)</option>
                        <option value="strong">Strong (10+ chars, special chars)</option>
                        <option value="custom">Custom Policy</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="two-factor"
                        className="rounded border-gray-300"
                        defaultChecked={true}
                      />
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication for Admin Accounts</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ip-restriction"
                        className="rounded border-gray-300"
                        defaultChecked={false}
                      />
                      <Label htmlFor="ip-restriction">Enable IP Address Restrictions</Label>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h3 className="font-medium mb-2">API Access Controls</h3>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="api-access"
                          className="rounded border-gray-300"
                          defaultChecked={true}
                        />
                        <Label htmlFor="api-access">Allow API Access</Label>
                      </div>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Key className="h-4 w-4 mr-1" /> Generate New API Key
                        </Button>
                        <Button variant="outline" size="sm">
                          View API Documentation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="mr-2">Cancel</Button>
                    <Button>Save Security Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Other tabs would be implemented similarly */}
              {/* For brevity, we'll just show a message for the other tabs */}
              <TabsContent value="database" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Settings</CardTitle>
                    <CardDescription>Configure database connections and maintenance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Database configuration settings would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Settings</CardTitle>
                    <CardDescription>Manage third-party integrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Integration settings would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure system notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Notification settings would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="mail" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Mail Server Settings</CardTitle>
                    <CardDescription>Configure email server settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Mail server settings would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize the system appearance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Appearance settings would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="localization" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Localization Settings</CardTitle>
                    <CardDescription>Configure language and regional settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Localization settings would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced" className="p-0 border-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>Configure advanced system settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Advanced settings would be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

function Key(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}
