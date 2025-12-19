import { useEffect, useState, useCallback } from 'react';
import {
  MapPin, Briefcase, ArrowLeft, Edit, X,
  CheckCircle, Shield, Building2, Share2, Clock, ArrowUpRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { getAuthHeaders, useAuth } from '../contexts/AuthContext';

interface Job {
  _id: string;
  jobDetails: {
    basicInfo: {
      jobTitle: string;
      department: string;
      numberOfOpenings: number;
      employmentType: string;
      workMode: string;
      jobLevel: string;
    };
    location: {
      city: string;
      state: string;
      country: string;
      officeAddress: string;
    };
    compensation: {
      salary: number;
      salaryType: string;
    };
    description: {
      roleSummary: string;
      responsibilities: string[];
      requiredSkills: string[];
    };
    qualifications: {
      minimumEducation: string;
      preferredEducation: string;
      yearsOfExperience: number;
    };
  };
  benefits: string[];
  status: string;
  applicationCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  postedBy: {
    _id: string;
    fullName?: string;
    profile: {
      fullName: string;
      company: {
        name: string;
        description: string;
        website?: string;
        logo?: string;
      };
    };
    recruiterOnboardingDetails?: {
      company?: {
        name?: string;
        description?: string;
        website?: string;
        logo?: string;
      };
    };
  };
}

interface JobDetailsPageProps {
  jobId: string;
  onNavigate: (page: string) => void;
}

export function JobDetailsPage({ jobId, onNavigate }: JobDetailsPageProps) {
  const { profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedJob, setEditedJob] = useState<Partial<Job>>({});

  // Application states
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    availability: ''
  });

  // Check if user has already applied
  const checkApplicationStatus = async () => {
    console.log('=== checkApplicationStatus called ===');
    console.log('Profile:', profile);
    console.log('Profile role:', profile?.role);

    if (profile?.role !== 'job_seeker') {
      console.log('Not a job seeker, skipping application check');
      return;
    }

    try {
      console.log('Checking application status for job:', jobId);
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/applications/my/my-applications`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        console.log('All applications:', result.data);
        const application = result.data.find((app: any) => app.job?._id === jobId);
        console.log('Found application for this job:', application);
        if (application) {
          console.log('Setting hasApplied=true, status=', application.status);
          setHasApplied(true);
          setApplicationStatus(application.status);
        } else {
          console.log('No application found, setting hasApplied=false');
          setHasApplied(false);
          setApplicationStatus(null);
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const loadJob = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);

      if (!response.ok) {
        // If API fails, show mock data for testing
        const mockJob = {
          _id: jobId,
          jobDetails: {
            basicInfo: {
              jobTitle: 'Mock Job Title',
              department: 'Engineering',
              numberOfOpenings: 1,
              employmentType: 'Full-time',
              workMode: 'Remote',
              jobLevel: 'Mid-level'
            },
            location: {
              city: 'New York',
              state: 'NY',
              country: 'USA',
              officeAddress: '123 Main St'
            },
            compensation: {
              salary: 100000,
              salaryType: 'yearly'
            },
            description: {
              roleSummary: 'This is a mock job description for testing purposes.',
              responsibilities: ['Mock responsibility 1', 'Mock responsibility 2'],
              requiredSkills: ['JavaScript', 'React', 'Node.js']
            },
            qualifications: {
              minimumEducation: 'Bachelor\'s Degree',
              preferredEducation: 'Master\'s Degree',
              yearsOfExperience: 3
            }
          },
          benefits: ['Health Insurance', '401k'],
          status: 'active',
          applicationCount: 5,
          views: 25,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          postedBy: {
            _id: 'mock-employer-id',
            profile: {
              fullName: 'Mock Employer',
              company: {
                name: 'Mock Company',
                description: 'A mock company for testing'
              }
            }
          }
        };

        setJob(mockJob);
        setEditedJob(mockJob);
        return;
      }

      const result = await response.json();
      console.log('API response data:', result);

      if (!result.success || !result.data) {
        throw new Error('Invalid API response');
      }

      setJob(result.data);
      setEditedJob(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [jobId, loadJob]);

  useEffect(() => {
    console.log('=== useEffect for checkApplicationStatus triggered ===');
    console.log('jobId:', jobId);
    console.log('profile:', profile);
    console.log('profile?.role:', profile?.role);

    if (profile && jobId) {
      console.log('Both profile and jobId exist, calling checkApplicationStatus...');
      checkApplicationStatus();
    } else {
      console.log('Missing profile or jobId:', { hasProfile: !!profile, hasJobId: !!jobId });
    }
  }, [jobId, profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedJob(job ? { ...job } : {});
  };

  const handleSaveEdit = async () => {
    if (!job) return;

    setSaving(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editedJob)
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      const result = await response.json();
      setJob(result);
      setIsEditing(false);
      alert('Job updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateEditedJob = (field: string, value: unknown) => {
    setEditedJob(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBasicInfo = (field: string, value: unknown) => {
    setEditedJob(prev => {
      // Create safe defaults if structure is missing
      const currentDetails = prev.jobDetails || {} as any;
      const currentBasicInfo = currentDetails.basicInfo || {};

      return {
        ...prev,
        jobDetails: {
          ...currentDetails,
          basicInfo: {
            ...currentBasicInfo,
            [field]: value
          }
        }
      } as Partial<Job>;
    });
  };

  const updateLocation = (field: string, value: unknown) => {
    setEditedJob(prev => {
      const currentDetails = prev.jobDetails || {} as any;
      const currentLocation = currentDetails.location || {};

      return {
        ...prev,
        jobDetails: {
          ...currentDetails,
          location: {
            ...currentLocation,
            [field]: value
          }
        }
      } as Partial<Job>;
    });
  };

  const updateDescription = (field: string, value: unknown) => {
    setEditedJob(prev => {
      const currentDetails = prev.jobDetails || {} as any;
      const currentDescription = currentDetails.description || {};

      return {
        ...prev,
        jobDetails: {
          ...currentDetails,
          description: {
            ...currentDescription,
            [field]: value
          }
        }
      } as Partial<Job>;
    });
  };

  const updateQualifications = (field: string, value: unknown) => {
    setEditedJob(prev => {
      const currentDetails = prev.jobDetails || {} as any;
      const currentQualifications = currentDetails.qualifications || {};

      return {
        ...prev,
        jobDetails: {
          ...currentDetails,
          qualifications: {
            ...currentQualifications,
            [field]: value
          }
        }
      } as Partial<Job>;
    });
  };

  const handleApplyNow = async () => {
    // Check if user is verified
    if (!profile?.isVerified) {
      alert('You need to be verified to apply for jobs. Please complete the verification process first.');
      return;
    }

    if (!applicationForm.coverLetter.trim()) {
      alert('Please provide a cover letter');
      return;
    }

    setApplying(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          jobId: jobId,
          coverLetter: applicationForm.coverLetter,
          availability: applicationForm.availability
        })
      });

      if (response.ok) {
        setHasApplied(true);
        setApplicationStatus('pending');
        setShowApplicationModal(false);
        alert('Application submitted successfully! The recruiter will review your application.');

        // Reload job to update application count
        await loadJob();
        // Refresh application status
        await checkApplicationStatus();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.jobDetails?.basicInfo?.jobTitle,
          text: `Check out this ${job?.jobDetails?.basicInfo?.jobTitle} role at ${job?.postedBy?.profile?.company?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Job link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading job: {error}</p>
            <Button onClick={() => onNavigate('jobs')} className="mr-4">
              Back to Jobs
            </Button>
            <Button onClick={loadJob} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-slate-600 mb-4">Job not found</p>
            <Button onClick={() => onNavigate('jobs')}>
              Back to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = profile?.role === 'employer' && job?.postedBy?._id === profile.id;
  const currentJob = isEditing ? editedJob : job;

  const companyWebsite = job.postedBy?.profile?.company?.website || job.postedBy?.recruiterOnboardingDetails?.company?.website;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Header Section */}
      <div className="bg-slate-900 pt-24 pb-32 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <button
            onClick={() => onNavigate(profile?.role === 'employer' ? 'recruiter-dashboard' : 'job-seeker-dashboard')}
            className="flex items-center text-slate-300 hover:text-white transition-colors mb-8 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Back to jobs</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
            {/* Large Logo */}
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl shadow-black/20 flex-shrink-0 relative overflow-hidden">
              <div className="w-full h-full rounded-[20px] bg-slate-50 flex items-center justify-center text-4xl font-bold text-slate-900">
                {job.postedBy?.profile?.company?.logo ? <img src={job.postedBy.profile.company.logo} alt="Company Logo" className="w-full h-full object-cover" /> : (job.postedBy?.recruiterOnboardingDetails?.company?.logo ? <img src={job.postedBy.recruiterOnboardingDetails.company.logo} alt="Company Logo" className="w-full h-full object-cover" /> : (job.postedBy?.profile?.company?.name?.charAt(0) || job.postedBy?.recruiterOnboardingDetails?.company?.name?.charAt(0) || 'C'))}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={currentJob.jobDetails?.basicInfo?.jobTitle || ''}
                    onChange={(e) => updateBasicInfo('jobTitle', e.target.value)}
                    className="text-3xl md:text-4xl font-bold text-white bg-transparent border-b border-white/20 focus:border-white outline-none w-full"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{job.jobDetails?.basicInfo?.jobTitle}</h1>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-300 text-sm md:text-base font-medium">
                <span className="flex items-center gap-2 text-white">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  {job.postedBy?.profile?.company?.name || job.postedBy?.recruiterOnboardingDetails?.company?.name || 'Confidential Company'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.jobDetails?.location?.city}, {job.jobDetails?.location?.country}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {job.jobDetails?.basicInfo?.employmentType}
                </span>
              </div>
            </div>

            {/* Header Actions (Edit) */}
            <div className="flex items-center gap-3">
              {isOwner && !isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all backdrop-blur-sm border border-white/10"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <button onClick={handleCancelEdit} disabled={saving} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm">Cancel</button>
                  <button onClick={handleSaveEdit} disabled={saving} className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/25">Save</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. Job Description Card */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                About the Role
              </h2>

              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                {isEditing ? (
                  <Textarea
                    value={currentJob.jobDetails?.description?.roleSummary || ''}
                    onChange={(e) => updateDescription('roleSummary', e.target.value)}
                    rows={6}
                    className="w-full"
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{job.jobDetails?.description?.roleSummary}</p>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Responsibilities</h3>
                {isEditing ? (
                  <Textarea
                    value={currentJob.jobDetails?.description?.responsibilities?.join('\n') || ''}
                    onChange={(e) => updateDescription('responsibilities', e.target.value.split('\n').filter(r => r.trim()))}
                    rows={6}
                    className="w-full"
                  />
                ) : (
                  <ul className="space-y-3">
                    {job.jobDetails?.description?.responsibilities?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 2. Skills & Requirements Card */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Skills & Requirements
              </h2>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Required Skills</h3>
                {isEditing ? (
                  <Textarea
                    value={currentJob.jobDetails?.description?.requiredSkills?.join('\n') || ''}
                    onChange={(e) => updateDescription('requiredSkills', e.target.value.split('\n').filter(s => s.trim()))}
                    rows={4}
                    className="w-full"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {job.jobDetails?.description?.requiredSkills?.map((skill, i) => (
                      <div key={i} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Experience</p>
                  {isEditing ? (
                    <input type="number"
                      value={currentJob.jobDetails?.qualifications?.yearsOfExperience || 0}
                      onChange={(e) => updateQualifications('yearsOfExperience', parseInt(e.target.value))}
                      className="w-full p-2 rounded border"
                    />
                  ) : (
                    <p className="text-slate-900 font-bold">{job.jobDetails?.qualifications?.yearsOfExperience}+ Years</p>
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Education</p>
                  {isEditing ? (
                    <select
                      value={currentJob.jobDetails?.qualifications?.minimumEducation || ''}
                      onChange={(e) => updateQualifications('minimumEducation', e.target.value)}
                      className="w-full p-2 rounded border"
                    >
                      <option value="high-school">High School</option>
                      <option value="bachelors">Bachelor's</option>
                      <option value="masters">Master's</option>
                    </select>
                  ) : (
                    <p className="text-slate-900 font-bold capitalize">{job.jobDetails?.qualifications?.minimumEducation?.replace('-', ' ')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Benefits Card (Conditional) */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  Perks & Benefits
                </h2>
                {isEditing ? (
                  <Textarea
                    value={currentJob.benefits?.join('\n') || ''}
                    onChange={(e) => updateEditedJob('benefits', e.target.value.split('\n').filter(b => b.trim()))}
                    rows={4}
                    className="w-full"
                  />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {job.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100/50 text-purple-900 font-medium text-sm">
                        <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* 1. Primary Action Card (Apply) */}
              <div className="bg-white rounded-[24px] p-6 shadow-lg shadow-blue-900/5 border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Salary Range</p>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input type="number"
                          value={currentJob.jobDetails?.compensation?.salary || 0}
                          onChange={(e) => setEditedJob(prev => ({ ...prev, jobDetails: { ...prev.jobDetails, compensation: { ...prev.jobDetails?.compensation, salary: parseInt(e.target.value) } } }) as Partial<Job>)}
                          className="w-24 p-1 border rounded"
                        />
                        <select
                          value={currentJob.jobDetails?.compensation?.salaryType || 'yearly'}
                          onChange={(e) => setEditedJob(prev => ({ ...prev, jobDetails: { ...prev.jobDetails, compensation: { ...prev.jobDetails?.compensation, salaryType: e.target.value } } }) as Partial<Job>)}
                          className="w-24 p-1 border rounded"
                        >
                          <option value="yearly">Yearly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-slate-900">
                        {job.jobDetails?.compensation?.salary > 0
                          ? `₹${job.jobDetails.compensation.salary.toLocaleString()}`
                          : 'Negotiable'}
                        <span className="text-sm font-medium text-slate-400 font-normal ml-1">
                          /{job.jobDetails?.compensation?.salaryType || 'year'}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-green-50 text-green-700 font-bold text-xs uppercase tracking-wide">
                    {job.status}
                  </div>
                </div>

                {profile && !isOwner && (
                  <div className="space-y-3">
                    {!profile?.isVerified ? (
                      <Button
                        onClick={() => alert('Verification required.')}
                        className="w-full py-4 text-base font-bold bg-slate-900 text-white hover:bg-black rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
                      >
                        Verify to Apply
                      </Button>
                    ) : hasApplied ? (
                      <div className="w-full py-4 text-center rounded-xl bg-green-50 text-green-700 font-bold border border-green-100 flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Application {applicationStatus || 'Sent'}
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowApplicationModal(true)}
                        className="w-full py-4 text-base font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                      >
                        Apply Now
                      </Button>
                    )}

                    <button
                      onClick={handleShare}
                      className="w-full py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" /> Share Job
                    </button>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                  <div className="text-center p-3 rounded-xl bg-slate-50">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Views</p>
                    <p className="text-slate-900 font-bold">{job.views || 0}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Applied</p>
                    <p className="text-slate-900 font-bold">{job.applicationCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* 2. Company Info Card */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">About the Company</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600">
                    {job.postedBy?.profile?.company?.logo ? <img src={job.postedBy.profile.company.logo} alt="Company Logo" className="w-full h-full object-cover" /> : (job.postedBy?.recruiterOnboardingDetails?.company?.logo ? <img src={job.postedBy.recruiterOnboardingDetails.company.logo} alt="Company Logo" className="w-full h-full object-cover" /> : (job.postedBy?.profile?.company?.name?.charAt(0) || job.postedBy?.recruiterOnboardingDetails?.company?.name?.charAt(0) || 'C'))}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{job.postedBy?.profile?.company?.name || job.postedBy?.recruiterOnboardingDetails?.company?.name || 'Confidential Company'}</p>
                    <p className="text-xs text-slate-500">Technology • 50-200 Employees</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {job.postedBy?.profile?.company?.description || job.postedBy?.recruiterOnboardingDetails?.company?.description || "We are a leading company in our field, dedicated to innovation and excellence."}
                </p>
                <a
                  href={companyWebsite ? (
                    companyWebsite.startsWith('http')
                      ? companyWebsite
                      : `https://${companyWebsite}`
                  ) : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${companyWebsite
                    ? 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed hover:bg-transparent'
                    }`}
                  onClick={(e) => {
                    if (!companyWebsite) {
                      e.preventDefault();
                    }
                  }}
                >
                  Visit Website <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Application Modal (Preserved Logic) */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl animate-in fade-in zoom-in-95 duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Apply for this position</h2>
                <p className="text-slate-500 text-sm mt-1">{job?.jobDetails?.basicInfo?.jobTitle} at {job.postedBy?.profile?.company?.name}</p>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  placeholder="Tell the employer why you're a great fit..."
                  rows={6}
                  className="w-full rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                />
                <p className="text-xs text-slate-400 mt-2 font-medium">Explain your relevant experience and interest.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Availability
                </label>
                <Select
                  value={applicationForm.availability}
                  onChange={(e) => setApplicationForm({ ...applicationForm, availability: e.target.value })}
                  className="w-full rounded-xl border-slate-200"
                >
                  <option value="">Select availability...</option>
                  <option value="immediately">Immediately</option>
                  <option value="2-weeks">2 weeks notice</option>
                  <option value="1-month">1 month notice</option>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800 leading-relaxed font-medium">
                  Your profile, resume, and contact details will be shared with the recruiter automatically upon submission.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowApplicationModal(false)}
                  disabled={applying}
                  className="flex-1 py-3 rounded-xl font-bold border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyNow}
                  disabled={applying || !applicationForm.coverLetter.trim()}
                  className="flex-1 py-3 rounded-xl font-bold bg-slate-900 hover:bg-black text-white"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
