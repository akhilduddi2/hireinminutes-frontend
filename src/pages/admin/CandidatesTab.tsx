import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
  Users, Search, Download, Eye,
  Trash2, AlertCircle, XCircle, Send, Mail
} from 'lucide-react';
import type { FormattedCandidate } from './types';

interface CandidatesTabProps {
  candidates: FormattedCandidate[];
  loading: boolean;
  error: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewProfile: (candidateId: string) => void;
  onDeleteCandidate: (candidate: FormattedCandidate) => void;
  onSendInterview: (candidateId: string, link: string) => Promise<void>;
  onUpdateCredits: (candidateId: string, count: number) => Promise<void>;
  onUpdateScore: (candidateId: string, score: number, level: string, verifiedSkills: string[]) => Promise<void>;
  onSendBulkEmail: (data: { userType: string; subject: string; message: string }) => Promise<void>;
  onExport: () => void;
}

export const CandidatesTab: React.FC<CandidatesTabProps> = ({
  candidates,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onViewProfile,
  onDeleteCandidate,
  onSendInterview,
  onUpdateCredits,
  onUpdateScore,
  onSendBulkEmail,
  onExport
}) => {
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'starter' | 'premium' | 'pro'>('all');
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [editCreditsModalOpen, setEditCreditsModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [interviewLink, setInterviewLink] = useState('');
  const [newCreditCount, setNewCreditCount] = useState<number>(0);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [scoreForm, setScoreForm] = useState({ score: 0, level: 'Beginner', verifiedSkills: '' });
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ userType: 'All', subject: '', message: '' });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      searchQuery === '' ||
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = planFilter === 'all' || candidate.plan === planFilter;

    return matchesSearch && matchesPlan;
  });

  const stats = {
    total: candidates.length,
    verified: candidates.filter(c => c.status === 'verified').length,
    premium: candidates.filter(c => c.plan === 'premium').length,
    pro: candidates.filter(c => c.plan === 'pro').length
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'pro':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-wide">PRO</span>;
      case 'premium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border-amber-200 uppercase tracking-wide">PREMIUM</span>;
      case 'starter':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border-blue-200 uppercase tracking-wide">STARTER</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border-slate-200 uppercase tracking-wide">FREE</span>;
    }
  };

  const getInterviewLimit = (plan?: string) => {
    if (plan === 'pro') return 3;
    if (plan === 'premium') return 1;
    return 0;
  };

  const handleOpenInterviewModal = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setInterviewLink('');
    setInterviewModalOpen(true);
  };

  const handleSubmitInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId || !interviewLink) return;

    setSendingLink(true);
    try {
      await onSendInterview(selectedCandidateId, interviewLink);
      setInterviewModalOpen(false);
      setInterviewLink('');
    } catch (error) {
      console.error('Failed to send link:', error);
    } finally {
      setSendingLink(false);
    }
  };

  const handleOpenEditCredits = (candidateId: string, currentCount: number) => {
    setSelectedCandidateId(candidateId);
    setNewCreditCount(currentCount);
    setEditCreditsModalOpen(true);
  };

  const handleSubmitCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) return;

    try {
      await onUpdateCredits(selectedCandidateId, newCreditCount);
      setEditCreditsModalOpen(false);
    } catch (error) {
      console.error('Failed to update credits', error);
    }
  };

  const handleOpenScoreModal = (candidate: FormattedCandidate) => {
    setSelectedCandidateId(candidate.id);
    setScoreForm({
      score: candidate.skillPassport?.score || 0,
      level: candidate.skillPassport?.level || 'Beginner',
      verifiedSkills: candidate.skillPassport?.verifiedSkills?.join(', ') || ''
    });
    setScoreModalOpen(true);
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId || !onUpdateScore) return;

    try {
      const skillsArray = scoreForm.verifiedSkills.split(',').map(s => s.trim()).filter(Boolean);
      await onUpdateScore(selectedCandidateId, scoreForm.score, scoreForm.level, skillsArray);
      setScoreModalOpen(false);
    } catch (error) {
      console.error('Failed to update score', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        <div className="rounded-3xl bg-slate-200 h-64"></div>
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mx-auto max-w-2xl mt-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-900">Error Loading Candidates</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Candidates Management</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Manage all registered candidates, verify profiles, and handle account actions.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setEmailModalOpen(true)}
              className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 shadow-sm font-semibold transition-all"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
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
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Candidates</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Verified</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.verified}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Premium Users</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.premium}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pro Users</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{stats.pro}</p>
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
              placeholder="Search candidates by name, email, or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
              {(['all', 'free', 'starter', 'premium', 'pro'] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setPlanFilter(plan)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${planFilter === plan
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Candidate Detail</th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Plan</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Interviews</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No candidates found</p>
                      <p className="text-xs text-slate-500 mt-1">Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => {
                  const limit = getInterviewLimit(candidate.plan);
                  const count = candidate.interviewCount || 0;
                  const canSendLink = limit > 0 && count > 0;
                  const hasScore = candidate.skillPassport && candidate.skillPassport.score > 0;

                  return (
                    <tr key={candidate.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              {candidate.name}
                              {hasScore && (
                                <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded border border-yellow-200">
                                  {candidate.skillPassport?.score}/100
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        {getPlanBadge(candidate.plan)}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4">
                        {limit > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${count > 0
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                              {count} Credits Left
                            </span>
                            <button
                              onClick={() => handleOpenEditCredits(candidate.id, count)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600 transition-colors"
                              title="Edit Credits"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Not included</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${candidate.status === 'verified' ? 'bg-green-50 text-green-700 border-green-200' :
                          candidate.status === 'unverified' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                          {candidate.status === 'verified' ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">

                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 rounded-lg"
                            title="Rate Interview"
                            onClick={() => handleOpenScoreModal(candidate)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          </Button>

                          {limit > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`rounded-lg ${canSendLink ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-300 cursor-not-allowed'}`}
                              title={canSendLink ? "Send Interview Link" : "Interview Limit Reached"}
                              onClick={() => canSendLink && handleOpenInterviewModal(candidate.id)}
                              disabled={!canSendLink}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                            title="View Profile"
                            onClick={() => onViewProfile(candidate.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete User"
                            onClick={() => onDeleteCandidate(candidate)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredCandidates.length}</span> of {candidates.length} candidates
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 disabled:opacity-50" disabled>Previous</Button>
            <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 disabled:opacity-50" disabled>Next</Button>
          </div>
        </div>
      </div>

      {/* Score Modal */}
      {scoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Rate Interview</h3>
              <button
                onClick={() => setScoreModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitScore} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Interview Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreForm.score}
                  onChange={(e) => setScoreForm({ ...scoreForm, score: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Skill Level</label>
                <select
                  value={scoreForm.level}
                  onChange={(e) => setScoreForm({ ...scoreForm, level: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Verified Skills (comma separated)</label>
                <textarea
                  value={scoreForm.verifiedSkills}
                  onChange={(e) => setScoreForm({ ...scoreForm, verifiedSkills: e.target.value })}
                  placeholder="React, Node.js, System Design"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-24"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setScoreModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Score</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interview Link Modal */}
      {
        interviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">Send Interview Link</h3>
                <button
                  onClick={() => setInterviewModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitInterview} className="p-6 space-y-4">
                <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-xl border border-blue-100">
                  You are about to send an interview invitation. This will count towards the candidate's plan limit.
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Meeting / Interview URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://meet.google.com/..."
                    value={interviewLink}
                    onChange={(e) => setInterviewLink(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInterviewModalOpen(false)}
                    className="border-slate-200 text-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={sendingLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {sendingLink ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Edit Credits Modal */}
      {
        editCreditsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">Update Interview Credits</h3>
                <button
                  onClick={() => setEditCreditsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitCredits} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Remaining Interview Credits</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setNewCreditCount(Math.max(0, newCreditCount - 1))}
                      className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold text-lg"
                    >−</button>
                    <input
                      type="number"
                      min="0"
                      value={newCreditCount}
                      onChange={(e) => setNewCreditCount(parseInt(e.target.value) || 0)}
                      className="flex-1 text-center py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setNewCreditCount(newCreditCount + 1)}
                      className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold text-lg"
                    >+</button>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setEditCreditsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Update</Button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      {/* Bulk Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Send Bulk Email</h3>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setSendingEmail(true);
              try {
                await onSendBulkEmail(emailForm);
                setEmailModalOpen(false);
                setEmailForm({ userType: 'All', subject: '', message: '' });
              } catch (error) {
                console.error('Failed to send emails', error);
              } finally {
                setSendingEmail(false);
              }
            }} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Type of User</label>
                <select
                  value={emailForm.userType}
                  onChange={(e) => setEmailForm({ ...emailForm, userType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Free">Free</option>
                  <option value="Starter">Starter</option>
                  <option value="Premium">Premium</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Subject</label>
                <input
                  type="text"
                  required
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  placeholder="Important Update..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  required
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEmailModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={sendingEmail} className="bg-blue-600 text-white hover:bg-blue-700">
                  {sendingEmail ? 'Sending...' : 'Send Emails'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div >
  );
};

export default CandidatesTab;
