import { useEffect, useState, useCallback } from 'react';
import {
  Briefcase, Heart, FileText, User, TrendingUp,
  Search, Bell, Settings, Menu, X
} from 'lucide-react';
import { useAuth, getAuthHeaders } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config/api';
import { NotificationItem, JobSeekerPageProps } from './types';

interface JobSeekerLayoutProps extends JobSeekerPageProps {
  children: React.ReactNode;
  activeSection: string;
}

import { Skeleton } from '../../components/ui/Skeleton';
import { AdBanner } from '../../components/ads/AdBanner';

export function JobSeekerLayout({ children, onNavigate, activeSection }: JobSeekerLayoutProps) {
  const { profile, loading } = useAuth();
  // Handle Sidebar Toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (!profile) return;
    try {
      const response = await fetch(getApiUrl('/api/auth/notifications'), {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        const mappedNotifications = (data.data || []).map((n: any) => ({
          id: n._id,
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
          created_at: n.createdAt,
          data: n.data
        }));
        setNotifications(mappedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, [profile]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Skeleton Sidebar */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex-col">
          <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <Skeleton className="w-8 h-8 rounded-lg bg-slate-800" />
            <Skeleton className="w-32 h-6 ml-3 bg-slate-800" />
          </div>
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-10 w-full rounded-lg bg-slate-800" />)}
          </div>
          <div className="mt-auto p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="w-24 h-3 bg-slate-800" />
                <Skeleton className="w-32 h-3 bg-slate-800" />
              </div>
            </div>
          </div>
        </aside>
        <div className="flex-1 lg:ml-64 flex flex-col">
          <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6 sticky top-0 z-30 justify-between">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </header>
          <main className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <Skeleton className="w-full h-48 rounded-[32px]" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', icon: TrendingUp, label: 'Overview', count: null },
    { id: 'browse', icon: Search, label: 'Find Jobs', count: null },
    { id: 'applications', icon: FileText, label: 'Applications', count: null },
    { id: 'saved', icon: Heart, label: 'Saved Jobs', count: null },
    { id: 'notifications', icon: Bell, label: 'Notifications', count: notifications.filter(n => !n.read).length },
    { id: 'profile', icon: User, label: 'My Profile', count: null },
    { id: 'settings', icon: Settings, label: 'Settings', count: null },
  ];

  const handleSectionChange = (sectionId: string) => {
    localStorage.setItem('jobSeekerActiveSection', sectionId);
    const sectionPath = sectionId === 'overview' ? '' : `/${sectionId}`;
    window.history.pushState({}, '', `/job-seeker-dashboard${sectionPath}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, sectionId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  return (

    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out shadow-xl flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">hireinminutes</h1>
              <p className="text-xs text-slate-400">Job Seeker Portal</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                    ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && item.count > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-4 px-3">
            <AdBanner position="sidebar" />
          </div>
        </nav>

        {/* User User Profile (Footer) */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
              {profile.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{profile.fullName || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{profile.email}</p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" onClick={() => handleSectionChange('settings')} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition-all"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 capitalize">
              {activeSection.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <AdBanner position="home-banner" className="mb-6" />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default JobSeekerLayout;
