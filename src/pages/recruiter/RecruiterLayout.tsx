
import { useState, useEffect } from 'react';
import {
  Briefcase, Users, Building2, PlusCircle, UserCheck,
  LogOut, X, Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { RecruiterPageProps, Alert } from './types';
import { Button } from '../../components/ui/Button';

interface RecruiterLayoutProps extends RecruiterPageProps {
  children: React.ReactNode;
  activeSection: string;
}

export function RecruiterLayout({
  children,
  onNavigate,
  activeSection
}: RecruiterLayoutProps) {
  const { profile, signOut } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', icon: Briefcase, label: 'Overview', count: null },
    { id: 'jobs', icon: Briefcase, label: 'My Jobs', count: null },
    { id: 'applicants', icon: Users, label: 'Applicants', count: null },
    { id: 'find-candidates', icon: UserCheck, label: 'Find Candidates', count: null },
    { id: 'company', icon: Building2, label: 'Company Profile', count: null },
    { id: 'post-job', icon: PlusCircle, label: 'Post New Job', count: null },
  ];

  const handleSectionChange = (sectionId: string) => {
    onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, sectionId);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const fetchAlerts = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/admin/alerts/active`);
      if (response.ok) {
        const data = await response.json();
        const allAlerts = data.data || [];
        const recruiterAlerts = allAlerts.filter((alert: Alert) =>
          alert.showFor === 'recruiters' || alert.showFor === 'both'
        );
        if (recruiterAlerts.length > 0) {
          setAlerts(recruiterAlerts);
          setShowAlertsModal(true);
          setCurrentAlertIndex(0);
          sessionStorage.setItem('alertsShownRecruiter', 'true');
        }
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    const alertsShown = sessionStorage.getItem('alertsShownRecruiter');
    if (!alertsShown && profile) {
      fetchAlerts();
    }
  }, [profile]);

  // Determine current page title
  const currentTitle = menuItems.find(item => item.id === activeSection)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out shadow-xl flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Recruiter</h1>
              <p className="text-xs text-slate-400">Workspace</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                {item.label}
                {item.count !== null && item.count > 0 && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile?.fullName?.charAt(0) || 'R'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.fullName || 'Recruiter'}</p>
              <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-w-0">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 px-6 sm:px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl md:hidden transition-all"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Manage your hiring pipeline</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {profile?.role === 'admin' && (
                <Button
                  onClick={() => onNavigate('admin')}
                  variant="outline"
                  className="border-slate-200 text-slate-600 hover:text-slate-900 hidden sm:flex"
                >
                  Admin Panel
                </Button>
              )}
              <Button
                onClick={async () => {
                  try { 
                    await signOut(); 
                    onNavigate('landing');
                  }
                  catch (error) { 
                    console.error('Logout error:', error);
                    onNavigate('landing');
                  }
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all font-medium h-10 sm:h-auto px-3 sm:px-4"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>

      {/* Alerts Modal */}
      {showAlertsModal && alerts.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{alerts[currentAlertIndex].name}</h2>
                  <p className="text-purple-100 mt-1 opacity-90">Important System Announcement</p>
                </div>
                <button
                  onClick={() => setShowAlertsModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap mb-6">
                {alerts[currentAlertIndex].message}
              </p>

              {alerts[currentAlertIndex].images && alerts[currentAlertIndex].images!.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {alerts[currentAlertIndex].images!.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="rounded-xl w-full object-cover shadow-md" />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-8 py-5 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {alerts.map((_, idx) => (
                    <div key={idx} className={`h-2 rounded-full transition-all ${idx === currentAlertIndex ? 'w-8 bg-purple-600' : 'w-2 bg-slate-300'}`} />
                  ))}
                </div>

                <div className="flex gap-3">
                  {currentAlertIndex > 0 && (
                    <Button variant="outline" onClick={() => setCurrentAlertIndex(currentAlertIndex - 1)}>
                      Previous
                    </Button>
                  )}
                  {currentAlertIndex < alerts.length - 1 ? (
                    <Button onClick={() => setCurrentAlertIndex(currentAlertIndex + 1)} className="bg-purple-600 hover:bg-purple-700 text-white">
                      Next
                    </Button>
                  ) : (
                    <Button onClick={() => setShowAlertsModal(false)} className="bg-purple-600 hover:bg-purple-700 text-white">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
