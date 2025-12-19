import { useState, useMemo } from 'react';
import {
  Search, Filter, Smartphone, Mail, Briefcase, MapPin, Calendar, CheckCircle,
  XCircle, Clock, ChevronRight, GraduationCap, X, FileText, Download, MessageSquare,
  Linkedin, Github, ExternalLink, Eye, MoreHorizontal, Users, Phone, BookOpen, Star,
  Link as LinkIcon, Check
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { RecruiterPageProps, Application } from './types';

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface RecruiterApplicantsProps extends RecruiterPageProps {
  applications: Application[];
  loadingApplications: boolean;
  onRefreshApplications: () => void;
}

export function RecruiterApplicants({
  applications,
  loadingApplications,
  onRefreshApplications
}: RecruiterApplicantsProps) {
  const [applicationTab, setApplicationTab] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');
  const [messageForm, setMessageForm] = useState({ title: '', message: '', meetingLink: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3.5 w-3.5" />;
      case 'reviewed': return <Eye className="h-3.5 w-3.5" />;
      case 'accepted': return <CheckCircle className="h-3.5 w-3.5" />;
      case 'rejected': return <XCircle className="h-3.5 w-3.5" />;
      default: return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const handleUpdateApplicationStatus = async () => {
    if (!selectedApplication) return;

    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        alert('You must be logged in to perform this action');
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/applications/${selectedApplication._id}/status`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          status: actionType === 'accept' ? 'accepted' : 'rejected',
          title: messageForm.title,
          message: messageForm.message,
          meetingLink: messageForm.meetingLink
        })
      });

      if (response.ok) {
        alert(`Application ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully!`);
        setShowMessageModal(false);
        setShowProfileModal(false);
        setMessageForm({ title: '', message: '', meetingLink: '' });
        onRefreshApplications();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application. Please try again.');
    }
  };

  const filteredApplications = applications.filter(app =>
    app.status === applicationTab &&
    (app.applicant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.jobDetails?.basicInfo?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Applicants</h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            Review applications, manage candidate pipelines, and find your next hire.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 max-w-2xl">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{applications.filter(a => a.status === 'pending').length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Accepted</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{applications.filter(a => a.status === 'accepted').length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-white mt-1">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* Toolbar & Tabs */}
      <div className="space-y-4">
        <div className="bg-slate-100 p-1 rounded-xl inline-flex">
          {['pending', 'accepted', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setApplicationTab(tab as any)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${applicationTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
            >
              <span className="capitalize">{tab}</span>
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${applicationTab === tab
                ? 'bg-slate-100 text-slate-600'
                : 'bg-slate-200 text-slate-500'
                }`}>
                {applications.filter(a => a.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search applicants by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Applications List */}
      {loadingApplications ? (
        <div className="text-center py-24">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading applications...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map(application => (
            <div key={application._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all group">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-slate-100">
                    {application.applicant?.profilePicture ? (
                      <img src={application.applicant.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 font-bold text-xl">
                        {application.applicant?.fullName?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                        {application.applicant?.fullName || 'Unknown Applicant'}
                      </h3>
                      {application.applicant?.isVerified && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-slate-500 text-sm mb-3 font-medium">{application.applicant?.email}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="flex items-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                        <Briefcase className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        {application.job?.jobDetails?.basicInfo?.jobTitle || 'Position'}
                      </span>
                      <span className="flex items-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Skills preview */}
                    {application.applicant?.profile?.skills && application.applicant.profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {application.applicant.profile.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200 uppercase tracking-wide"
                          >
                            {typeof skill === 'string' ? skill : skill.name}
                          </span>
                        ))}
                        {application.applicant.profile.skills.length > 5 && (
                          <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 text-slate-400 rounded-md border border-slate-100">
                            +{application.applicant.profile.skills.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {application.status}
                  </span>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-slate-900"
                      onClick={() => { }} // Placeholder for simpler view or quick action
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-900 text-white border-transparent hover:bg-slate-800 hover:text-white shadow-md shadow-slate-900/10"
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowProfileModal(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No applicants found
              </h3>
              <p className="text-slate-500">
                {searchQuery ? "Try adjusting your search terms." : `No applications in ${applicationTab} status yet.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedApplication && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Candidate Profile</h2>
                <p className="text-sm text-slate-500">Reviewing application for <span className="text-blue-600 font-medium">{selectedApplication.job?.jobDetails?.basicInfo?.jobTitle}</span></p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-0">
              {/* Hero Section */}
              <div className="bg-slate-50 px-8 py-10 border-b border-slate-200">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                    {selectedApplication.applicant?.profilePicture ? (
                      <img
                        src={selectedApplication.applicant.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-300">
                        {(selectedApplication.applicant?.fullName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                      {selectedApplication.applicant?.fullName || 'Applicant'}
                      {selectedApplication.applicant?.isVerified && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /> {selectedApplication.applicant?.email}</span>
                      {selectedApplication.applicant?.profile?.location && (
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {selectedApplication.applicant.profile.location.city}, {selectedApplication.applicant.profile.location.state}</span>
                      )}
                      {selectedApplication.applicant?.profile?.phone && (
                        <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> {selectedApplication.applicant.profile.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8 space-y-8">
                {/* Professional Summary */}
                {selectedApplication.applicant?.profile?.professionalSummary && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      About
                    </h3>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedApplication.applicant.profile.professionalSummary}
                    </p>
                  </section>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Experience */}
                  {selectedApplication.applicant?.profile?.experience && selectedApplication.applicant.profile.experience.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-500" /> Experience
                      </h3>
                      <div className="space-y-4">
                        {selectedApplication.applicant.profile.experience.map((exp, idx) => (
                          <div key={idx} className="relative pl-6 border-l-2 border-slate-100 pb-4 last:pb-0">
                            <div className="absolute top-0 left-[-7px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                            <h4 className="font-bold text-slate-900">{exp.jobTitle}</h4>
                            <div className="text-slate-600 text-sm font-medium mb-1">{exp.companyName}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wide">
                              {exp.startDate} - {exp.isCurrentlyWorking ? 'Present' : exp.endDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Education */}
                  {selectedApplication.applicant?.profile?.education && selectedApplication.applicant.profile.education.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-500" /> Education
                      </h3>
                      <div className="space-y-4">
                        {selectedApplication.applicant.profile.education.map((edu, idx) => (
                          <div key={idx} className="relative pl-6 border-l-2 border-slate-100 pb-4 last:pb-0">
                            <div className="absolute top-0 left-[-7px] w-3 h-3 rounded-full bg-purple-500 border-2 border-white"></div>
                            <h4 className="font-bold text-slate-900">{edu.degreeName}</h4>
                            <div className="text-slate-600 text-sm font-medium mb-1">{edu.institution}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wide">
                              {edu.startYear} - {edu.endYear || 'Present'} {edu.grade && `• Grade: ${edu.grade}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Skills */}
                {selectedApplication.applicant?.profile?.skills && selectedApplication.applicant.profile.skills.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" /> Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.applicant.profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${typeof skill === 'object' && skill.isVerified
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-white text-slate-700 border-slate-200'
                            }`}
                        >
                          {typeof skill === 'string' ? skill : skill.name}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Documents & Links */}
                {(selectedApplication.applicant?.profile?.documents || selectedApplication.applicant?.profile?.socialProfiles) && (
                  <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      Attachments & Links
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {selectedApplication.applicant?.profile?.documents?.resume && (
                        <a
                          href={selectedApplication.applicant.profile.documents.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Resume</span>
                        </a>
                      )}
                      {selectedApplication.applicant.profile?.documents?.portfolioUrl && (
                        <a
                          href={selectedApplication.applicant.profile.documents.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span>Portfolio</span>
                        </a>
                      )}
                    </div>
                  </section>
                )}

              </div>
            </div>

            {/* Modal Footer (Actions) */}
            {selectedApplication.status === 'pending' && (
              <div className="sticky bottom-0 bg-white border-t border-slate-100 px-8 py-5 flex gap-4 z-10">
                <Button
                  onClick={() => {
                    setShowProfileModal(false);
                    setActionType('accept');
                    setMessageForm({
                      title: 'Congratulations! Application Accepted',
                      message: `We are pleased to inform you that your application for ${selectedApplication.job?.jobDetails?.basicInfo?.jobTitle || 'this position'} has been accepted. We will contact you soon with further details.`,
                      meetingLink: ''
                    });
                    setShowMessageModal(true);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 border-0 py-3 text-base font-semibold shadow-emerald-500/20 shadow-lg"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Accept Candidate
                </Button>
                <Button
                  onClick={() => {
                    setShowProfileModal(false);
                    setActionType('reject');
                    setMessageForm({
                      title: 'Application Status Update',
                      message: `Thank you for your interest in the ${selectedApplication.job?.jobDetails?.basicInfo?.jobTitle || 'this'} position. After careful consideration, we have decided to move forward with other candidates at this time.`,
                      meetingLink: ''
                    });
                    setShowMessageModal(true);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 border-0 py-3 text-base font-semibold shadow-red-500/20 shadow-lg"
                >
                  <X className="h-5 w-5 mr-2" />
                  Reject Candidate
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedApplication && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in zoom-in-95 duration-200" onClick={() => setShowMessageModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`px-6 py-5 flex items-center justify-between text-white ${actionType === 'accept' ? 'bg-emerald-600' : 'bg-red-600'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {actionType === 'accept' ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{actionType === 'accept' ? 'Accept Application' : 'Reject Application'}</h2>
                  <p className="text-white/80 text-sm">Send a notification to the candidate</p>
                </div>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  placeholder="Enter message title"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm leading-relaxed"
                  placeholder="Enter your message to the applicant..."
                  required
                />
              </div>

              {actionType === 'accept' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Interview Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={messageForm.meetingLink}
                    onChange={(e) => setMessageForm({ ...messageForm, meetingLink: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!messageForm.title.trim() || !messageForm.message.trim()) {
                      alert('Please fill in both title and message before proceeding.');
                      return;
                    }
                    if (window.confirm(
                      actionType === 'accept'
                        ? `Are you sure you want to ACCEPT this application?`
                        : `Are you sure you want to REJECT this application?`
                    )) {
                      handleUpdateApplicationStatus();
                    }
                  }}
                  className={`flex-1 border-0 ${actionType === 'accept'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  Confirm Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
