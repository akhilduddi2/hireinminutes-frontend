import {
  Briefcase, Users, Clock, PlusCircle, Search, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { RecruiterPageProps, Application, Job } from './types';
import { useAuth } from '../../contexts/AuthContext';

interface RecruiterOverviewProps extends RecruiterPageProps {
  applications: Application[];
  myJobs: Job[];
  stats?: {
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    totalJobs?: number;
    closedJobs?: number;
    totalViews?: number;
    shortlistedApplications?: number;
    rejectedApplications?: number;
    hiredApplications?: number;
  };
}

export function RecruiterOverview({
  onNavigate,
  applications,
  myJobs,
  stats
}: RecruiterOverviewProps) {
  const { profile } = useAuth();

  // Use provided stats or fallback to calculating from lists (only works if lists are full, but graceful degradation)
  const activeJobs = stats?.activeJobs ?? myJobs.filter(j => j.status === 'active').length;
  const totalApplications = stats?.totalApplications ?? applications.length; // Uses total from stats, not list length
  const pendingApplications = stats?.pendingApplications ?? applications.filter(a => a.status === 'pending').length;

  // Lists are already sorted and limited from backend
  const recentApplications = applications;

  const handleSectionChange = (section: string) => {
    onNavigate('recruiter-dashboard', undefined, undefined, undefined, undefined, undefined, section);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600">
        <TrendingUp className="w-3 h-3" />
        <span>{trend}</span>
        <span className="text-slate-400 font-normal">vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-12 animate-fade-in font-sans">
      {/* Glassmorphic Header - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] bg-slate-900 text-white p-6 sm:p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-purple-200">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Recruiter Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3">
              Welcome back, {profile?.fullName?.split(' ')[0] || 'Recruiter'}!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              Here is what's happening with your job postings and applications today.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={() => handleSectionChange('post-job')}
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg border-none px-5 sm:px-6 py-3 h-12 sm:h-auto text-sm sm:text-base font-bold rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Active Jobs"
          value={activeJobs}
          icon={Briefcase}
          color="bg-emerald-600"
          trend="+12%"
        />
        <StatCard
          label="Total Applicants"
          value={totalApplications}
          icon={Users}
          color="bg-blue-600"
          trend="+28%"
        />
        <StatCard
          label="Pending Review"
          value={pendingApplications}
          icon={Clock}
          color="bg-amber-600"
          trend="+5%"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-8">

          {/* Recent Applications Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-slate-800">Recent Applications</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleSectionChange('applicants')} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                View All <ArrowUpRight className="ml-1 w-4 h-4" />
              </Button>
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-slate-900 font-semibold mb-1">No applications yet</h4>
                <p className="text-sm">Wait for candidates to apply to your jobs.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">Applying For</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shadow-sm border border-white">
                              {app.applicant?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">{app.applicant?.fullName || 'Unknown'}</div>
                              <div className="text-xs text-slate-500">{app.applicant?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md text-xs border border-slate-200">
                            {app.job?.jobDetails?.basicInfo?.jobTitle || 'Unknown Job'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                          {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Jobs List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-slate-800">Active Job Postings</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleSectionChange('jobs')} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                Manage Jobs <ArrowUpRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <div className="divide-y divide-slate-100">
              {myJobs.filter(j => j.status === 'active').slice(0, 3).map((job) => (
                <div key={job._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{job.jobDetails?.basicInfo?.jobTitle}</h4>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">{job.jobDetails?.location?.city || 'Remote'}</span>
                        <span>•</span>
                        <span>{job.jobDetails?.basicInfo?.employmentType}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-16 sm:pl-0">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {job.status}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => handleSectionChange('jobs')} className="border-slate-200 hover:border-slate-300">Manage</Button>
                  </div>
                </div>
              ))}
              {myJobs.filter(j => j.status === 'active').length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                    <PlusCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-slate-900 font-bold">No active jobs</h3>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create a job posting to start receiving applications from qualified candidates.</p>
                  <Button onClick={() => handleSectionChange('post-job')} className="bg-slate-900 hover:bg-slate-800 text-white">Post Your First Job</Button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">

          {/* Quick Find */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Find Candidates</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Search our database of verified candidates to find your next hire directly.
              </p>
              <Button
                onClick={() => handleSectionChange('find-candidates')}
                className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none font-bold"
              >
                Search Database
              </Button>
            </div>
          </div>

          {/* Recent Activity (Placeholder) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-96">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Recent Activity</h3>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">No recent activity</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}