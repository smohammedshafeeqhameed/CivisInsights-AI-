'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Database,
  Users as UsersIcon,
  User as UserIcon,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SealOfMaharashtra } from '@/components/icons';
import { Header } from '@/components/dashboard/header';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { SearchProvider } from '@/hooks/use-search';
import { Chatbot } from '@/components/dashboard/chatbot';
import { Footer } from '@/components/footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        // Not logged in, redirect to official login
        router.replace('/login');
      } else if (profile && profile.role !== 'admin') {
        // Logged in, but not an admin, redirect to public homepage
        router.replace('/');
      }
    }
  }, [user, profile, isUserLoading, router]);

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
      // The user state will change, and the effect above will redirect to login.
    }
  };

  // While loading or if user is not an admin, show a loading spinner.
  // This prevents a flash of the dashboard content before redirection.
  if (isUserLoading || !user || !profile || profile.role !== 'admin') {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SearchProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <SealOfMaharashtra className="size-8 text-primary" />
              <h1 className="text-lg font-semibold text-sidebar-foreground">
                CivisInsights
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard'}
                  tooltip={{ children: 'Dashboard' }}
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/data-hub'}
                  tooltip={{ children: 'Data Hub' }}
                >
                  <Link href="/dashboard/data-hub">
                    <Database />
                    Data Hub
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/reports'}
                  tooltip={{ children: 'Reports' }}
                >
                  <Link href="/dashboard/reports">
                    <FileText />
                    Reports
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/analytics'}
                  tooltip={{ children: 'Analytics' }}
                >
                  <Link href="/dashboard/analytics">
                    <BarChart3 />
                    Analytics
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
                 <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/users'}
                  tooltip={{ children: 'Users' }}
                >
                  <Link href="/dashboard/users">
                    <UsersIcon />
                    Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/profile'}
                  tooltip={{ children: 'Profile' }}
                >
                  <Link href="/dashboard/profile">
                    <UserIcon />
                    Profile
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/settings'}
                  tooltip={{ children: 'Settings' }}
                >
                  <Link href="/dashboard/settings">
                    <Settings />
                    Settings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  tooltip={{ children: 'Log Out' }}
                >
                  <LogOut />
                  Log Out
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="relative flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
              <Chatbot />
              <Footer />
            </div>
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  );
}
