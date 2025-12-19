import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  Search, CheckCircle, Clock, X, Building2, Mail, Briefcase, Calendar, Eye,
  Filter, Download, ShieldCheck
} from 'lucide-react';
import type { FormattedRecruiterApproval } from './types';

interface ApprovalsTabProps {
  pendingApprovals: FormattedRecruiterApproval[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onApprove: (recruiterId: string) => void;
  onReject: (recruiterId: string) => void;
  onViewProfile: (recruiterId: string) => void;
  onExport: () => void;
}

export const ApprovalsTab: React.FC<ApprovalsTabProps> = ({
  pendingApprovals,
  loading,
  searchQuery,
  onSearchChange,
  onApprove,
  onReject,
  onViewProfile,
  onExport
}) => {
  const filteredApprovals = pendingApprovals.filter(approval =>
    searchQuery === '' ||
    approval.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    approval.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    approval.email.toLowerCase().includes(searchQuery.toLowerCase())
  );



  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 animate-pulse">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-amber-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-red-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Recruiter Approvals</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Review pending applications, verify entity details, and grant platform access.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onExport}
              className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 shadow-sm font-semibold transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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
              placeholder="Search by name, company, or email..."
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

        {/* Approvals Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Company / Applicant</th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Role Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No pending approvals</p>
                      <p className="text-xs text-slate-500 mt-1">Excellent job! You're all caught up.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {approval.companyLogo ? (
                          <img
                            src={approval.companyLogo.startsWith('data:') ? approval.companyLogo : `data:image/png;base64,${approval.companyLogo}`}
                            alt="Logo"
                            className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Building2 className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{approval.company}</div>
                          <div className="text-xs text-slate-500 font-medium">{approval.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {approval.email}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                          {approval.jobTitle}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          Applied {approval.applicationDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="h-3 w-3" />
                        Pending Review
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                        <Button
                          onClick={() => onApprove(approval.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="hidden xl:inline ml-2">Approve</span>
                        </Button>
                        <Button
                          onClick={() => onReject(approval.id)}
                          size="sm"
                          variant="outline"
                          className="bg-white hover:bg-red-50 text-red-600 border-red-200 rounded-lg"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                          title="View Details"
                          onClick={() => onViewProfile(approval.recruiterId)}
                        >
                          <Eye className="h-4 w-4" />
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
            Showing <span className="text-slate-900 font-bold">{filteredApprovals.length}</span> of {pendingApprovals.length} applications
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

export default ApprovalsTab;
