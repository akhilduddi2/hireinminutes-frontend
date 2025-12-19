import { useState } from 'react';
import { UserCheck, CheckCircle, Mail, Search, MapPin, Briefcase, GraduationCap, X } from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { RecruiterPageProps, Candidate } from './types';

interface RecruiterFindCandidatesProps extends RecruiterPageProps {
  candidates: Candidate[];
  loadingCandidates: boolean;
}

export function RecruiterFindCandidates({ candidates, loadingCandidates }: RecruiterFindCandidatesProps) {
  const [candidateSearch, setCandidateSearch] = useState('');

  const filteredCandidates = candidates.filter(candidate =>
    candidateSearch === '' ||
    candidate.profile.fullName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    candidate.profile.skills.some((skill: string) => skill.toLowerCase().includes(candidateSearch.toLowerCase())) ||
    candidate.profile.location.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    candidate.profile.currentRole.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-pink-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Candidate Search</h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            Discover and connect with verified talent for your open roles.
          </p>
        </div>

        <div className="relative z-10 mt-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, skills, location, or role..."
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
            />
            {candidateSearch && (
              <button
                onClick={() => setCandidateSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Candidates List */}
      {loadingCandidates ? (
        <div className="text-center py-24">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading verified candidates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <div key={candidate._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all group duration-300 relative flex flex-col h-full">
              {/* Verified Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 uppercase tracking-wide">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified
              </div>

              <div className="flex items-start gap-5 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-2xl shadow-inner border border-white/50">
                  {candidate.profile.fullName.charAt(0)}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-blue-600 transition-colors">
                    {candidate.profile.fullName}
                  </h3>
                  <p className="text-slate-600 font-medium">{candidate.profile.currentRole}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {candidate.profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> {candidate.profile.experience}y exp
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-4 flex-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Top Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.profile.skills.slice(0, 5).map((skill: string, index: number) => (
                      <span key={index} className="px-2.5 py-1 text-xs font-semibold bg-slate-50 text-slate-600 rounded-lg border border-slate-200">
                        {skill}
                      </span>
                    ))}
                    {candidate.profile.skills.length > 5 && (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-slate-50 text-slate-400 rounded-lg border border-slate-200">+{candidate.profile.skills.length - 5}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-purple-500" /> Education
                  </h4>
                  <p className="text-sm text-slate-600 leading-snug">{candidate.profile.education}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                <div className="text-xs text-slate-400 font-medium">
                  Verified since {new Date(candidate.verifiedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 text-slate-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10">
                    View Full Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {candidates.length === 0 && !loadingCandidates && (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <UserCheck className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Verified Candidates</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
            Our candidate pool is currently being updated. Verified candidates will appear here soon.
          </p>
        </div>
      )}

      {filteredCandidates.length === 0 && candidates.length > 0 && !loadingCandidates && (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Matches Found</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            We couldn't find any candidates matching "{candidateSearch}". Try adjusting your search criteria.
          </p>
          <Button onClick={() => setCandidateSearch('')} variant="outline" className="border-slate-200">
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
