import { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import CardNav, { CardNavItem } from './components/ui/CardNav';
import { FullScreenModalAd } from './components/ads/FullScreenModalAd';
import { LandingPage } from './pages/LandingPage';
import { RoleSelectPage } from './pages/RoleSelectPage';
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminRegisterPage } from './pages/AdminRegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { JobsPage } from './pages/JobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PostJobPage } from './pages/PostJobPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ApplicantsPage } from './pages/ApplicantsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { ForCandidatesPage } from './pages/ForCandidatesPage';
import { ForRecruitersPage } from './pages/ForRecruitersPage';
import { RecruiterOnboardingPage } from './pages/RecruiterOnboardingPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { PublicCandidateProfile } from './pages/PublicCandidateProfile';
import { TermsPrivacyPage } from './pages/TermsPrivacyPage';

import { PassportPage } from './pages/jobseeker/PassportPage';
import { VerifyTwoFactorPage } from './pages/VerifyTwoFactorPage';

// Import separated Job Seeker Dashboard pages
import {
  JobSeekerLayout,
  JobSeekerOverview,
  JobSeekerBrowseJobs,

  JobSeekerApplications,
  JobSeekerSavedJobs,
  JobSeekerNotifications,
  JobSeekerProfile,
  JobSeekerSettings,
} from './pages/jobseeker';

// Import separated Recruiter Dashboard pages
import {
  RecruiterLayout,
  RecruiterOverview,
  RecruiterJobs,
  RecruiterApplicants,
  RecruiterFindCandidates,
  RecruiterCompany,
  RecruiterPostJob,
  Job,
  Application,
  Candidate,
  PostInternshipPage
} from './pages/recruiter';

import CollegeDashboardLayout from './pages/college/CollegeDashboardLayout';
import CollegeRegisterPage from './pages/CollegeRegisterPage';
import CollegeLoginPage from './pages/CollegeLoginPage';

type PageState = {
  page: string;
  role?: 'job_seeker' | 'employer' | 'admin';
  authMode?: 'signin' | 'signup';
  jobId?: string;
  courseId?: string;
  successMessage?: string;
  profileSlug?: string;
  dashboardSection?: string;
};

// ... helper definitions ...

