import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  Briefcase, Search, Filter, Download, MapPin, Building2, Eye, Trash2,
  CheckCircle, Clock, XCircle
} from 'lucide-react';

interface RecruiterData {
  id: string;
  name: string;
  email: string;
  company: string;
  location: string;
  joinDate: string;
  status: string;
}

interface RecruitersTabProps {
  recruiters: RecruiterData[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewProfile: (recruiterId: string) => void;
  onDeleteRecruiter: (recruiter: RecruiterData) => void;
  onApproveRecruiter?: (recruiterId: string) => void;
  onExport: () => void;
}

export const RecruitersTab: React.FC<RecruitersTabProps> = ({
  recruiters,
  loading,
  searchQuery,
  onSearchChange,
  onViewProfile,
  onDeleteRecruiter,
  onApproveRecruiter,
  onExport
}) => {
  const filteredRecruiters = recruiters.filter((recruiter) =>
    searchQuery === '' ||
    recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: recruiters.length,
    verified: recruiters.filter(r => r.status === 'verified').length,
    pending: recruiters.filter(r => r.status === 'pending').length,
    unverified: recruiters.filter(r => r.status === 'unverified').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 animate-pulse">Loading recruiters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Recruiters Management</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Oversee company profiles, verify recruiter accounts, and manage platform access.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onExport}
              className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 shadow-sm font-semibold transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Recruiters</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Verified</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.verified}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Unverified</p>
            <p className="text-2xl font-bold text-slate-400 mt-1">{stats.unverified}</p>
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
              placeholder="Search recruiters by name, company, or email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Recruiters Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Recruiter Detail</th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contact Info</th>
                <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Company</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecruiters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No recruiters found</p>
                      <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecruiters.map((recruiter) => (
                  <tr key={recruiter.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white">
                          {recruiter.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{recruiter.name}</div>
                          <div className="text-xs text-slate-500 font-medium">Joined {recruiter.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <span className="text-sm text-slate-700 font-medium">{recruiter.email}</span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {recruiter.company}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium bg-slate-100 w-fit px-2.5 py-1 rounded-full">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {recruiter.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${recruiter.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' :
                        recruiter.status === 'unverified' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          recruiter.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {recruiter.status === 'verified' && <CheckCircle className="h-3 w-3" />}
                        {recruiter.status === 'unverified' && <XCircle className="h-3 w-3" />}
                        {recruiter.status === 'pending' && <Clock className="h-3 w-3" />}
                        {recruiter.status === 'verified' ? 'Verified' :
                          recruiter.status === 'unverified' ? 'Unverified' :
                            recruiter.status.charAt(0).toUpperCase() + recruiter.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                        {recruiter.status === 'pending' && onApproveRecruiter && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-8 px-3"
                            onClick={() => onApproveRecruiter(recruiter.id)}
                            title="Approve Recruiter"
                          >
                            <CheckCircle className="h-4 w-4 mr-1.5" />
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-purple-50 hover:text-purple-600 rounded-lg"
                          title="View Profile"
                          onClick={() => onViewProfile(recruiter.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Recruiter"
                          onClick={() => onDeleteRecruiter(recruiter)}
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
            Showing <span className="text-slate-900 font-bold">{filteredRecruiters.length}</span> of {recruiters.length} recruiters
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

export default RecruitersTab;
