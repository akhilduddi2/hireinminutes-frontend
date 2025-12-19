"use client"

import { useEffect, useState, useRef } from 'react';
import { GraduationCap, TrendingUp, Target, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config/api';
import type { Student, CollegeProfile, NewStudent, MenuItem } from './types';
import { OverviewSection } from './OverviewSection';
import { StudentsSection } from './StudentsSection';
import { ProfileSection } from './ProfileSection';
import { CreateStudentModal } from './CreateStudentModal';
import { MagicNav } from './MagicNav';

interface CollegeDashboardLayoutProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string) => void;
  activeSection: string;
}

export const CollegeDashboardLayout: React.FC<CollegeDashboardLayoutProps> = ({ 
  onNavigate,
  activeSection 
}) => {
  const { user, signOut } = useAuth();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const navHideTimeoutRef = useRef<number | null>(null);
  const authCheckRef = useRef(false);
  const [profile, setProfile] = useState<CollegeProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<NewStudent>({
    fullName: '',
    email: '',
    password: ''
  });

  // Menu items with routes
  const menuItems: MenuItem[] = [
    { id: 'overview', icon: TrendingUp, label: 'Overview', count: null, path: '/college/overview' },
    { id: 'students', icon: Target, label: 'Students', count: students.length, path: '/college/students' },
    { id: 'profile', icon: User, label: 'Profile', count: null, path: '/college/profile' }
  ];

  useEffect(() => {
    // Check authentication and role - only run when auth state is determined
    if (!authCheckRef.current && !loading) {
      authCheckRef.current = true;

      if (!user) {
        onNavigate('college/login');
        return;
      }

      if (user.role !== 'college') {
        onNavigate('role-select');
        return;
      }
    }
  }, [user, onNavigate, loading]);

  useEffect(() => {
    fetchCollegeProfile();
    fetchStudents();
  }, []);

  // Handle navigation hide/show on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      if (scrollDifference > 10) {
        setIsNavVisible(false);
        if (navHideTimeoutRef.current) {
          clearTimeout(navHideTimeoutRef.current);
        }
        navHideTimeoutRef.current = window.setTimeout(() => {
          setIsNavVisible(true);
        }, 2000);
      } else if (scrollDifference < -10) {
        setIsNavVisible(true);
        if (navHideTimeoutRef.current) {
          clearTimeout(navHideTimeoutRef.current);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (navHideTimeoutRef.current) {
        clearTimeout(navHideTimeoutRef.current);
      }
    };
  }, []);

  const fetchCollegeProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        if (!authCheckRef.current) {
          authCheckRef.current = true;
          signOut();
          onNavigate('college-login');
        }
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/college/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        if (!authCheckRef.current) {
          authCheckRef.current = true;
          signOut();
        }
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        if (!authCheckRef.current) {
          authCheckRef.current = true;
          signOut();
          onNavigate('college-login');
        }
      }
    } catch (error) {
      console.error('Error fetching college profile:', error);
      if (!authCheckRef.current) {
        authCheckRef.current = true;
        signOut();
        onNavigate('college-login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${getApiUrl()}/api/college/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const studentData = {
        fullName: newStudent.fullName,
        email: newStudent.email,
        password: newStudent.password
      };

      const response = await fetch(`${getApiUrl()}/api/college/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentData)
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateStudent(false);
        setNewStudent({
          fullName: '',
          email: '',
          password: ''
        });
        fetchStudents();
      }
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleNavigateSection = (section: string) => {
    onNavigate('college', undefined, undefined, undefined, undefined, undefined, section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading college dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    const collegeName = user && 'name' in user ? (user as any).name : null;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {collegeName ? `${collegeName} Dashboard` : 'College Dashboard'}
          </h2>
          <p className="text-gray-600 mb-4">
            {collegeName
              ? `Welcome to ${collegeName}! Loading your college data...`
              : 'Unable to load college profile. Please try logging in again.'
            }
          </p>
          <div className="space-y-3">
            {!collegeName && (
              <>
                <Button onClick={() => { signOut(); onNavigate('landing'); }}>Go to Home Page</Button>
                <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
              </>
            )}
            {collegeName && (
              <>
                <Button onClick={() => window.location.reload()}>Reload Page</Button>
                <p className="text-sm text-gray-500">If this persists, please contact support.</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {profile?.name || (user && 'name' in user ? (user as any).name : 'College')}
                </h1>
                <p className="text-sm text-gray-600">College Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <Button variant="outline" size="sm" onClick={() => { signOut(); onNavigate('landing'); }}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render active section */}
        {(!activeSection || activeSection === 'overview') && (
          <OverviewSection
            profile={profile}
            students={students}
            user={user}
            onViewAllStudents={() => handleNavigateSection('students')}
          />
        )}

        {activeSection === 'students' && (
          <StudentsSection
            students={students}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddStudent={() => setShowCreateStudent(true)}
          />
        )}

        {activeSection === 'profile' && (
          <ProfileSection profile={profile} onProfileUpdate={fetchCollegeProfile} />
        )}
      </div>

      {/* Create Student Modal */}
      <CreateStudentModal
        isOpen={showCreateStudent}
        newStudent={newStudent}
        onClose={() => setShowCreateStudent(false)}
        onSubmit={handleCreateStudent}
        onChange={(data) => setNewStudent({ ...newStudent, ...data })}
      />

      {/* Magic Navigation Menu */}
      <MagicNav 
        menuItems={menuItems} 
        isVisible={isNavVisible} 
        activeSection={activeSection || 'overview'}
        onNavigate={handleNavigateSection}
      />
    </div>
  );
};

export default CollegeDashboardLayout;
