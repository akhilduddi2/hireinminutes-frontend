import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  Users, Briefcase, CheckCircle,
  FileText, Filter,
  ArrowUpRight, ArrowDownRight,
  Monitor, Building2, ChevronRight, Search
} from 'lucide-react';
import type { DashboardStats, FormattedRecruiterApproval, FormattedCandidate, FormattedJob } from './types';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  growth: number;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'purple' | 'green' | 'amber' | 'emerald' | 'indigo';
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, growth, trend, color }) => {
  const colorStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100', iconBg: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100', iconBg: 'bg-purple-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100', iconBg: 'bg-green-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100', iconBg: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100', iconBg: 'bg-emerald-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100', iconBg: 'bg-indigo-500' },
  };

  const css = colorStyles[color];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      {/* Decorative gradient overlay */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${css.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${css.iconBg} text-white shadow-md shadow-${color}-200`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 relative z-10">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(growth)}%
        </div>
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">vs last month</span>
      </div>
    </div>
  );
};

interface OverviewTabProps {
  stats: DashboardStats;
  statsLoading: boolean;
  candidates: FormattedCandidate[];
  jobs: FormattedJob[];
  pendingApprovals: FormattedRecruiterApproval[];
  onNavigate?: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  statsLoading,
  candidates,
  jobs,
  pendingApprovals,
  onNavigate
}) => {
  const getRecentActivity = () => {
    const activities: Array<{
      id: string;
      type: 'candidate' | 'job' | 'approval' | 'course';
      title: string;
      subtitle: string;
      time: string;
      status: string;
      icon: React.ElementType;
    }> = [];

    // Combine and sort activities would be better, but interleaving for now
    candidates.slice(0, 2).forEach((candidate, idx) => {
      activities.push({
        id: `candidate-${idx}`,
        type: 'candidate',
        title: 'New Registration',
        subtitle: candidate.name,
        time: candidate.joinDate,
        status: candidate.status,
        icon: Users
      });
    });

    jobs.slice(0, 2).forEach((job, idx) => {
      const companyName = job.postedBy?.profile?.company?.name || 'Company';
      const jobTitle = job.jobDetails?.basicInfo?.jobTitle || 'Job Role';
      activities.push({
        id: `job-${idx}`,
        type: 'job',
        title: 'Job Posted',
        subtitle: `${jobTitle} • ${companyName}`,
        time: new Date(job.createdAt).toLocaleDateString(),
        status: job.status,
        icon: Briefcase
      });
    });

    if (pendingApprovals.length > 0) {
      const approval = pendingApprovals[0];
      activities.push({
        id: `approval-${approval.id}`,
        type: 'approval',
        title: 'Verification Request',
        subtitle: approval.name,
        time: approval.applicationDate,
        status: 'pending',
        icon: Building2
      });
    }

    return activities.slice(0, 5);
  };



  if (statsLoading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        {/* Welcome Section Skeleton */}
        <div className="rounded-3xl bg-slate-200 h-48"></div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-32"></div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-slate-100 rounded-2xl h-96"></div>
          <div className="bg-slate-100 rounded-2xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-full overflow-x-hidden">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Welcome back, Admin! 👋</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Here’s what’s happening with your job board today. You have <span className="text-white font-semibold border-b border-white/30 pb-0.5">{stats.pendingApprovals} pending approvals</span> requiring your attention.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">

            <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-600/30 font-semibold transition-all" onClick={() => onNavigate?.('admin', undefined, undefined, undefined, undefined, undefined, 'approvals')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Approvals
            </Button>
          </div>
        </div>

        {/* Mini Metrics Overlay */}
        <div className="absolute top-6 right-6 hidden xl:flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/10 uppercase tracking-wide select-none">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Candidates" value={stats.totalCandidates} growth={stats.candidatesGrowth} trend={stats.candidatesGrowth >= 0 ? 'up' : 'down'} color="blue" />
        <StatCard icon={Building2} label="Recruiters" value={stats.totalRecruiters} growth={stats.recruitersGrowth} trend={stats.recruitersGrowth >= 0 ? 'up' : 'down'} color="purple" />
        <StatCard icon={FileText} label="Active Jobs" value={stats.totalJobs} growth={stats.jobsGrowth} trend={stats.jobsGrowth >= 0 ? 'up' : 'down'} color="green" />
        <StatCard icon={CheckCircle} label="Approvals" value={stats.pendingApprovals} growth={stats.approvalsGrowth} trend={stats.approvalsGrowth >= 0 ? 'up' : 'down'} color="amber" />

      </div>

      {/* Main Dashboard Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">

          {/* Pending Approvals Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  Pending Approvals
                </h2>
                <p className="text-sm text-slate-500 mt-1 pl-9">Review and approve recruiter accounts</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    className="w-full sm:w-60 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex border-slate-200 bg-white hover:bg-slate-50">
                  <Filter className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Candidate / Company</th>
                    <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Submitted</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingApprovals.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          </div>
                          <p className="text-sm font-semibold text-slate-900">All caught up!</p>
                          <p className="text-xs text-slate-500 mt-1">No pending approvals at the moment.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pendingApprovals.slice(0, 5).map((approval) => (
                      <tr key={approval.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0 border border-slate-200">
                              {approval.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate max-w-[150px] sm:max-w-xs">{approval.name}</div>
                              <div className="text-xs text-slate-500 truncate mt-0.5">{approval.company || 'Individual Recruiter'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            Recruiter
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-500 font-medium">{approval.applicationDate}</span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 font-medium" onClick={() => onNavigate?.('admin', undefined, undefined, undefined, undefined, undefined, 'approvals')}>
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center mt-auto">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-medium" onClick={() => onNavigate?.('admin', undefined, undefined, undefined, undefined, undefined, 'approvals')}>
                View all approvals <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column (Timeline & Actions) */}
        <div className="space-y-6 lg:space-y-8">

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
                <Monitor className="h-4 w-4 text-slate-400" />
              </Button>
            </div>

            <div className="relative pl-2">
              {/* Timeline Line */}
              <div className="absolute left-[9px] top-3 bottom-4 w-[2px] bg-slate-100"></div>

              <div className="space-y-6 relative">
                {getRecentActivity().length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">No recent activity logged.</p>
                ) : (
                  getRecentActivity().map((activity, idx) => (
                    <div key={idx} className="grid grid-cols-[20px_1fr] gap-4 relative group">
                      <div className={`w-5 h-5 rounded-full border-[3px] border-white shrink-0 z-10 box-content shadow-sm relative ${activity.type === 'candidate' ? 'bg-blue-500 ring-1 ring-blue-100' :
                        activity.type === 'job' ? 'bg-green-500 ring-1 ring-green-100' :
                          activity.type === 'approval' ? 'bg-amber-500 ring-1 ring-amber-100' : 'bg-slate-500 ring-1 ring-slate-100'
                        }`}></div>
                      <div className="pb-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate pr-4 group-hover:text-blue-600 transition-colors">{activity.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.subtitle}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1.5 uppercase tracking-wide flex items-center gap-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button variant="ghost" size="sm" className="w-full mt-6 text-slate-500 hover:text-slate-900 text-xs uppercase tracking-wide font-medium border border-dashed border-slate-200 hover:border-slate-300">
              Load More
            </Button>
          </div>

          {/* Quick Actions Grid */}


        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
