import { useEffect, useState } from 'react';
import {
  Heart, Search, MapPin, Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Job } from './types';

export function JobSeekerSavedJobs({ onNavigate }: JobSeekerPageProps) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedJobsLoading, setSavedJobsLoading] = useState(true);

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setSavedJobsLoading(true);
        const response = await fetch(getApiUrl('/api/jobs/saved/my-saved-jobs'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          const transformedJobs = data.data.map((job: any) => ({
            id: job._id,
            title: job.jobDetails?.basicInfo?.jobTitle || 'Untitled Position',
            company: {
              name: job.postedBy?.profile?.company?.name ||
                job.postedBy?.recruiterOnboardingDetails?.company?.name ||
                (job.postedBy?.fullName ? `${job.postedBy.fullName}'s Company` : 'Confidential Company'),
              logo: job.postedBy?.profile?.company?.logo ||
                job.postedBy?.recruiterOnboardingDetails?.company?.logo ||
                job.postedBy?.profile?.company?.name?.charAt(0) || '?'
            },
            location: job.jobDetails?.location?.city || 'Remote',
            job_type: job.jobDetails?.basicInfo?.employmentType || 'Full-time',
            salary_min: job.jobDetails?.compensation?.salary || 0,
            salary_max: job.jobDetails?.compensation?.salary,
            category: job.jobDetails?.basicInfo?.department || 'General',
            description: job.jobDetails?.description?.roleSummary?.substring(0, 150) + '...' || '',
            posted_date: new Date(job.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
          }));
          setSavedJobs(transformedJobs);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setSavedJobsLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  // Remove from saved
  const handleUnsaveJob = async (jobId: string) => {
    try {
      const response = await fetch(getApiUrl(`/api/jobs/${jobId}/unsave`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      }
    } catch (error) {
      console.error('Error removing job from saved:', error);
    }
  };

  if (savedJobsLoading) {
    return (
      <div className="space-y-10 pb-12">
        <div className="relative overflow-hidden rounded-[32px] bg-slate-900/50 p-8 md:p-12 h-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col h-full bg-white border border-slate-100 rounded-[24px] overflow-hidden p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-2 mt-auto">
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-4 text-pink-200">
            <Heart className="w-3 h-3 fill-current" /> Bookmarked
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Saved Opportunities
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            Keep track of jobs you're interested in. Apply when you're ready.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          Your Bookmarks <span className="text-slate-400 font-medium ml-1 text-sm bg-slate-100 px-2 py-0.5 rounded-full">{savedJobs.length}</span>
        </h2>
      </div>

      {savedJobs.length === 0 ? (
        <Card className="p-16 text-center border border-slate-100 bg-white rounded-[24px] shadow-sm">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-pink-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs saved yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
            Browse our job listings and tap the heart icon to save positions you want to revisit later.
          </p>
          <Button
            onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'browse')}
            className="bg-slate-900 text-white hover:bg-black font-bold px-8 py-3 rounded-xl shadow-lg shadow-slate-900/10"
          >
            <Search className="mr-2 h-4 w-4" />
            Browse Jobs
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <Card
              key={job.id}
              className="group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full bg-white border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] overflow-hidden"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl font-bold text-slate-700 overflow-hidden relative z-10">
                    {typeof job.company.logo === 'string' && job.company.logo.length > 2
                      ? <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                      : job.company.name.charAt(0)}
                  </div>
                  <button
                    onClick={() => handleUnsaveJob(job.id)}
                    className="p-2.5 bg-pink-50 text-pink-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors shadow-sm"
                    title="Remove from saved"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-500">{job.company.name}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {job.job_type}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Salary</p>
                  <p className="text-sm font-black text-slate-900">
                    {job.salary_min > 0
                      ? `₹${(job.salary_min / 100000).toFixed(1)}L - ${(job.salary_max / 100000).toFixed(1)}L`
                      : 'Negotiable'}
                  </p>
                </div>
                <Button
                  onClick={() => onNavigate('job-details', job.id)}
                  className="bg-slate-900 hover:bg-black text-white font-bold text-sm h-10 px-6 rounded-xl transition-all shadow-md shadow-slate-900/10"
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobSeekerSavedJobs;
