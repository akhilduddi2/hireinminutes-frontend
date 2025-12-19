import { useEffect, useState, useCallback } from 'react';
import {
  MapPin, DollarSign, CheckCircle, XCircle, Eye,
  FileText, Share2, Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { getApiUrl } from '../../config/api';
import { useAuth, getAuthHeaders } from '../../contexts/AuthContext';
import { Job, Application, JobSeekerPageProps } from './types';

import { Skeleton } from '../../components/ui/Skeleton';
import { SkillPassport } from '../../components/candidate/SkillPassport';

export function JobSeekerOverview({ onNavigate }: JobSeekerPageProps) {
  const { profile } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [, setVerificationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [showShareModal, setShowShareModal] = useState(false);

  const [shareUrl, setShareUrl] = useState('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const profileCompletion = () => {
    let completion = 0;
    if (profile?.fullName) completion += 15;
    if (profile?.email) completion += 15;
    if (profile?.profile?.location?.city) completion += 10;
    if (profile?.profile?.professionalSummary) completion += 15;
    if (profile?.profile?.skills && profile.profile.skills.length > 0) completion += 15;
    if (profile?.profile?.experience && profile.profile.experience.length > 0) completion += 15;
    if (profile?.profile?.documents?.resume) completion += 15;
    return Math.min(completion, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  /*
  const handleVerificationApplication = async () => {
    if (verificationStatus === 'pending' || isSubmittingVerification) return;

    setIsSubmittingVerification(true);
    try {
      const response = await fetch(getApiUrl('/api/auth/verification-application'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message: 'I would like to apply for verification to increase my credibility on the platform.'
        })
      });

      if (response.ok) {
        setVerificationStatus('pending');
        alert('Verification application submitted successfully! Your application is now under review.');
        await refreshProfile();
      } else {
        const error = await response.json();
        alert(`Error submitting verification application: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting verification application:', error);
      alert('Failed to submit verification application. Please try again.');
    } finally {
      setIsSubmittingVerification(false);
    }
  };
  */

  const handleShareProfile = async () => {
    if (!profile) {
      alert('Profile not loaded yet. Please refresh the page.');
      return;
    }

    let slug = profile.slug;

    if (!slug) {
      if (profile.fullName) {
        slug = profile.fullName
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      } else {
        alert('Please complete your profile with your full name first.');
        return;
      }
    }

    const url = `${window.location.origin}/c/${slug}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const checkVerificationStatus = useCallback(async () => {
    try {
      if (profile?.isVerified) {
        setVerificationStatus('none');
        return;
      }

      const response = await fetch(getApiUrl('/api/auth/verification-status'), {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setVerificationStatus(data.data.status || 'none');
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  }, [profile]);

  const loadDashboardData = useCallback(async () => {
    // Load dummy/sample data for recommended jobs
    // Load recommended jobs from API
    try {
      const jobsResponse = await fetch(getApiUrl('/api/jobs?limit=3'), {
        headers: getAuthHeaders()
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        const mappedJobs = (jobsData.data || []).map((job: any) => ({
          id: job._id,
          title: job.jobDetails?.basicInfo?.jobTitle || 'Untitled Position',
          description: job.jobDetails?.description?.roleSummary || '',
          location: job.jobDetails?.location ?
            `${job.jobDetails.location.city || ''}` : 'Remote',
          job_type: job.jobDetails?.basicInfo?.employmentType || 'Full-time',
          category: job.jobDetails?.basicInfo?.department || 'Technology',
          salary_min: job.jobDetails?.compensation?.salary || 0,
          salary_max: job.jobDetails?.compensation?.salary,
          company: {
            name: job.postedBy?.profile?.company?.name ||
              job.postedBy?.recruiterOnboardingDetails?.company?.name ||
              (job.postedBy?.profile?.fullName ? `${job.postedBy.profile.fullName}'s Company` : '') ||
              (job.postedBy?.fullName ? `${job.postedBy.fullName}'s Company` : '') ||
              'Confidential Company',
            logo: job.postedBy?.profile?.company?.logo || job.postedBy?.recruiterOnboardingDetails?.company?.logo || job.postedBy?.profile?.company?.name?.charAt(0).toUpperCase() || job.postedBy?.recruiterOnboardingDetails?.company?.name?.charAt(0).toUpperCase() || '?'
          },
          match_score: 85, // Placeholder as we don't have matching engine yet
          skills_required: job.jobDetails?.description?.requiredSkills || [],
          posted_date: new Date(job.createdAt).toLocaleDateString()
        }));
        setRecommendedJobs(mappedJobs);
      }
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
    }

    // Load applications from API
    if (profile) {
      try {
        const response = await fetch(getApiUrl('/api/applications/my/my-applications?limit=5'), {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          const mappedApplications = (data.data || []).map((app: any) => ({
            id: app._id,
            job: {
              id: app.job?._id || '',
              title: app.job?.jobDetails?.basicInfo?.jobTitle || 'Untitled Job',
              description: app.job?.jobDetails?.description?.roleSummary || '',
              location: `${app.job?.jobDetails?.location?.city || ''}, ${app.job?.jobDetails?.location?.state || ''}`,
              job_type: app.job?.jobDetails?.basicInfo?.employmentType || 'Full-time',
              category: app.job?.jobDetails?.basicInfo?.department || 'General',
              salary_min: app.job?.jobDetails?.compensation?.salary || 0,
              salary_max: app.job?.jobDetails?.compensation?.salary || 0,
              company: {
                name: app.job?.recruiter?.companyName || 'Company',
                logo: app.job?.recruiter?.companyName?.charAt(0) || 'C'
              },
              match_score: 85,
              skills_required: app.job?.jobDetails?.description?.requiredSkills || [],
              posted_date: new Date(app.job?.createdAt).toLocaleDateString()
            },
            status: app.status,
            created_at: app.createdAt,
            last_updated: app.updatedAt
          }));
          setApplications(mappedApplications);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
      }
    }

    await checkVerificationStatus();
    setIsLoadingData(false);
  }, [profile, checkVerificationStatus]);

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile, loadDashboardData]);

  const navigateToSection = (section: string) => {
    localStorage.setItem('jobSeekerActiveSection', section);
    window.history.pushState({}, '', `/job-seeker-dashboard/${section}`);
    onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, section);
  };

  // Premium Stat Card Component
  const StatCard = ({ label, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform scale-150`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-4 md:mb-6`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
        {subtext && <p className="text-xs text-slate-400 font-medium">{subtext}</p>}
      </div>
    </div>
  );



  return (
    <div className="space-y-10 pb-12">

      {/* Glassmorphic Header - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] bg-slate-900 text-white p-6 sm:p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-blue-200">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3">
              Overview
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              Welcome back, <span className="text-white font-bold">{profile?.fullName || 'Job Seeker'}</span>. Here's what's happening.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button size="sm" variant="outline" className="h-12 w-12 sm:h-11 sm:w-11 rounded-full border-2 border-white/40 p-0 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all" onClick={handleShareProfile}>
              <Share2 className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
            </Button>
            <Button size="sm" className="bg-white/20 text-white hover:bg-white/30 border-2 border-white/40 backdrop-blur-md rounded-full px-5 sm:px-6 h-12 sm:h-11 font-bold transition-all text-sm sm:text-base" onClick={() => navigateToSection('profile')}>
              Edit Profile
            </Button>
            <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-5 sm:px-6 h-12 sm:h-11 shadow-lg font-bold transition-all text-sm sm:text-base" onClick={() => navigateToSection('browse')}>
              <span className="text-slate-900">Find Jobs</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
        <StatCard
          label="Total Applied"
          value={applications.length}
          icon={FileText}
          color="bg-blue-600"
          subtext="Lifetime applications"
        />
        <StatCard
          label="Interviews"
          value="2"
          icon={Calendar}
          color="bg-purple-600"
          subtext="Upcoming this week"
        />


        <div className="md:col-span-1">
          <SkillPassport />
        </div>
      </div>

      {/* ... rest of the grid ... */}

      {/* ... Share Modal ... */}




      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Main Column (Feed) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">

          {/* Recent Applications Section */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">Recent Applications</h3>
                <p className="text-slate-500 text-sm mt-1">Track your job application status</p>
              </div>
              <Button size="sm" variant="ghost" className="rounded-full px-4 !border !border-slate-200 !text-slate-600 hover:!text-blue-600 hover:!border-blue-200 hover:!bg-blue-50" onClick={() => navigateToSection('applications')}>
                View All
              </Button>
            </div>

            {isLoadingData ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-48 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-slate-900 font-medium mb-1">No applications yet</h4>
                <p className="text-slate-500 text-sm mb-6">Start applying to jobs to track them here.</p>
                <Button size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 rounded-full" onClick={() => navigateToSection('browse')}>Browse Jobs</Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="p-5 md:p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer" onClick={() => onNavigate('job-details', app.job.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg shadow-inner flex-shrink-0">
                        {app.job.company.logo}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{app.job.title}</h4>
                        <p className="text-sm text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="font-medium text-slate-700">{app.job.company.name}</span>
                          <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-xs sm:text-sm">{new Date(app.created_at).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                      <span className="sm:hidden text-xs font-medium text-slate-400">Status:</span>
                      <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(app.status).replace('bg-', 'bg-opacity-10 border-').replace('text-', 'bg-').replace('text-', 'border-')}`}>
                        {app.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Jobs Section */}
          <div>
            <div className="flex items-end justify-between mb-4 md:mb-6 px-2">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">Recommended Jobs</h3>
                <p className="text-slate-500 text-sm mt-1">Based on your profile and skills</p>
              </div>
              <Button size="sm" variant="ghost" className="rounded-full px-4 !border !border-slate-200 !text-slate-600 hover:!text-blue-600 hover:!border-blue-200 hover:!bg-blue-50" onClick={() => navigateToSection('browse')}>
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {isLoadingData ? (
                <>
                  <Skeleton className="h-24 rounded-3xl" />
                  <Skeleton className="h-24 rounded-3xl" />
                  <Skeleton className="h-24 rounded-3xl" />
                </>
              ) : recommendedJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 group cursor-pointer" onClick={() => onNavigate('job-details', job.id)}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex gap-4 md:gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl shadow-sm border border-slate-100 flex-shrink-0">
                        {job.company.logo}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <p className="text-slate-600 font-medium text-sm mb-3">{job.company.name}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100 flex items-center gap-1.5">
                            <DollarSign className="w-3 h-3 text-slate-400" /> ₹{(job.salary_min / 100000).toFixed(1)}L - ₹{(job.salary_max / 100000).toFixed(1)}L
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="w-full sm:w-auto rounded-full px-5 !border !border-slate-200 !text-slate-600 group-hover:!bg-blue-600 group-hover:!text-white group-hover:!border-blue-600 transition-colors mt-2 sm:mt-0">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6 md:space-y-8">



          {/* Profile Strength Widget */}
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-48 h-48 rounded-full border-[16px] border-white/20"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Profile Strength</h3>
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-blue-300">
                  {profileCompletion()}% Completed
                </div>
              </div>

              <div className="relative w-full bg-slate-800 rounded-full h-3 mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${profileCompletion()}%` }}></div>
              </div>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                A complete profile increases your chances of getting hired by <span className="text-white font-bold">3x</span>.
              </p>

              <Button size="sm" className="w-full !bg-white !text-slate-900 hover:!bg-slate-100 border-0 font-bold rounded-xl h-10" onClick={() => navigateToSection('profile')}>
                Complete Profile
              </Button>
            </div>
          </div>



        </div>
      </div>

      {/* Share Profile Modal (Preserved) */}
      {
        showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowShareModal(false)}></div>
            <div className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]`}>
              <div className="bg-slate-900 p-6 md:p-8 flex justify-between items-center text-white relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20"></div>
                <h3 className="font-bold flex items-center gap-3 text-lg md:text-xl relative z-10"><Share2 className="w-5 h-5 md:w-6 md:h-6" /> Share Profile</h3>
                <button onClick={() => setShowShareModal(false)} className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors"><XCircle className="w-6 h-6" /></button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto">
                <div className="bg-slate-50 rounded-2xl p-4 md:p-6 mb-6 border border-slate-200">
                  <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Public Profile Link</p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-600 outline-none focus:border-blue-500 transition-colors w-full min-w-0"
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="bg-slate-900 text-white hover:bg-black rounded-xl px-6 py-3 font-bold whitespace-nowrap"
                    >
                      {copiedToClipboard ? <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Copied</span> : 'Copy'}
                    </Button>
                  </div>
                </div>
                <p className="text-center text-slate-500 text-xs md:text-sm leading-relaxed">Anyone with this link can view your verified profile.</p>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
