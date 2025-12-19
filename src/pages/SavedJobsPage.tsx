import { useEffect, useState, useCallback } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  category: string;
  salary_min: number;
  salary_max: number;
  company: { name: string };
}

interface SavedJobsPageProps {
  onNavigate: (page: string, jobId?: string) => void;
}

export function SavedJobsPage({ onNavigate }: SavedJobsPageProps) {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedJobs = useCallback(async () => {
    if (!profile) return;

    // Dummy data - Supabase removed
    const dummyJobs: Job[] = [
      {
        id: '1',
        title: 'Software Engineer',
        description: 'Develop web applications',
        location: 'New York',
        job_type: 'full-time',
        category: 'technology',
        salary_min: 80000,
        salary_max: 120000,
        company: { name: 'Tech Corp' }
      }
    ];
    setJobs(dummyJobs);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);



  const handleRemove = async (jobId: string) => {
    if (!profile) return;

    // Dummy implementation - Supabase removed
    setJobs(jobs.filter(j => j.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('job-seeker-dashboard')}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Saved Jobs</h1>

        {loading ? (
          <p className="text-slate-600">Loading saved jobs...</p>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">You haven't saved any jobs yet</p>
            <Button onClick={() => onNavigate('jobs')}>Browse Jobs</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} hover onClick={() => onNavigate('job-details', job.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-slate-100 flex items-center justify-center text-slate-700 font-semibold flex-shrink-0">
                      {job.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">{job.title}</h3>
                      <p className="text-slate-600 mb-3">{job.company?.name}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.job_type}</span>
                        {job.salary_min > 0 && (
                          <>
                            <span>•</span>
                            <span>${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0 space-y-2">
                    <Button size="sm" fullWidth>View Details</Button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(job.id); }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}