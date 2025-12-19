import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import {
  Users, Briefcase, Bell, CheckCircle, BookOpen,
  Shield, BarChart3, Megaphone, Mail, LogOut
} from 'lucide-react';

// Import types and API functions
import {
  FormattedCandidate,
  FormattedRecruiterApproval,
  FormattedJob,
  Candidate,
  RecruiterProfile,
  VerificationApplication,
  Course,
  ContactSubmission
} from './admin/types';

// Import tab components
import { OverviewTab } from './admin/OverviewTab';
import { CandidatesTab } from './admin/CandidatesTab';
import { RecruitersTab } from './admin/RecruitersTab';
import { ApprovalsTab } from './admin/ApprovalsTab';
import { JobsTab } from './admin/JobsTab';
import { VerificationTab } from './admin/VerificationTab';
import { CoursesTab, CourseModal } from './admin/CoursesTab';
import { AlertsTab, AlertModal } from './admin/AlertsTab';
import { AdsTab, AdModal, ImageModal } from './admin/AdsTab';
import { NotificationsTab, ContactViewModal } from './admin/NotificationsTab';

// Import modal components
import { DeleteDialog, VerifyDialog, ProfileModal, RejectRecruiterDialog } from './admin/Modals';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

interface AdminDashboardProps {
  activeSection?: string;
  onNavigate?: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
}

