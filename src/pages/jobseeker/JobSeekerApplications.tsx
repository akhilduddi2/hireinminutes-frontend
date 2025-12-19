import { useEffect, useState } from 'react';
import {
  Briefcase, Clock, MapPin, FileText, Search,
  CheckCircle, XCircle, ChevronDown
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Application } from './types';

export function JobSeekerApplications({ onNavigate }: JobSeekerPageProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setApplicationsLoading(true);
        const response = await fetch(getApiUrl('/api/applications/my/my-applications'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          const transformedApplications = data.data.map((app: any) => ({
            id: app._id,
            status: app.status,
            created_at: app.createdAt,
            last_updated: app.updatedAt,
            job: {
              id: app.job?._id || '',
              title: app.job?.title || 'Position Closed',
              company: {
                name: app.job?.recruiter?.companyName || 'Company',
                logo: app.job?.recruiter?.companyLogo || app.job?.recruiter?.companyName?.charAt(0)?.toUpperCase() || '?',
              },
              location: app.job?.location || 'Location not specified',
              job_type: app.job?.jobType || 'Full-time',
              salary_min: app.job?.salaryMin || 0,
              salary_max: app.job?.salaryMax || 0,
              description: app.job?.description || '',
              skills_required: app.job?.skillsRequired || [],
            },
          }));
          setApplications(transformedApplications);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  if (applicationsLoading) {
    return (
      <div className="space-y-10 pb-12">
        {/* Skeleton Header */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] bg-slate-900/50 p-6 sm:p-8 md:p-12 h-64 animate-pulse">
        </div>

        {/* Skeleton Stats */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 flex-1 rounded-xl" />)}
        </div>

        {/* Skeleton Table */}
        <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden p-6 space-y-4">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-10 w-72 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0">
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-4 w-32 hidden sm:block" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Glassmorphic Header - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] bg-slate-900 text-white p-6 sm:p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-blue-200">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Application Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3">
              My Applications
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              Track and manage your job application history
            </p>
          </div>
          <Button
            onClick={() => onNavigate('job-seeker-dashboard/browse')}
            className="bg-white hover:bg-slate-100 font-bold px-5 sm:px-8 py-3 h-12 sm:h-auto rounded-xl shadow-lg transition-all text-sm sm:text-base"
          >
            <Search className="w-4 h-4 mr-2 text-slate-900" />
            <span className="text-slate-900">Browse More Jobs</span>
          </Button>
        </div>
      </div>

      {/* Controls & Stats */}
      <Card className="p-2 shadow-lg shadow-slate-200/50 border border-slate-100 bg-white rounded-[24px]">
        <div className="flex flex-wrap items-center gap-2 p-1">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2
                ${activeTab === tab
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
              `}
            >
              <span className="capitalize">{tab}</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs
                ${activeTab === tab ? 'bg-slate-100 text-slate-900' : 'bg-slate-200 text-slate-600'}
              `}>
                {stats[tab]}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Main Table Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{filteredApplications.length}</span> applications
            </span>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <Card className="py-16 flex flex-col items-center text-center border-dashed border-2 border-slate-200 bg-slate-50/30">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No applications found</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              {searchTerm
                ? `No applications match "${searchTerm}"`
                : activeTab === 'all'
                  ? "You haven't applied to any jobs yet. Start your journey today!"
                  : `You don't have any ${activeTab} applications.`}
            </p>
            {activeTab === 'all' && !searchTerm && (
              <Button onClick={() => onNavigate('job-seeker-dashboard/browse')}>
                Explore Opportunities
              </Button>
            )}
          </Card>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <table className="w-full relative">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider shadow-sm">
                    <th className="px-6 py-4">Role & Company</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 border border-slate-200 shrink-0">
                            {typeof app.job.company.logo === 'string' && app.job.company.logo.length > 2
                              ? <img src={app.job.company.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                              : app.job.company.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                              {app.job.title}
                            </h3>
                            <p className="text-sm text-slate-500">{app.job.company.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(app.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {app.job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onNavigate('job-details', app.job.id)}
                          className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <span className="hidden sm:inline mr-2">View Details</span>
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Page <span className="font-semibold text-slate-900">1</span> of <span className="font-semibold text-slate-900">1</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="text-slate-400 hover:text-slate-400 cursor-not-allowed">Previous</Button>
                <Button variant="outline" size="sm" disabled className="text-slate-400 hover:text-slate-400 cursor-not-allowed">Next</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center text-xs text-slate-400 font-medium tracking-wide uppercase pt-8">
        Koderspark • Career Management System
      </div>
    </div>
  );
}

export default JobSeekerApplications;
