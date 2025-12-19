import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: string;
  status: string;
  created_at: string;
  cover_letter: string;
  job: { title: string };
  applicant: { full_name: string; email: string; phone?: string; resume_url: string };
}

interface ApplicantsPageProps {
  onNavigate: (page: string) => void;
}

export function ApplicantsPage({ onNavigate }: ApplicantsPageProps) {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const loadApplications = useCallback(async () => {
    if (!profile) return;

    // Dummy data - Supabase removed
    const dummyApplications: Application[] = [
      {
        id: '1',
        status: 'pending',
        created_at: new Date().toISOString(),
        cover_letter: 'I am interested in this position...',
        job: { title: 'Software Engineer' },
        applicant: { full_name: 'John Doe', email: 'john@example.com', resume_url: '' }
      }
    ];
    setApplications(dummyApplications);
    setLoading(false);
  }, [profile]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    // Dummy implementation - Supabase removed
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('recruiter-dashboard')}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Applicants</h1>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Applications' },
              { value: 'pending', label: 'Pending' },
              { value: 'reviewed', label: 'Reviewed' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
        </div>

        {loading ? (
          <p className="text-slate-600">Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <Card className="text-center py-12">
            <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No applications found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-slate-200 flex items-center justify-center text-slate-700 font-semibold flex-shrink-0">
                      {application.applicant?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{application.applicant?.full_name}</h3>
                      <p className="text-slate-600 mb-1">{application.job?.title}</p>
                      <p className="text-sm text-slate-600 mb-3">
                        Applied {new Date(application.created_at).toLocaleDateString()}
                      </p>

                      {application.cover_letter && (
                        <div className="bg-slate-50 p-3 rounded mb-3">
                          <p className="text-sm font-medium text-slate-600 mb-1">Cover Letter:</p>
                          <p className="text-sm text-slate-600 line-clamp-2">{application.cover_letter}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {application.applicant?.email && (
                          <a
                            href={`mailto:${application.applicant.email}`}
                            className="text-sm text-slate-900 hover:underline"
                          >
                            Email
                          </a>
                        )}
                        {application.applicant?.phone && (
                          <a
                            href={`tel:${application.applicant.phone}`}
                            className="text-sm text-slate-900 hover:underline"
                          >
                            Call
                          </a>
                        )}
                        {application.applicant?.resume_url && (
                          <a
                            href={application.applicant.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-900 hover:underline"
                          >
                            View Resume
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <Select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application.id, e.target.value)}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'reviewed', label: 'Reviewed' },
                        { value: 'accepted', label: 'Accepted' },
                        { value: 'rejected', label: 'Rejected' },
                      ]}
                    />
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