export function AdminDashboard({ activeSection = 'overview', onNavigate }: AdminDashboardProps) {
  const { profile, signOut } = useAuth();
  const { socket, isConnected, on, off } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');

  // Data cache to prevent redundant API calls
  const [dataCache, setDataCache] = useState<{
    candidates?: any[];
    recruiters?: any[];
    pendingApprovals?: any[];
    jobs?: any[];
    verificationApplications?: any[];
    courses?: any[];
    alerts?: any[];
    ads?: any[];
    contacts?: any[];
    lastFetch?: { [key: string]: number };
  }>({ lastFetch: {} });

  // Cache duration: 2 minutes
  const CACHE_DURATION = 2 * 60 * 1000;

  // User management states
  const [candidates, setCandidates] = useState<FormattedCandidate[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<FormattedRecruiterApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<FormattedCandidate | FormattedRecruiterApproval | any | null>(null);
  const [userToVerify, setUserToVerify] = useState<FormattedCandidate | FormattedRecruiterApproval | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Candidate | RecruiterProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Reject dialog
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [recruiterToReject, setRecruiterToReject] = useState<FormattedRecruiterApproval | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Jobs state
  const [jobs, setJobs] = useState<FormattedJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Verification states
  const [verificationApplications, setVerificationApplications] = useState<VerificationApplication[]>([]);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Image modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Course management states
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    price: 0,
    isFree: false,
    isFeatured: false,
    courseUrl: '',
    thumbnail: ''
  });

  // Alert management states
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [showAddAlertModal, setShowAddAlertModal] = useState(false);
  const [showEditAlertModal, setShowEditAlertModal] = useState(false);
  const [showDeleteAlertModal, setShowDeleteAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'error' | 'success',
    expiresAt: '',
    isActive: true
  });

  // Ad management states
  const [ads, setAds] = useState<any[]>([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [showEditAdModal, setShowEditAdModal] = useState(false);
  const [showDeleteAdModal, setShowDeleteAdModal] = useState(false);
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [adForm, setAdForm] = useState<{
    title: string;
    description: string;
    linkUrl: string;
    ctaText: string;
    placement: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    priority: number;
    displayDuration?: number;
    unskippableDuration?: number;
    frequency?: number;
  }>({
    title: '',
    description: '',
    linkUrl: '',
    ctaText: 'Learn More',
    placement: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    isActive: true,
    priority: 1,
    displayDuration: undefined,
    unskippableDuration: undefined,
    frequency: undefined
  });

  // Contact submissions states
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalCandidates: 0,
    candidatesGrowth: 0,
    totalRecruiters: 0,
    recruitersGrowth: 0,
    totalJobs: 0,
    jobsGrowth: 0,
    pendingApprovals: 0,
    approvalsGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    activeCourses: 0,
    coursesGrowth: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Helper function to check if cache is valid
  const isCacheValid = (key: string) => {
    const lastFetch = dataCache.lastFetch?.[key];
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
  };

  // Helper function to update cache
  const updateCache = (key: string, data: any) => {
    setDataCache(prev => ({
      ...prev,
      [key]: data,
      lastFetch: { ...prev.lastFetch, [key]: Date.now() }
    }));
  };

  // Initial data fetch with caching
  useEffect(() => {
    if (activeSection === 'overview') {
      // Set loading immediately
      if (!isCacheValid('overview')) {
        setStatsLoading(true);
      }
      fetchStats();
    } else if (activeSection === 'candidates') {
      if (isCacheValid('candidates') && dataCache.candidates) {
        setCandidates(dataCache.candidates);
        setLoading(false);
      } else {
        setLoading(true);
        fetchCandidates();
      }
    } else if (activeSection === 'recruiters') {
      if (isCacheValid('recruiters') && dataCache.recruiters) {
        setRecruiters(dataCache.recruiters);
        setLoading(false);
      } else {
        setLoading(true);
        fetchRecruiters();
      }
    } else if (activeSection === 'approvals') {
      if (isCacheValid('pendingApprovals') && dataCache.pendingApprovals) {
        setPendingApprovals(dataCache.pendingApprovals);
        setLoading(false);
      } else {

        const loadApprovalsData = async () => {
          setLoading(true);
          // We need both pending approvals (for the list) and all recruiters (for the stats)
          await fetchPendingApprovals();
          await fetchRecruiters();
          setLoading(false);
        };
        loadApprovalsData();
      }
    } else if (activeSection === 'jobs') {
      if (isCacheValid('jobs') && dataCache.jobs) {
        setJobs(dataCache.jobs);
        setJobsLoading(false);
      } else {
        setJobsLoading(true);
        fetchJobs();
      }
    } else if (activeSection === 'verification') {
      if (isCacheValid('verificationApplications') && dataCache.verificationApplications) {
        setVerificationApplications(dataCache.verificationApplications);
        setVerificationLoading(false);
      } else {
        setVerificationLoading(true);
        fetchVerificationApplications();
      }
    } else if (activeSection === 'courses') {
      if (isCacheValid('courses') && dataCache.courses) {
        setCourses(dataCache.courses);
        setCoursesLoading(false);
      } else {
        setCoursesLoading(true);
        fetchCourses();
      }
    } else if (activeSection === 'alerts') {
      if (isCacheValid('alerts') && dataCache.alerts) {
        setAlerts(dataCache.alerts);
        setAlertsLoading(false);
      } else {
        setAlertsLoading(true);
        fetchAlerts();
      }
    } else if (activeSection === 'ads') {
      if (isCacheValid('ads') && dataCache.ads) {
        setAds(dataCache.ads);
        setAdsLoading(false);
      } else {
        setAdsLoading(true);
        fetchAds(1, true); // Fetch page 1, reset list
      }
    } else if (activeSection === 'notifications') {
      if (isCacheValid('contacts') && dataCache.contacts) {
        setContactSubmissions(dataCache.contacts);
        setContactsLoading(false);
      } else {
        setContactsLoading(true);
        fetchContactSubmissions();
      }
    }
  }, [activeSection]);

  // Real-time ad updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleAdStatsUpdate = (data: { adId: string; impressions: number; clicks: number }) => {
      setAds(prevAds =>
        prevAds.map(ad =>
          ad._id === data.adId
            ? { ...ad, impressions: data.impressions, clicks: data.clicks }
            : ad
        )
      );

      // Optinally update cache if it exists
      setDataCache(prev => {
        if (!prev.ads) return prev;
        return {
          ...prev,
          ads: prev.ads.map(ad =>
            ad._id === data.adId
              ? { ...ad, impressions: data.impressions, clicks: data.clicks }
              : ad
          )
        };
      });
    };

    socket.on('ad:stats-updated', handleAdStatsUpdate);

    return () => {
      socket.off('ad:stats-updated', handleAdStatsUpdate);
    };
  }, [socket, isConnected]);

  // Fetch functions
  const fetchStats = async () => {
    // Check if we have cached overview data
    if (isCacheValid('overview')) {
      setStatsLoading(false);
      return;
    }

    try {
      setStatsLoading(true);
      const token = localStorage.getItem('token');

      // 1. Fetch lightweight stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // 2. Fetch only recent items for widgets (limit=5)
      // These run in parallel with stats fetch or after
      const [candidatesRes, recruitersRes, jobsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/candidates?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/admin/recruiters/pending?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/jobs?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
        // fetch(`${API_BASE_URL}/api/courses?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }) // Commented out to avoid unused var
      ]);

      const statsData = statsRes.ok ? await statsRes.json() : { data: {} };
      const candidatesData = candidatesRes.ok ? await candidatesRes.json() : { data: [] };
      const recruitersData = recruitersRes.ok ? await recruitersRes.json() : { data: [] }; // This is pending recruiters
      const jobsData = jobsRes.ok ? await jobsRes.json() : { data: [] };
      // const coursesData = coursesRes.ok ? await coursesRes.json() : { data: [] };

      // Update local state for Overview widgets ONLY
      // IMPORTANT: We do NOT update the dataCache for 'candidates', 'jobs', etc. with these limited lists
      // so that when the user clicks the actual tabs, they fetch the full lists.
      setCandidates(candidatesData.data || []);
      setJobs(jobsData.data || []);

      // Map raw recruiter data for approvals widget
      const formattedApprovals = (recruitersData.data || []).map((recruiter: any) => ({
        id: recruiter._id,
        recruiterId: recruiter._id,
        name: recruiter.fullName,
        email: recruiter.email,
        phone: recruiter.recruiterOnboardingDetails?.phone || recruiter.profile?.phone || '',
        jobTitle: recruiter.recruiterOnboardingDetails?.jobTitle || recruiter.profile?.jobTitle || '',
        company: recruiter.recruiterOnboardingDetails?.company?.name || recruiter.profile?.company?.name || '',
        companySize: recruiter.recruiterOnboardingDetails?.company?.size || recruiter.profile?.company?.size || '',
        website: recruiter.recruiterOnboardingDetails?.company?.website || recruiter.profile?.company?.website || '',
        companyLogo: recruiter.recruiterOnboardingDetails?.company?.logo || recruiter.profile?.company?.logo || null,
        companyImages: recruiter.recruiterOnboardingDetails?.company?.images || recruiter.profile?.company?.images || [],
        companyAddress: recruiter.recruiterOnboardingDetails?.company?.address || recruiter.profile?.company?.headOfficeLocation?.address || '',
        facebook: recruiter.recruiterOnboardingDetails?.company?.socialLinks?.facebook || recruiter.profile?.company?.socialLinks?.facebook || '',
        linkedin: recruiter.recruiterOnboardingDetails?.company?.socialLinks?.linkedin || recruiter.profile?.company?.socialLinks?.linkedin || '',
        twitter: recruiter.recruiterOnboardingDetails?.company?.socialLinks?.twitter || recruiter.profile?.company?.socialLinks?.twitter || '',
        instagram: recruiter.recruiterOnboardingDetails?.company?.socialLinks?.instagram || recruiter.profile?.company?.socialLinks?.instagram || '',
        employmentProof: recruiter.recruiterOnboardingDetails?.employmentProof || recruiter.profile?.employmentProof || null,
        applicationDate: recruiter.recruiterOnboardingDetails?.submittedAt ? new Date(recruiter.recruiterOnboardingDetails.submittedAt).toLocaleDateString() : (recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : 'N/A'),
        onboardingComplete: recruiter.recruiterOnboardingDetails?.isComplete || false,
        status: recruiter.approvalStatus || 'pending'
      }));
      setPendingApprovals(formattedApprovals);

      // Use the trusted counts from the backend stats endpoint
      if (statsData.success && statsData.data) {
        setStats({
          totalCandidates: statsData.data.totalCandidates || 0,
          candidatesGrowth: statsData.data.candidatesGrowth || 0,
          totalRecruiters: statsData.data.totalRecruiters || 0,
          recruitersGrowth: statsData.data.recruitersGrowth || 0,
          totalJobs: statsData.data.totalJobs || 0, // Using totalJobs from stats endpoint
          jobsGrowth: statsData.data.jobsGrowth || 0,
          pendingApprovals: statsData.data.pendingApprovals || 0,
          approvalsGrowth: statsData.data.approvalsGrowth || 0,
          totalRevenue: statsData.data.totalRevenue || 0,
          revenueGrowth: statsData.data.revenueGrowth || 0,
          activeCourses: statsData.data.activeCourses || 0,
          coursesGrowth: statsData.data.coursesGrowth || 0
        });
      }

      // Mark overview as cached
      updateCache('overview', true);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/candidates`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      const candidatesData = data.data || [];
      setCandidates(candidatesData);
      updateCache('candidates', candidatesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruiters = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/recruiters`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch recruiters');
      const data = await response.json();
      const recruitersData = data.data || [];
      setRecruiters(recruitersData);
      updateCache('recruiters', recruitersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/recruiters/pending`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch pending approvals');
      const data = await response.json();

      // Map raw recruiter data to FormattedRecruiterApproval interface
      const formattedApprovals = (data.data || []).map((recruiter: any) => ({
        id: recruiter._id,
        recruiterId: recruiter._id,
        name: recruiter.fullName,
        email: recruiter.email,
        phone: recruiter.recruiterOnboardingDetails?.phone || recruiter.profile?.phone || '',
        jobTitle: recruiter.recruiterOnboardingDetails?.jobTitle || recruiter.profile?.jobTitle || '',
        company: recruiter.recruiterOnboardingDetails?.company?.name || recruiter.profile?.company?.name || '',
        companySize: recruiter.recruiterOnboardingDetails?.company?.size || recruiter.profile?.company?.size || '',
        website: recruiter.recruiterOnboardingDetails?.company?.website || recruiter.profile?.company?.website || '',
        companyLogo: recruiter.recruiterOnboardingDetails?.company?.logo || recruiter.profile?.company?.logo || null,
        companyImages: recruiter.recruiterOnboardingDetails?.company?.images || recruiter.profile?.company?.images || [],
        companyAddress: recruiter.recruiterOnboardingDetails?.company?.address || recruiter.profile?.company?.headOfficeLocation?.address || '',
        facebook: recruiter.recruiterOnboardingDetails?.company?.socialLinks?.facebook || recruiter.profile?.company?.socialLinks?.facebook || '',
        linkedin: recruiter.recruiterOnboardingDetails?.company?.socialLinks?.linkedin || recruiter.profile?.company?.socialLinks?.linkedin || '',
        twitter: recruiter.recruiterOnboardingDetails?.company?.socialLinks?.twitter || recruiter.profile?.company?.socialLinks?.twitter || '',
        instagram: recruiter.recruiterOnboardingDetails?.company?.socialLinks?.instagram || recruiter.profile?.company?.socialLinks?.instagram || '',
        employmentProof: recruiter.recruiterOnboardingDetails?.employmentProof || recruiter.profile?.employmentProof || null,
        applicationDate: recruiter.recruiterOnboardingDetails?.submittedAt ? new Date(recruiter.recruiterOnboardingDetails.submittedAt).toLocaleDateString() : (recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : 'N/A'),
        onboardingComplete: recruiter.recruiterOnboardingDetails?.isComplete || false,
        status: recruiter.approvalStatus || 'pending'
      }));

      setPendingApprovals(formattedApprovals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      const jobsData = data.data || [];
      setJobs(jobsData);
      updateCache('jobs', jobsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchVerificationApplications = async () => {
    setVerificationLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/verification-applications`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch verification applications');
      const data = await response.json();
      setVerificationApplications(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch verification applications');
    } finally {
      setVerificationLoading(false);
    }
  };

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      if (response.ok) {
        const data = await response.json();
        const coursesData = Array.isArray(data.data) ? data.data : [];
        setCourses(coursesData);
        updateCache('courses', coursesData);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/alerts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const alertsData = data.data || [];
        setAlerts(alertsData);
        updateCache('alerts', alertsData);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setAlertsLoading(false);
    }
  };

  // Ad pagination state
  const [adsPage, setAdsPage] = useState(1);
  const [adsHasMore, setAdsHasMore] = useState(true);

  const fetchAds = async (pageNum = 1, reset = false) => {
    try {
      setAdsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/ads?page=${pageNum}&limit=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const adsData = data.data || [];

        if (reset) {
          setAds(adsData);
        } else {
          setAds(prev => [...prev, ...adsData]);
        }

        // Update hasMore based on pagination data if available, or simple length check
        if (data.pagination) {
          setAdsHasMore(data.pagination.page < data.pagination.pages);
        } else {
          // Fallback if backend doesn't return pagination (should not happen with my update)
          setAdsHasMore(adsData.length === 20);
        }

        updateCache('ads', reset ? adsData : [...ads, ...adsData]);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setAdsLoading(false);
    }
  };

  const handleLoadMoreAds = () => {
    const nextPage = adsPage + 1;
    setAdsPage(nextPage);
    fetchAds(nextPage, false);
  };

  const fetchContactSubmissions = async () => {
    try {
      setContactsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/contact/all?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const contactsData = data.data || [];
        setContactSubmissions(contactsData);
        updateCache('contacts', contactsData);
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setContactsLoading(false);
    }
  };

  // Socket.IO: Listen for real-time ad stats updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleAdStatsUpdate = (data: { adId: string; impressions: number; clicks: number }) => {
      setAds(prevAds =>
        prevAds.map(ad =>
          ad._id === data.adId
            ? { ...ad, impressions: data.impressions, clicks: data.clicks }
            : ad
        )
      );
    };

    on('ad:stats-updated', handleAdStatsUpdate);

    return () => {
      off('ad:stats-updated', handleAdStatsUpdate);
    };
  }, [socket, isConnected, on, off]);

  // Action handlers
  // Action handlers
  const handleSendInterview = async (candidateId: string, link: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/candidates/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidateId,
          link,
          message: `You have been invited to an interview! Join here: ${link}`
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Interview invitation sent successfully!');
      } else {
        alert(data.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending interview:', error);
      alert('Failed to send interview link. Please try again.');
    }
  };

  const handleUpdateCredits = async (candidateId: string, count: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/candidates/credits`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ candidateId, count })
      });

      const data = await response.json();

      if (data.success) {
        alert('Credits updated successfully!');

        // Update local state immediately to reflect changes in UI
        setCandidates(prev => prev.map(c =>
          c.id === candidateId ? { ...c, interviewCount: count } : c
        ));

        // Also update the cache if it exists
        if (dataCache.candidates) {
          updateCache('candidates', (dataCache.candidates as any[]).map(c =>
            c._id === candidateId || c.id === candidateId ? { ...c, interviewCount: count } : c
          ));
        }

        if (activeSection === 'candidates') fetchCandidates(); // Refresh list from server to be sure
      } else {

        alert(data.message || 'Failed to update credits');
      }
    } catch (error) {
      console.error('Error updating credits:', error);
      alert('Failed to update credits.');
    }
  };

  const handleUpdateScore = async (candidateId: string, score: number, level: string, verifiedSkills: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/candidates/${candidateId}/score`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score, level, verifiedSkills })
      });

      const data = await response.json();

      if (data.success) {
        alert('Score updated successfully!');
        if (activeSection === 'candidates') fetchCandidates();
      } else {
        alert(data.message || 'Failed to update score');
      }
    } catch (error) {
      console.error('Error updating score:', error);
      alert('Failed to update score.');
    }
  };

  const handleViewProfile = async (candidateId: string) => {
    setProfileLoading(true);
    setShowProfileModal(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/candidates/${candidateId}/profile`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setSelectedProfile(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setShowProfileModal(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleViewRecruiterProfile = async (recruiterId: string) => {
    setProfileLoading(true);
    setShowProfileModal(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/recruiters/${recruiterId}/profile`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch recruiter profile');
      const data = await response.json();
      const profileData = { ...data.data, _isRecruiterProfile: true };
      setSelectedProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recruiter profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleVerifyCandidate = async () => {
    if (!userToVerify) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/candidates/${userToVerify.id}/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify candidate');
      }
      const data = await response.json();
      setCandidates(candidates.map(c => c.id === userToVerify.id ? { ...c, status: 'verified' } : c));
      setShowVerifyDialog(false);
      setUserToVerify(null);
      alert(`${data.data.verifiedCandidate} has been verified successfully!`);
      fetchCandidates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify candidate');
      alert(err instanceof Error ? err.message : 'Failed to verify candidate');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType: userToDelete._userType || 'candidate' })
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setCandidates(candidates.filter(c => c.id !== userToDelete.id));
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleApproveRecruiter = async (applicationId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/recruiters/${applicationId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to approve recruiter');
      const data = await response.json();
      alert(`Recruiter ${data.data.approvedRecruiter} has been approved successfully!`);

      // Update both pending list and stats
      await Promise.all([fetchPendingApprovals(), fetchRecruiters()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve recruiter');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRecruiter = async (applicationId: string) => {
    const application = pendingApprovals.find(r => r.id === applicationId);
    if (application) {
      setRecruiterToReject(application);
      setShowRejectDialog(true);
    }
  };

  const confirmRejectRecruiter = async () => {
    if (!recruiterToReject) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/recruiters/${recruiterToReject.id}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason })
      });
      if (!response.ok) throw new Error('Failed to reject recruiter');
      const data = await response.json();
      alert(`Recruiter ${data.data.rejectedRecruiter}'s application has been rejected.`);
      setPendingApprovals(pendingApprovals.filter(r => r.id !== recruiterToReject.id));
      setShowRejectDialog(false);
      setRecruiterToReject(null);

      setRejectionReason('');
      // Update stats
      await fetchRecruiters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject recruiter');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecruiter = (recruiter: any) => {
    setUserToDelete({ ...recruiter, _userType: 'recruiter' });
    setShowDeleteDialog(true);
  };

  // Verification handlers
  const handleApproveVerification = async (appId: string) => {
    // TODO: Implement approval dialog
    console.log('Approve verification:', appId);
  };

  const handleRejectVerification = async (appId: string) => {
    // TODO: Implement rejection dialog
    console.log('Reject verification:', appId);
  };

  // Course handlers
  const handleAddCourse = () => {
    setCourseForm({
      title: '', description: '', instructor: '', duration: '', category: '',
      level: 'beginner', price: 0, isFree: false, isFeatured: false, courseUrl: '', thumbnail: ''
    });
    setShowAddCourseModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.shortDescription || '',
      instructor: course.instructorName || '',
      duration: course.estimatedDuration || '',
      category: course.category || '',
      level: (course.level?.toLowerCase() || 'beginner') as 'beginner' | 'intermediate' | 'advanced',
      price: course.price || 0,
      isFree: course.price === 0,
      isFeatured: false,
      courseUrl: '',
      thumbnail: course.thumbnail || ''
    });
    setShowEditCourseModal(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    if (course) {
      setSelectedCourse(course);
      setShowDeleteCourseModal(true);
    }
  };

  // Alert handlers
  const handleAddAlert = () => {
    setAlertForm({ title: '', message: '', type: 'info', expiresAt: '', isActive: true });
    setShowAddAlertModal(true);
  };

  const handleEditAlert = (alert: any) => {
    setSelectedAlert(alert);
    setAlertForm({
      title: alert.title || alert.name || '',
      message: alert.message || '',
      type: alert.type || 'info',
      expiresAt: alert.expiresAt || '',
      isActive: alert.isActive !== false
    });
    setShowEditAlertModal(true);
  };

  const handleDeleteAlert = (alertId: string) => {
    const alert = alerts.find(a => a._id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setShowDeleteAlertModal(true);
    }
  };

  const handleSendBulkEmail = async (emailData: { userType: string; subject: string; message: string }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/candidates/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Failed to send emails');
      }
    } catch (error) {
      console.error('Error sending bulk email:', error);
      throw error;
    }
  };

  const handleExportJobs = () => {
    if (jobs.length === 0) {
      alert('No jobs to export');
      return;
    }

    // Prepare CSV data
    const headers = [
      'Job Title',
      'Department',
      'Employment Type',
      'Work Mode',
      'Location',
      'Salary',
      'Applications',
      'Status',
      'Posted Date'
    ];

    const csvContent = [
      headers.join(','),
      ...jobs.map(job => [
        `"${job.jobDetails?.basicInfo?.jobTitle?.replace(/"/g, '""') || ''}"`,
        `"${job.jobDetails?.basicInfo?.department?.replace(/"/g, '""') || ''}"`,
        `"${job.jobDetails?.basicInfo?.employmentType || ''}"`,
        `"${job.jobDetails?.basicInfo?.workMode || ''}"`,
        `"${job.jobDetails?.location?.city || ''}, ${job.jobDetails?.location?.state || ''}"`,
        `"${job.jobDetails?.compensation?.salary || 0} ${job.jobDetails?.compensation?.salaryType || ''}"`,
        job.applications?.length || 0,
        `"${job.status || ''}"`,
        `"${new Date(job.createdAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `koderspark-jobs-export-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCandidates = () => {
    if (candidates.length === 0) {
      alert('No candidates to export');
      return;
    }

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Location',
      'Plan',
      'Verification Status',
      'Interview Count',
      'Join Date'
    ];

    const csvContent = [
      headers.join(','),
      ...candidates.map(candidate => [
        `"${candidate.name.replace(/"/g, '""')}"`,
        `"${candidate.email}"`,
        `"${candidate.phone || ''}"`,
        `"${candidate.location.replace(/"/g, '""')}"`,
        `"${candidate.plan || 'free'}"`,
        `"${candidate.status}"`,
        candidate.interviewCount || 0,
        `"${new Date(candidate.joinDate).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `koderspark-candidates-export-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportRecruiters = () => {
    if (recruiters.length === 0) {
      alert('No recruiters to export');
      return;
    }

    const headers = [
      'Name',
      'Email',
      'Company',
      'Location',
      'Status',
      'Join Date'
    ];

    const csvContent = [
      headers.join(','),
      ...recruiters.map(recruiter => [
        `"${recruiter.name.replace(/"/g, '""')}"`,
        `"${recruiter.email}"`,
        `"${recruiter.company.replace(/"/g, '""')}"`,
        `"${recruiter.location.replace(/"/g, '""')}"`,
        `"${recruiter.status}"`,
        `"${new Date(recruiter.joinDate).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `koderspark-recruiters-export-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportApprovals = () => {
    if (pendingApprovals.length === 0) {
      alert('No pending approvals to export');
      return;
    }

    const headers = [
      'Name',
      'Email',
      'Company',
      'Job Title',
      'Phone',
      'Application Date',
      'Status'
    ];

    const csvContent = [
      headers.join(','),
      ...pendingApprovals.map(approval => [
        `"${approval.name.replace(/"/g, '""')}"`,
        `"${approval.email}"`,
        `"${approval.company.replace(/"/g, '""')}"`,
        `"${approval.jobTitle.replace(/"/g, '""')}"`,
        `"${approval.phone || ''}"`,
        `"${new Date(approval.applicationDate).toLocaleDateString()}"`,
        `"${approval.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `koderspark-approvals-export-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ad handlers
  const handleAddAd = () => {
    setAdForm({
      title: '',
      description: '',
      linkUrl: '',
      ctaText: 'Learn More',
      placement: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
      isActive: true,
      priority: 1,
      displayDuration: undefined,
      unskippableDuration: undefined,
      frequency: undefined
    });
    setShowAddAdModal(true);
  };

  const handleEditAd = (ad: any) => {
    setSelectedAd(ad);
    setAdForm({
      title: ad.title || '',
      description: ad.description || '',
      linkUrl: ad.linkUrl || ad.ctaUrl || '',
      ctaText: ad.ctaText || 'Learn More',
      placement: ad.placement || ad.adType || '',
      imageUrl: ad.imageUrl || ad.image || `${API_BASE_URL}/api/ads/${ad._id}/image`,
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '',
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '',
      isActive: ad.isActive !== false,
      priority: ad.priority || 1,
      displayDuration: ad.displayDuration,
      unskippableDuration: ad.unskippableDuration,
      frequency: ad.frequency
    });
    setShowEditAdModal(true);
  };

  const handleDeleteAd = (adId: string) => {
    const ad = ads.find(a => a._id === adId);
    if (ad) {
      setSelectedAd(ad);
      setShowDeleteAdModal(true);
    }
  };

  const handleTogglePauseAd = async (adId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/ads/${adId}/toggle-pause`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle ad pause status');
      }

      const data = await response.json();
      // Update the ad in the local state
      setAds(ads.map(a => a._id === adId ? data.data : a));
    } catch (error) {
      console.error('Error toggling ad pause:', error);
      alert('Failed to toggle ad pause status');
    }
  };

  // Contact handlers
  const handleViewContact = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleMarkAsRead = async (contactId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/contact/${contactId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setContactSubmissions(contactSubmissions.map(c =>
        c._id === contactId ? { ...c, isRead: true } : c
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/contact/${contactId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setContactSubmissions(contactSubmissions.filter(c => c._id !== contactId));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Navigation tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'recruiters', label: 'Recruiters', icon: Briefcase },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'ads', label: 'Ads', icon: Megaphone },
    { id: 'notifications', label: 'Messages', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 hidden md:flex flex-col flex-shrink-0 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Admin</h1>
              <p className="text-xs text-slate-400">Control Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate?.('admin', undefined, undefined, undefined, undefined, undefined, tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${activeSection === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <tab.icon className={`h-5 w-5 ${activeSection === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              {tab.label}
              {tab.id === 'approvals' && pendingApprovals.length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              {profile?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.fullName || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-w-0">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {tabs.find(t => t.id === activeSection)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-slate-500 font-medium">Manage your platform efficiently</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => { signOut(); onNavigate?.('landing'); }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeSection === 'overview' && (
            <OverviewTab
              stats={stats}
              statsLoading={statsLoading}
              candidates={candidates}
              jobs={jobs}
              pendingApprovals={pendingApprovals}
              onNavigate={onNavigate}
            />
          )}

          {activeSection === 'candidates' && (
            <CandidatesTab
              candidates={candidates}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onViewProfile={(id) => handleViewProfile(id)}
              onUpdateCredits={handleUpdateCredits}
              onUpdateScore={handleUpdateScore}
              onDeleteCandidate={(candidate) => {
                setUserToDelete({ ...candidate, _userType: 'candidate' });
                setShowDeleteDialog(true);
              }}
              onSendInterview={handleSendInterview}
              onSendBulkEmail={handleSendBulkEmail}
              onExport={handleExportCandidates}
            />
          )}

          {activeSection === 'recruiters' && (
            <RecruitersTab
              recruiters={recruiters}
              loading={loading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onViewProfile={(id) => handleViewRecruiterProfile(id)}
              onDeleteRecruiter={handleDeleteRecruiter}
              onApproveRecruiter={handleApproveRecruiter}
              onExport={handleExportRecruiters}
            />
          )}

          {activeSection === 'approvals' && (
            <ApprovalsTab
              pendingApprovals={pendingApprovals}
              loading={loading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onApprove={handleApproveRecruiter}
              onReject={handleRejectRecruiter}
              onViewProfile={(id) => handleViewRecruiterProfile(id)}
              recruiters={recruiters}
              onExport={handleExportApprovals}
            />
          )}

          {activeSection === 'jobs' && (
            <JobsTab
              jobs={jobs}
              jobsLoading={jobsLoading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onExport={handleExportJobs}
            />
          )}

          {activeSection === 'verification' && (
            <VerificationTab
              verificationApps={verificationApplications}
              verificationLoading={verificationLoading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onApprove={handleApproveVerification}
              onReject={handleRejectVerification}
              onViewApplication={(app) => {
                console.log('View verification application:', app);
              }}
            />
          )}

          {activeSection === 'courses' && (
            <CoursesTab
              courses={courses}
              coursesLoading={coursesLoading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddCourse={handleAddCourse}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeSection === 'alerts' && (
            <AlertsTab
              alerts={alerts}
              alertsLoading={alertsLoading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddAlert={handleAddAlert}
              onEditAlert={handleEditAlert}
              onDeleteAlert={handleDeleteAlert}
            />
          )}

          {activeSection === 'ads' && (
            <AdsTab
              ads={ads}
              adsLoading={adsLoading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddAd={handleAddAd}
              onEditAd={handleEditAd}
              onDeleteAd={handleDeleteAd}
              onTogglePause={handleTogglePauseAd}
              onViewImage={(url) => {
                setSelectedImage(url);
                setShowImageModal(true);
              }}
              hasMore={adsHasMore}
              onLoadMore={handleLoadMoreAds}
            />
          )}

          {activeSection === 'notifications' && (
            <NotificationsTab
              contacts={contactSubmissions}
              contactsLoading={contactsLoading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onViewContact={handleViewContact}
              onDeleteContact={handleDeleteContact}
              onMarkAsRead={handleMarkAsRead}
            />
          )}
        </div>

        {/* Modals */}
        <DeleteDialog
          isOpen={showDeleteDialog}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleDeleteUser}
          onCancel={() => {
            setShowDeleteDialog(false);
            setUserToDelete(null);
          }}
        />

        <VerifyDialog
          isOpen={showVerifyDialog}
          onConfirm={handleVerifyCandidate}
          onCancel={() => {
            setShowVerifyDialog(false);
            setUserToVerify(null);
          }}
        />

        <ProfileModal
          isOpen={showProfileModal && !profileLoading}
          profile={selectedProfile}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProfile(null);
          }}
        />

        <CourseModal
          isOpen={showAddCourseModal || showEditCourseModal}
          isEditing={showEditCourseModal}
          formData={courseForm}
          onClose={() => {
            setShowAddCourseModal(false);
            setShowEditCourseModal(false);
            setSelectedCourse(null);
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            // Handle course submission
            setShowAddCourseModal(false);
            setShowEditCourseModal(false);
            fetchCourses();
          }}
          onChange={(data) => {
            const { title, description, instructor, duration, category, level, price, isFree, isFeatured, courseUrl, thumbnail } = data as any;
            setCourseForm(prev => ({
              ...prev,
              ...(title !== undefined && { title }),
              ...(description !== undefined && { description }),
              ...(instructor !== undefined && { instructor }),
              ...(duration !== undefined && { duration }),
              ...(category !== undefined && { category }),
              ...(level !== undefined && { level: level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' }),
              ...(price !== undefined && { price }),
              ...(isFree !== undefined && { isFree }),
              ...(isFeatured !== undefined && { isFeatured }),
              ...(courseUrl !== undefined && { courseUrl }),
              ...(thumbnail !== undefined && { thumbnail })
            }));
          }}
          onImageChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const base64 = await fileToBase64(file);
              setCourseForm({ ...courseForm, thumbnail: base64 });
            }
          }}
        />

        <AlertModal
          isOpen={showAddAlertModal || showEditAlertModal}
          isEditing={showEditAlertModal}
          formData={alertForm}
          onClose={() => {
            setShowAddAlertModal(false);
            setShowEditAlertModal(false);
            setSelectedAlert(null);
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            // Handle alert submission
            setShowAddAlertModal(false);
            setShowEditAlertModal(false);
            fetchAlerts();
          }}
          onChange={(data) => setAlertForm({ ...alertForm, ...data })}
        />

        <AdModal
          isOpen={showAddAdModal || showEditAdModal}
          isEditing={showEditAdModal}
          formData={adForm}
          onClose={() => {
            setShowAddAdModal(false);
            setShowEditAdModal(false);
            setSelectedAd(null);
          }}
          loading={adSubmitting}
          onSubmit={async (e) => {
            e.preventDefault();
            setAdSubmitting(true);
            try {
              const token = localStorage.getItem('token');
              const url = showEditAdModal && selectedAd
                ? `${API_BASE_URL}/api/admin/ads/${selectedAd._id}`
                : `${API_BASE_URL}/api/admin/ads`;

              const method = showEditAdModal ? 'PUT' : 'POST';

              const response = await fetch(url, {
                method,
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(adForm)
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save ad');
              }

              setShowAddAdModal(false);
              setShowEditAdModal(false);
              setSelectedAd(null);
              fetchAds();
            } catch (error) {
              console.error('Error saving ad:', error);
              alert(error instanceof Error ? error.message : 'Failed to save ad');
            } finally {
              setAdSubmitting(false);
            }
          }}
          onChange={(data) => setAdForm({ ...adForm, ...data })}
          onImageChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const base64 = await fileToBase64(file);
              setAdForm({ ...adForm, imageUrl: base64 });
            }
          }}
        />

        <ImageModal
          isOpen={showImageModal}
          imageUrl={selectedImage || ''}
          onClose={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        />

        <ContactViewModal
          isOpen={showContactModal}
          contact={selectedContact}
          onClose={() => {
            setShowContactModal(false);
            setSelectedContact(null);
          }}
        />

        {/* Reject Recruiter Dialog */}
        <RejectRecruiterDialog
          isOpen={showRejectDialog}
          recruiterName={recruiterToReject?.name || ''}
          rejectionReason={rejectionReason}
          onRejectionReasonChange={setRejectionReason}
          onConfirm={confirmRejectRecruiter}
          onCancel={() => {
            setShowRejectDialog(false);
            setRecruiterToReject(null);
            setRejectionReason('');
          }}
        />

        {/* Delete Course Dialog */}
        <DeleteDialog
          isOpen={showDeleteCourseModal}
          title="Delete Course"
          message={`Are you sure you want to delete "${selectedCourse?.title}"? This action cannot be undone.`}
          onConfirm={async () => {
            if (selectedCourse) {
              try {
                const response = await fetch(`${API_BASE_URL}/api/courses/${selectedCourse._id}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                  setShowDeleteCourseModal(false);
                  setSelectedCourse(null);
                  fetchCourses();
                }
              } catch (error) {
                console.error('Error deleting course:', error);
              }
            }
          }}
          onCancel={() => {
            setShowDeleteCourseModal(false);
            setSelectedCourse(null);
          }}
        />

        {/* Delete Alert Dialog */}
        <DeleteDialog
          isOpen={showDeleteAlertModal}
          title="Delete Alert"
          message="Are you sure you want to delete this alert?"
          onConfirm={async () => {
            if (selectedAlert) {
              try {
                const response = await fetch(`${API_BASE_URL}/api/admin/alerts/${selectedAlert._id}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                  setShowDeleteAlertModal(false);
                  setSelectedAlert(null);
                  fetchAlerts();
                }
              } catch (error) {
                console.error('Error deleting alert:', error);
              }
            }
          }}
          onCancel={() => {
            setShowDeleteAlertModal(false);
            setSelectedAlert(null);
          }}
        />

        {/* Delete Ad Dialog */}
        <DeleteDialog
          isOpen={showDeleteAdModal}
          title="Delete Ad"
          message="Are you sure you want to delete this ad?"
          onConfirm={async () => {
            if (selectedAd) {
              try {
                const response = await fetch(`${API_BASE_URL}/api/admin/ads/${selectedAd._id}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                  setShowDeleteAdModal(false);
                  setSelectedAd(null);
                  fetchAds();
                }
              } catch (error) {
                console.error('Error deleting ad:', error);
              }
            }
          }}
          onCancel={() => {
            setShowDeleteAdModal(false);
            setSelectedAd(null);
          }}
        />

        {/* Loading overlay for profile */}
        {showProfileModal && profileLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-8">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading profile...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
