import React from 'react';
import { Button } from '../../components/ui/Button';
import {
  Search, ShieldCheck, Eye, CheckCircle, XCircle, Filter, Download,
  Building2, Globe, FileCheck, AlertTriangle
} from 'lucide-react';
import type { VerificationApplication } from './types';

interface VerificationTabProps {
  verificationApps: VerificationApplication[];
  verificationLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewApplication: (app: VerificationApplication) => void;
}

export const VerificationTab: React.FC<VerificationTabProps> = ({
  verificationApps,
  verificationLoading,
  searchQuery,
  onSearchChange,
  onApprove,
  onReject,
  onViewApplication
}) => {
  const filteredApps = verificationApps.filter(app => {
    const candidateName = typeof app.candidate === 'object' ? app.candidate?.fullName : '';
    const candidateEmail = typeof app.candidate === 'object' ? app.candidate?.email : '';
    return searchQuery === '' ||
      app.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.companyEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidateEmail?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const stats = {
    total: verificationApps.length,
    pending: verificationApps.filter(a => a.status === 'pending').length,
    approved: verificationApps.filter(a => a.status === 'approved').length,
    rejected: verificationApps.filter(a => a.status === 'rejected').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="h-3 w-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldCheck className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  if (verificationLoading) {
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
                <div className="h-6 bg-slate-100 rounded-full w-20"></div>
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
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-teal-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Identity Verification</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Validate company documents and ensure platform safety and compliance.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 shadow-sm font-semibold transition-all">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.approved}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{stats.rejected}</p>
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
              placeholder="Search by company, email, or candidate..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Verification Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Entity Details</th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Industry / Website</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FileCheck className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No verification requests</p>
                      <p className="text-xs text-slate-500 mt-1">No applications match your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {app.companyName || (typeof app.candidate === 'object' ? app.candidate?.fullName : 'Unknown Entity')}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">Submitted {new Date(app.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-700">{app.industry || 'N/A'}</span>
                        {app.companyWebsite && (
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700">
                            <Globe className="h-3 w-3" />
                            <a href={app.companyWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {app.companyEmail || (typeof app.candidate === 'object' ? app.candidate?.email : 'N/A')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-emerald-50 hover:text-emerald-700 rounded-lg"
                          title="View Application"
                          onClick={() => onViewApplication(app)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {app.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:bg-green-50 hover:text-green-700 rounded-lg"
                              title="Approve"
                              onClick={() => onApprove(app._id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg"
                              title="Reject"
                              onClick={() => onReject(app._id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
            Showing <span className="text-slate-900 font-bold">{filteredApps.length}</span> of {verificationApps.length} requests
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

export default VerificationTab;
