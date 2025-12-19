import { useState, useEffect, useRef } from 'react';
import { Briefcase, Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
  currentPage?: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Robust Hide/Show Logic
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling Down & Not at top -> Hide
        setIsVisible(false);
      } else {
        // Scrolling Up or at top -> Show
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('landing');
    } catch (error) {
      console.error('Logout error:', error);
      onNavigate('landing');
    }
  };

  return (
    <>
      <header
        className={`fixed z-50 transition-all duration-300 left-4 right-4 md:left-8 md:right-8 ${isVisible ? 'top-4 translate-y-0' : '-translate-y-[150%] top-0'} 
        `}
      >
        <div className={`max-w-7xl mx-auto rounded-full transition-all duration-300 border border-white/10 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg py-2' : 'bg-slate-950/80 backdrop-blur-sm py-3'}`}>
          <div className="px-6 flex justify-between items-center">

            {/* Mobile Menu Button - Moved to Left as per screenshot */}
            <div className="md:hidden">
              <button
                className="p-2 text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo - Center on Mobile if needed, Left on Desktop */}
            <div
              className="flex items-center space-x-2 cursor-pointer md:flex-grow-0 flex-grow justify-center md:justify-start"
              onClick={() => onNavigate(user ? (profile?.role === 'employer' ? 'recruiter-dashboard' : 'job-seeker-dashboard') : 'landing')}
            >
              <Briefcase className="h-6 w-6 text-white" strokeWidth={2} />
              <span className="text-lg font-bold text-white">hireinminutes</span>
            </div>

            {/* Desktop Nav */}
            {!user && (
              <nav className="hidden md:flex items-center space-x-6">
                {['Home', 'For Candidates', 'For Recruiters', 'FAQ'].map((item) => (
                  <button
                    key={item}
                    onClick={() => onNavigate(item === 'Home' ? 'landing' : item.toLowerCase().replace(' ', '-'))}
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </nav>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <div className="hidden md:flex">
                  <Button onClick={() => onNavigate('role-select')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6" size="sm">
                    Get Started
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center">
                  {/* User Menu Logic (Simplified for brevity in this replace) */}
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-sm font-medium text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {profile?.fullName?.charAt(0) || 'U'}
                      </div>
                    </button>
                    {showUserMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 overflow-hidden">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-2 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Mobile Action (Get Started) - Visible on mobile if needed or just menu */}
              {!user && (
                <div className="md:hidden">
                  <Button onClick={() => onNavigate('role-select')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-xs" size="sm">
                    Get Started
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl pt-24 px-6 md:hidden">
          <nav className="flex flex-col space-y-6">
            {/* Mobile Nav Items */}
            {!user ? (
              <>
                <button onClick={() => { onNavigate('landing'); setMobileMenuOpen(false) }} className="text-xl font-medium text-white">Home</button>
                <button onClick={() => { onNavigate('for-candidates'); setMobileMenuOpen(false) }} className="text-xl font-medium text-white">For Candidates</button>
                <button onClick={() => { onNavigate('for-recruiters'); setMobileMenuOpen(false) }} className="text-xl font-medium text-white">For Recruiters</button>
              </>
            ) : (
              <button onClick={handleSignOut} className="text-xl font-medium text-red-400">Sign Out</button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}