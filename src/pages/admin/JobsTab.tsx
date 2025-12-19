import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  Search, Briefcase, Building2, MapPin, Clock, Eye, Trash2,
  Filter, Download, CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import type { FormattedJob } from './types';

interface JobsTabProps {
  jobs: FormattedJob[];
  jobsLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport: () => void;
}

export const JobsTab: React.FC<JobsTabProps> = ({
  jobs,
  jobsLoading,
  searchQuery,
  onSearchChange,
  onExport
}) => {
  const filteredJobs = jobs.filter(job =>
    searchQuery === '' ||
    job.jobDetails?.basicInfo?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobDetails?.basicInfo?.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobDetails?.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active' || j.status === 'open').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    totalApplications: jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0)
  };

  if (jobsLoading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        {/* Header Skeleton */}
        <div className="rounded-3xl bg-slate-200 h-64"></div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <div className="h-10 bg-slate-200 rounded-xl w-full max-w-md"></div>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-50 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-slate-100 rounded-full w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-amber-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-orange-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Jobs Management</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Monitor active listings, review applications, and manage job postings.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onExport}
              className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 shadow-sm font-semibold transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Jobs
            </Button>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Jobs</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Listings</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.active}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Applications</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.totalApplications}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Closed</p>
            <p className="text-2xl font-bold text-slate-400 mt-1">{stats.closed}</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
          <div className="flex-1 w-full md:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by title, department, or city..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Job Title</th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Posted Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="hidden md:table-cell px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Apps</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No jobs found</p>
                      <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{job.jobDetails?.basicInfo?.jobTitle || 'Untitled'}</div>
                          <div className="text-xs text-slate-500 font-medium">{job.jobDetails?.basicInfo?.employmentType || 'Full-time'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {job.jobDetails?.basicInfo?.department || 'General'}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium bg-slate-100 w-fit px-2.5 py-1 rounded-full">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {job.jobDetails?.location?.city || 'Remote'}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${job.status === 'active' || job.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' :
                        job.status === 'closed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {(job.status === 'active' || job.status === 'open') && <CheckCircle className="h-3 w-3" />}
                        {job.status === 'closed' && <XCircle className="h-3 w-3" />}
                        {job.status !== 'active' && job.status !== 'open' && job.status !== 'closed' && <AlertCircle className="h-3 w-3" />}
                        {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-6 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                        {job.applications?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-amber-50 hover:text-amber-600 rounded-lg"
                          title="View Details"
                          onClick={() => {/* View Details Handler */ }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Job"
                          onClick={() => {/* Delete Handler */ }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredJobs.length}</span> of {jobs.length} jobs
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 disabled:opacity-50" disabled>Previous</Button>
            <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 disabled:opacity-50" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsTab;
