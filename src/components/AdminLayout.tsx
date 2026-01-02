import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/useAuth';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Settings,
  Bell,
  Car,
  Package,
  PlusCircle,
  Truck,
  User,
  LogOut,
  Home,
  UserCircle,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    title: 'Bookings',
    icon: Calendar,
    path: '/admin/bookings',
  },
  {
    title: 'Vehicle Types',
    icon: Car,
    path: '/admin/vehicle-types',
  },
  {
    title: 'Packages',
    icon: Package,
    path: '/admin/packages',
  },
  {
    title: 'Add-ons',
    icon: PlusCircle,
    path: '/admin/add-ons',
  },
  {
    title: 'Delivery Types',
    icon: Truck,
    path: '/admin/delivery-types',
  },
  {
    title: 'Time Slots',
    icon: Clock,
    path: '/admin/timeslots',
  },
  {
    title: 'Notifications',
    icon: Bell,
    path: '/admin/notifications',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/admin/settings',
  },
  {
    title: 'Profile',
    icon: UserCircle,
    path: '/admin/profile',
  },
];

function AdminLayoutContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  const { user, logout } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        onClick={() => handleNavigate(item.path)}
                        isActive={isActive}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex md:hidden items-center gap-2">
            <SidebarTrigger />
            <span className="font-semibold">Admin Panel</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  {user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <Home className="w-4 h-4 mr-2" />
                  Back to Site
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
}