const navItems: CardNavItem[] = [
  {
    label: "Find Work",
    bgColor: "#0f172a", // Slate 900
    textColor: "#fff",
    links: [
      { label: "Browse Jobs", href: "jobs", ariaLabel: "Browse all jobs" },
      { label: "Skill Passport", href: "passport", ariaLabel: "View Digital Hiring Identity" },
      { label: "For Candidates", href: "for-candidates", ariaLabel: "Information for candidates" },
      { label: "Dashboard", href: "job-seeker-dashboard", ariaLabel: "Candidate Dashboard" }
    ]
  },
  {
    label: "For Recruiters",
    bgColor: "#172554", // Blue 950
    textColor: "#fff",
    links: [
      { label: "Post a Job", href: "post-job", ariaLabel: "Post a new job" },
      { label: "Hiring Solutions", href: "for-recruiters", ariaLabel: "Recruiter solutions" },
      { label: "Dashboard", href: "recruiter-dashboard", ariaLabel: "Recruiter Dashboard" }
    ]
  },
  {
    label: "Company",
    bgColor: "#312e81", // Indigo 900
    textColor: "#fff",
    links: [
      { label: "About Us", href: "about", ariaLabel: "About the company" },
      { label: "Contact", href: "contact", ariaLabel: "Contact us" },
      { label: "FAQ", href: "faq", ariaLabel: "Frequently Asked Questions" }
    ]
  }
];

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// RecruiterDashboardRouter component for handling recruiter dashboard sections
function RecruiterDashboardRouter({
  onNavigate,
  activeSection
}: {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
  activeSection: string;
}) {
  const { profile } = useAuth();
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const loadMyJobs = useCallback(async (full = true) => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const API_URL = import.meta.env.VITE_API_URL;
      const query = full ? '' : '?limit=5&status=active'; // Fetch only 5 active jobs for overview
      const response = await fetch(`${API_URL}/api/jobs/my-jobs${query}`, {
        headers,
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setMyJobs(result.data || []);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  }, []);

  const loadApplications = useCallback(async (full = true) => {
    try {
      setLoadingApplications(true);
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const API_URL = import.meta.env.VITE_API_URL;
      const query = full ? '' : '?limit=5'; // Fetch only 5 recent applications for overview
      const response = await fetch(`${API_URL}/api/applications/recruiter/all${query}`, {
        headers,
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setApplications(result.data || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;
      const API_URL = import.meta.env.VITE_API_URL;

      const [jobStatsRes, appStatsRes] = await Promise.all([
        fetch(`${API_URL}/api/jobs/stats/recruiter`, { headers }),
        fetch(`${API_URL}/api/applications/stats/recruiter`, { headers })
      ]);

      const jobStats = jobStatsRes.ok ? await jobStatsRes.json() : { data: {} };
      const appStats = appStatsRes.ok ? await appStatsRes.json() : { data: {} };

      if (jobStats.success && appStats.success) {
        setStats({
          activeJobs: jobStats.data.activeJobs || 0,
          totalJobs: jobStats.data.totalJobs || 0,
          closedJobs: jobStats.data.closedJobs || 0,
          totalViews: jobStats.data.totalViews || 0,
          totalApplications: appStats.data.total || 0,
          pendingApplications: appStats.data.pending || 0,
          shortlistedApplications: appStats.data.shortlisted || 0,
          rejectedApplications: appStats.data.rejected || 0,
          hiredApplications: appStats.data.accepted || 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const loadCandidates = useCallback(async () => {
    try {
      setLoadingCandidates(true);
      const headers = getAuthHeaders();

      // Use config API_URL instead of hardcoded localhost
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/verified-candidates`, {
        headers
      });

      if (response.ok) {
        const result = await response.json();
        setCandidates(result.data || []);
      }
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoadingCandidates(false);
    }
  }, []);

  useEffect(() => {
    // Lazy loading strategy
    if (!activeSection || activeSection === 'overview') {
      loadStats();
      loadMyJobs(false); // Partial load
      loadApplications(false); // Partial load
    } else if (activeSection === 'jobs') {
      loadMyJobs(true); // Full load
    } else if (activeSection === 'applicants') {
      loadApplications(true); // Full load
    } else if (activeSection === 'find-candidates') {
      loadCandidates();
    }
  }, [activeSection, loadMyJobs, loadApplications, loadStats, loadCandidates]);

  const handleJobPosted = () => {
    loadMyJobs(true); // Refresh all jobs
    onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, 'overview');
  };

  const handleNavigateToOnboarding = () => {
    window.history.pushState({ page: 'recruiter-onboarding' }, '', '/recruiter-onboarding');
    onNavigate('recruiter-onboarding');
  };

  return (
    <RecruiterLayout
      onNavigate={onNavigate}
      activeSection={activeSection}
    >
      {(!activeSection || activeSection === 'overview') && (
        <RecruiterOverview
          onNavigate={onNavigate}
          myJobs={myJobs}
          applications={applications}
          stats={stats}
        />
      )}
      {activeSection === 'jobs' && (
        <RecruiterJobs
          onNavigate={onNavigate}
          myJobs={myJobs}
          onPostJob={() => onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, 'post-job')}
        />
      )}
      {activeSection === 'applicants' && (
        <RecruiterApplicants
          onNavigate={onNavigate}
          applications={applications}
          loadingApplications={loadingApplications}
          onRefreshApplications={() => loadApplications(true)}
        />
      )}
      {activeSection === 'find-candidates' && (
        <RecruiterFindCandidates
          onNavigate={onNavigate}
          candidates={candidates}
          loadingCandidates={loadingCandidates}
        />
      )}
      {activeSection === 'company' && (
        <RecruiterCompany
          onNavigate={onNavigate}
          profile={profile}
          onNavigateToOnboarding={handleNavigateToOnboarding}
        />
      )}
      {activeSection === 'post-job' && (
        <RecruiterPostJob
          onNavigate={onNavigate}
          onJobPosted={handleJobPosted}
          onCancel={() => onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, 'overview')}
        />
      )}
    </RecruiterLayout>
  );
}

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [pageState, setPageState] = useState<PageState>(() => {
    // Load page from URL or localStorage
    const path = window.location.pathname.slice(1);
    let page = 'landing';
    let jobId: string | undefined;
    let courseId: string | undefined;
    let profileSlug: string | undefined;
    let dashboardSection: string | undefined;
    let role: 'job_seeker' | 'employer' | 'admin' | undefined;
    let authMode: 'signin' | 'signup' | undefined;

    if (path) {
      if (path.startsWith('auth/')) {
        const parts = path.split('/');
        page = 'auth';
        // Handle /auth/signin/job-seeker or /auth/signup/employer or /auth/candidate
        if ((parts[1] === 'signin' || parts[1] === 'signup') && parts[2]) {
          authMode = parts[1] as 'signin' | 'signup';
          const roleParam = parts[2];
          role = (roleParam === 'job-seeker' || roleParam === 'candidate') ? 'job_seeker' :
            (roleParam === 'employer' || roleParam === 'recruiter') ? 'employer' : undefined;
        } else if (parts[1]) {
          // Legacy format fallback: /auth/job-seeker
          const roleParam = parts[1];
          role = (roleParam === 'job-seeker' || roleParam === 'candidate') ? 'job_seeker' :
            (roleParam === 'employer' || roleParam === 'recruiter') ? 'employer' : undefined;
          authMode = 'signin';
        }
      } else if (path.startsWith('admin/')) {
        if (path === 'admin/login' || path === 'admin/register') {
          page = path;
        } else {
          const parts = path.split('/');
          page = 'admin';
          dashboardSection = parts[1] || 'overview';
        }
      } else if (path.startsWith('job-details/')) {
        const parts = path.split('/');
        page = 'job-details';
        jobId = parts[1];
      } else if (path.startsWith('courses/')) {
        const parts = path.split('/');
        page = 'course-details';
        courseId = parts[1];
      } else if (path.startsWith('c/')) {
        const parts = path.split('/');
        page = 'public-profile';
        profileSlug = parts[1];
      } else if (path.startsWith('job-seeker-dashboard/')) {
        // Handle job seeker dashboard sub-routes
        const parts = path.split('/');
        page = 'job-seeker-dashboard';
        dashboardSection = parts[1] || 'overview';
      } else if (path.startsWith('recruiter-dashboard/')) {
        // Handle recruiter dashboard sub-routes
        const parts = path.split('/');
        page = 'recruiter-dashboard';
        dashboardSection = parts[1] || 'overview';
      } else if (path.startsWith('college/') && !path.startsWith('college/register') && !path.startsWith('college/login')) {
        // Handle college dashboard sub-routes
        const parts = path.split('/');
        page = 'college';
        dashboardSection = parts[1] || 'overview';
      } else {
        // Regular pages
        page = path;
      }
    }

    // Always prefer URL over localStorage for deep links
    if (page !== 'landing' || path === 'landing') {
      return { page, jobId, courseId, profileSlug, dashboardSection, role, authMode };
    }

    const savedState = localStorage.getItem('pageState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return { ...parsed, profileSlug, dashboardSection };
      } catch {
        // Ignore invalid JSON
      }
    }
    return { page, jobId, courseId, profileSlug, dashboardSection };
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      let page = 'landing';
      let jobId: string | undefined;
      let dashboardSection: string | undefined;
      let role: 'job_seeker' | 'employer' | 'admin' | undefined;
      let authMode: 'signin' | 'signup' | undefined;
      let courseId: string | undefined;

      if (path) {
        if (path.startsWith('auth/')) {
          const parts = path.split('/');
          page = 'auth';
          if ((parts[1] === 'signin' || parts[1] === 'signup') && parts[2]) {
            authMode = parts[1] as 'signin' | 'signup';
            const roleParam = parts[2];
            role = (roleParam === 'job-seeker' || roleParam === 'candidate') ? 'job_seeker' :
              (roleParam === 'employer' || roleParam === 'recruiter') ? 'employer' : undefined;
          } else if (parts[1]) {
            const roleParam = parts[1];
            role = (roleParam === 'job-seeker' || roleParam === 'candidate') ? 'job_seeker' :
              (roleParam === 'employer' || roleParam === 'recruiter') ? 'employer' : undefined;
            authMode = 'signin';
          }
        } else if (path.startsWith('admin/')) {
          if (path === 'admin/login' || path === 'admin/register') {
            page = path;
          } else {
            const parts = path.split('/');
            page = 'admin';
            dashboardSection = parts[1] || 'overview';
          }
        } else if (path.startsWith('job-details/')) {
          const parts = path.split('/');
          page = 'job-details';
          jobId = parts[1];
        } else if (path.startsWith('courses/')) {
          const parts = path.split('/');
          page = 'course-details';
          courseId = parts[1];
        } else if (path.startsWith('job-seeker-dashboard/')) {
          const parts = path.split('/');
          page = 'job-seeker-dashboard';
          dashboardSection = parts[1] || 'overview';
        } else if (path.startsWith('recruiter-dashboard/')) {
          const parts = path.split('/');
          page = 'recruiter-dashboard';
          dashboardSection = parts[1] || 'overview';
        } else if (path.startsWith('college/') && !path.startsWith('college/register') && !path.startsWith('college/login')) {
          const parts = path.split('/');
          page = 'college';
          dashboardSection = parts[1] || 'overview';
        } else {
          // Regular pages
          page = path;
        }
      }

      setPageState({ page, jobId, dashboardSection, role, authMode, courseId });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && profile) {
        // Special handling for admin login/register pages
        if (pageState.page === 'admin/login' || pageState.page === 'admin/register') {
          if (profile.role === 'admin') {
            setPageState({ page: 'admin', dashboardSection: 'overview' });
            localStorage.setItem('pageState', JSON.stringify({ page: 'admin', dashboardSection: 'overview' }));
            window.history.pushState({}, '', '/admin/overview');
            return;
          }
        }

        // Don't auto-navigate if on these pages
        const allowedPages = [
          'recruiter-onboarding',
          'admin',
          'job-seeker-dashboard',
          'recruiter-dashboard',
          'college',
          'course-details',
          'job-details',
          'jobs',
          'settings',
          'post-job',
          'saved-jobs',
          'notifications',
          'applicants'
        ];

        if (allowedPages.includes(pageState.page)) {
          return;
        }

        // Redirect to appropriate dashboard based on role
        const dashboardPage = profile.role === 'employer' ? 'recruiter-dashboard' :
          profile.role === 'admin' ? 'admin' :
            profile.role === 'college' ? 'college' : 'job-seeker-dashboard';

        const initialSection = dashboardPage === 'admin' ? 'overview' : undefined;
        let redirectUrl = `/${dashboardPage}`;
        if (initialSection) {
          redirectUrl += `/${initialSection}`;
        }

        setPageState({ page: dashboardPage, dashboardSection: initialSection });
        localStorage.setItem('pageState', JSON.stringify({ page: dashboardPage, dashboardSection: initialSection }));
        window.history.pushState({}, '', redirectUrl);
      } else if (!user) {
        const publicPages = ['landing', 'jobs', 'role-select', 'auth', 'forgot-password', 'faq', 'contact', 'for-candidates', 'for-recruiters', 'job-details', 'admin/login', 'admin/register', 'college', 'college/register', 'college/login'];
        // Allow auth pages (with various parameters)
        if (!publicPages.includes(pageState.page) && pageState.page !== 'auth') {
          // Check if it's a sub-route of a public page or an auth path
          if (!pageState.page.startsWith('auth')) {
            setPageState({ page: 'landing' });
            localStorage.setItem('pageState', JSON.stringify({ page: 'landing' }));
            window.history.pushState({}, '', '/landing');
          }
        }
      }
    }
  }, [user, profile, loading]);

  const handleNavigate = (page: string, jobId?: string, role?: 'job_seeker' | 'employer' | 'admin', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => {
    const newState = { page, jobId, role, courseId, successMessage, profileSlug, dashboardSection, authMode };
    setPageState(newState);
    localStorage.setItem('pageState', JSON.stringify(newState));
    let url = `/${page}`;
    if (page === 'auth' && role) {
      // New clean URL structure: /auth/signin/job-seeker
      const mode = authMode || 'signin';
      const roleSlug = role === 'job_seeker' ? 'job-seeker' : 'employer';
      url = `/auth/${mode}/${roleSlug}`;
    } else if (jobId) {
      url = `/${page}/${jobId}`;
    } else if (courseId) {
      url = `/courses/${courseId}`;
    } else if (profileSlug) {
      url = `/c/${profileSlug}`;
    } else if (dashboardSection && (page === 'job-seeker-dashboard' || page === 'recruiter-dashboard' || page === 'college' || page === 'admin')) {
      url = `/${page}/${dashboardSection}`;
    }
    window.history.pushState({}, '', url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {pageState.page !== 'job-seeker-dashboard' && pageState.page !== 'course-details' && pageState.page !== 'recruiter-dashboard' && pageState.page !== 'college' && pageState.page !== 'admin' && (
        <CardNav
          items={navItems}
          onNavigate={handleNavigate}
          baseColor="rgba(15, 23, 42, 0.85)"
          menuColor="#ffffff"
          buttonBgColor="#2563eb"
          buttonTextColor="#ffffff"
          logoColor="#ffffff"
        />
      )}

      <main>
        {pageState.page === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {pageState.page === 'role-select' && <RoleSelectPage onNavigate={handleNavigate} />}
        {pageState.page === 'public-profile' && pageState.profileSlug && (
          <PublicCandidateProfile profileSlug={pageState.profileSlug} />
        )}
        {pageState.page === 'auth' && pageState.role && pageState.role !== 'admin' && (
          <AuthPage
            role={pageState.role as 'job_seeker' | 'employer'}
            onNavigate={handleNavigate}
            successMessage={pageState.successMessage}
            initialMode={pageState.authMode}
          />
        )}
        {pageState.page === 'verify-2fa' && (
          <VerifyTwoFactorPage
            onNavigate={handleNavigate}
            role={pageState.role as 'job_seeker' | 'employer' | 'admin'}
          />
        )}
        {pageState.page === 'forgot-password' && (
          <ForgotPasswordPage role={pageState.role as 'job_seeker' | 'employer' || 'job_seeker'} onNavigate={handleNavigate} />
        )}
        {pageState.page === 'recruiter-onboarding' && (
          <RecruiterOnboardingPage onComplete={() => handleNavigate('landing')} />
        )}
        {pageState.page === 'admin/login' && <AdminLoginPage onNavigate={handleNavigate} />}
        {pageState.page === 'admin/register' && <AdminRegisterPage onNavigate={handleNavigate} />}
        {pageState.page === 'jobs' && <JobsPage onNavigate={handleNavigate} />}
        {pageState.page === 'job-details' && pageState.jobId && (
          <JobDetailsPage jobId={pageState.jobId} onNavigate={handleNavigate} />
        )}
        {pageState.page === 'course-details' && pageState.courseId && (
          <CourseDetailsPage />
        )}
        {pageState.page === 'job-seeker-dashboard' && (
          profile?.role === 'job_seeker' ? (
            <JobSeekerLayout
              onNavigate={handleNavigate}
              activeSection={pageState.dashboardSection || 'overview'}
            >
              {(!pageState.dashboardSection || pageState.dashboardSection === 'overview') && (
                <JobSeekerOverview onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'browse' && (
                <JobSeekerBrowseJobs onNavigate={handleNavigate} />
              )}

              {pageState.dashboardSection === 'applications' && (
                <JobSeekerApplications onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'saved' && (
                <JobSeekerSavedJobs onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'notifications' && (
                <JobSeekerNotifications onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'profile' && (
                <JobSeekerProfile onNavigate={handleNavigate} />
              )}
              {pageState.dashboardSection === 'settings' && (
                <JobSeekerSettings onNavigate={handleNavigate} />
              )}
            </JobSeekerLayout>
          ) : (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
                <p className="text-slate-600 mb-4">You need to be logged in as a job seeker to access this page.</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigate('auth', undefined, 'job_seeker', undefined, undefined, undefined, undefined, 'signin')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sign In as Job Seeker
                  </button>
                  <button
                    onClick={() => handleNavigate('landing')}
                    className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        {pageState.page === 'recruiter-dashboard' && (
          profile?.role === 'employer' ? (
            profile?.isApproved ? (
              <RecruiterDashboardRouter
                onNavigate={handleNavigate}
                activeSection={pageState.dashboardSection || 'overview'}
              />
            ) : (
              <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Pending Approval</h2>
                    <p className="text-slate-600 mb-4">
                      Your recruiter application is currently under review by our admin team.
                      You'll receive an email notification once your account is approved.
                    </p>
                    {profile?.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 text-sm">
                          <strong>Feedback:</strong> {profile.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigate('landing')}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mb-2"
                    >
                      Go to Home
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.reload();
                      }}
                      className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Recruiter Dashboard</h2>
                <div className="text-left mb-4">
                  <p className="text-slate-600 mb-2"><strong>Profile loaded:</strong> {profile ? 'Yes' : 'No'}</p>
                  <p className="text-slate-600 mb-2"><strong>Role:</strong> {profile?.role || 'Not set'}</p>
                  <p className="text-slate-600 mb-2"><strong>Email:</strong> {profile?.email || 'Not set'}</p>
                  <p className="text-slate-600 mb-2"><strong>Full Name:</strong> {profile?.fullName || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigate('landing')}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mb-2"
                  >
                    Go to Home
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        {pageState.page === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
        {pageState.page === 'post-job' && profile?.role === 'employer' && (
          <PostJobPage onNavigate={handleNavigate} />
        )}
        {pageState.page === 'post-internship' && profile?.role === 'employer' && (
          <PostInternshipPage onNavigate={handleNavigate} />
        )}
        {pageState.page === 'saved-jobs' && profile?.role === 'job_seeker' && (
          <SavedJobsPage onNavigate={handleNavigate} />
        )}
        {pageState.page === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
        {pageState.page === 'admin' && profile?.role === 'admin' && (
          <AdminDashboard
            activeSection={pageState.dashboardSection || 'overview'}
            onNavigate={handleNavigate}
          />
        )}
        {pageState.page === 'college' && (
          <CollegeDashboardLayout
            onNavigate={handleNavigate}
            activeSection={pageState.dashboardSection || 'overview'}
          />
        )}
        {pageState.page === 'college/register' && <CollegeRegisterPage onNavigate={handleNavigate} />}
        {pageState.page === 'college/login' && <CollegeLoginPage onNavigate={handleNavigate} />}
        {pageState.page === 'applicants' && profile?.role === 'employer' && (
          <ApplicantsPage onNavigate={handleNavigate} />
        )}
        {pageState.page === 'faq' && <FaqPage onNavigate={handleNavigate} />}
        {pageState.page === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {pageState.page === 'for-candidates' && <ForCandidatesPage onNavigate={handleNavigate} />}
        {pageState.page === 'for-recruiters' && <ForRecruitersPage onNavigate={handleNavigate} />}
        {pageState.page === 'terms-privacy' && <TermsPrivacyPage onNavigate={handleNavigate} />}
        {pageState.page === 'passport' && <PassportPage />}
      </main>

      {/* Global Full-Screen Modal Ad */}
      <FullScreenModalAd />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}