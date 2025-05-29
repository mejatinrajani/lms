
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';

// Map roles to their colors for the badge
const roleColors: Record<UserRole, string> = {
  developer: 'bg-developer/10 text-developer border-developer',
  principal: 'bg-principal/10 text-principal border-principal',
  teacher: 'bg-teacher/10 text-teacher border-teacher',
  student: 'bg-student/10 text-student border-student',
  parent: 'bg-parent/10 text-parent border-parent'
};

// Map roles to their display names
const roleNames: Record<UserRole, string> = {
  developer: 'Developer',
  principal: 'Principal',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent'
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notificationsCount] = useState(3); // Mock notification count, would come from API

  if (!user) return null;

  return (
    <motion.header 
      className="bg-white dark:bg-gray-900 border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl font-semibold mb-0">School LMS</h1>
          <Badge className={roleColors[user.role]}>
            {roleNames[user.role]}
          </Badge>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative rounded-full">
              <Bell className="h-4 w-4" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notificationsCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <div className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors mb-1">
                <div className="font-medium">New assignment posted</div>
                <div className="text-sm text-muted-foreground">Mathematics: Algebra Problems</div>
                <div className="text-xs text-muted-foreground mt-1">10 minutes ago</div>
              </div>
              <div className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors mb-1">
                <div className="font-medium">Notice from principal</div>
                <div className="text-sm text-muted-foreground">Important: Mid-Term Exam Schedule</div>
                <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
              </div>
              <div className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                <div className="font-medium">Attendance marked</div>
                <div className="text-sm text-muted-foreground">You were marked present for today</div>
                <div className="text-xs text-muted-foreground mt-1">3 hours ago</div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer justify-center font-medium text-primary">
              <Link to="#">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center space-x-2 h-auto p-1">
              <Avatar className="h-9 w-9 border-2 border-primary/20 transition-all hover:border-primary/50">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-primary/10">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{user.firstName} {user.lastName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>My Account</span>
                <Badge className={`w-fit mt-1 ${roleColors[user.role]}`}>
                  {roleNames[user.role]}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;
