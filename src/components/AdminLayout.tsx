import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Settings,
  BarChart3,
  Bell,
  Wrench,
} from 'lucide-react';

export function AdminLayout() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: t('admin.dashboard'),
      icon: LayoutDashboard,
      path: '/admin',
    },
    {
      title: t('admin.services'),
      icon: Wrench,
      path: '/admin/services',
    },
    {
      title: t('admin.bookings'),
      icon: Calendar,
      path: '/admin/bookings',
    },
    {
      title: t('admin.timeslots'),
      icon: Clock,
      path: '/admin/timeslots',
    },
    {
      title: t('admin.users'),
      icon: Users,
      path: '/admin/users',
    },
    {
      title: t('admin.notifications'),
      icon: Bell,
      path: '/admin/notifications',
    },
    {
      title: t('admin.statistics'),
      icon: BarChart3,
      path: '/admin/statistics',
    },
    {
      title: t('admin.settings'),
      icon: Settings,
      path: '/admin/settings',
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-80px)] w-full">
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
                          onClick={() => navigate(item.path)}
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
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
