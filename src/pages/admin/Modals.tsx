import React from 'react';
import { Button } from '../../components/ui/Button';
import { X, AlertTriangle, Mail, Phone, MapPin, Briefcase, GraduationCap, Shield, Building2, Globe, FileText } from 'lucide-react';
import type { Candidate, RecruiterProfile, VerificationApplication } from './types';

// Delete Confirmation Dialog
interface DeleteDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="text-slate-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

// Verify Confirmation Dialog
interface VerifyDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const VerifyDialog: React.FC<VerifyDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verify Candidate</h2>
              <p className="text-slate-600">Are you sure you want to verify this candidate?</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onConfirm}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};

// Reject Recruiter Dialog
interface RejectRecruiterDialogProps {
  isOpen: boolean;
  recruiterName: string;
  rejectionReason: string;
  onRejectionReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RejectRecruiterDialog: React.FC<RejectRecruiterDialogProps> = ({
  isOpen,
  recruiterName,
  rejectionReason,
  onRejectionReasonChange,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reject Recruiter Application</h2>
              <p className="text-slate-600">Are you sure you want to reject {recruiterName}'s application?</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rejection Reason (Optional)
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              placeholder="Provide feedback to help the recruiter improve their application..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Reject Application
          </Button>
        </div>
      </div>
    </div>
  );
};

// Profile Modal for Candidates and Recruiters
interface ProfileModalProps {
  isOpen: boolean;
  profile: Candidate | RecruiterProfile | null;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onClose
}) => {
  if (!isOpen || !profile) return null;

  // Type guard to check if it's a recruiter profile
  const isRecruiterProfile = (p: Candidate | RecruiterProfile): p is RecruiterProfile => {
    return '_isRecruiterProfile' in p && p._isRecruiterProfile === true;
  };

  if (isRecruiterProfile(profile)) {
    const onboarding = profile.recruiterOnboardingDetails;
    const company = onboarding?.company;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recruiter Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="flex items-start gap-4">
              {company?.logo && (
                <img
                  src={company.logo}
                  alt="Company Logo"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{profile.fullName}</h3>
                <p className="text-slate-600">{onboarding?.jobTitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${onboarding?.isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {onboarding?.isComplete ? 'Onboarding Complete' : 'Pending'}
                  </span>
                  {profile.isVerified && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                {onboarding?.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{onboarding.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Company Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="h-4 w-4" />
                  <span>{company?.name}</span>
                </div>
                {company?.website && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="h-4 w-4" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  </div>
                )}
                {company?.size && (
                  <div className="text-slate-600">
                    <span className="font-medium">Company Size:</span> {company.size}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="text-sm text-slate-500">
              <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="p-6 border-t border-slate-200 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  // Candidate Profile
  const candidateProfile = profile.profile;
  const candidateLocation = candidateProfile?.location;
  const locationStr = candidateLocation
    ? [candidateLocation.city, candidateLocation.state, candidateLocation.country].filter(Boolean).join(', ')
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Candidate Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-start gap-4">
            {(profile.profilePicture || candidateProfile?.profilePhoto) && (
              <img
                src={profile.profilePicture || candidateProfile?.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{profile.fullName}</h3>
              <p className="text-slate-600">{candidateProfile?.professionalSummary?.substring(0, 100)}</p>
              <div className="flex items-center gap-2 mt-2">
                {profile.isVerified && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              {candidateProfile?.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4" />
                  <span>{candidateProfile.phone}</span>
                </div>
              )}
              {locationStr && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>{locationStr}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Details */}
          {(candidateProfile?.experience || candidateProfile?.skills) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Professional Details</h4>
              {candidateProfile?.experience && candidateProfile.experience.length > 0 && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{candidateProfile.experience.length} work experience(s)</span>
                </div>
              )}
              {candidateProfile?.skills && candidateProfile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.skills.map((skill: { name: string; isVerified: boolean }, index: number) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-sm rounded ${skill.isVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                        }`}
                    >
                      {skill.name} {skill.isVerified && '✓'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {candidateProfile?.education && candidateProfile.education.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Education</h4>
              {candidateProfile.education.map((edu: { degreeName: string; institution: string; specialization?: string; endYear?: number }, index: number) => (
                <div key={index} className="flex items-start gap-2 text-slate-600">
                  <GraduationCap className="h-4 w-4 mt-1" />
                  <div>
                    <div className="font-medium">{edu.degreeName}{edu.specialization ? ` in ${edu.specialization}` : ''}</div>
                    <div className="text-sm">{edu.institution}</div>
                    {edu.endYear && <div className="text-sm text-slate-500">{edu.endYear}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bio */}
          {candidateProfile?.professionalSummary && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">About</h4>
              <p className="text-slate-600 whitespace-pre-wrap">{candidateProfile.professionalSummary}</p>
            </div>
          )}

          {/* Resume */}
          {candidateProfile?.documents?.resume && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Resume</h4>
              <a
                href={candidateProfile.documents.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <FileText className="h-4 w-4" />
                View Resume
              </a>
            </div>
          )}

          {/* Additional Details */}
          <div className="text-sm text-slate-500">
            <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

// Verification Application Modal
interface VerificationModalProps {
  isOpen: boolean;
  application: VerificationApplication | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  application,
  onClose,
  onApprove,
  onReject
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Verification Application</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Company Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Company Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Company Name</label>
                <p className="text-slate-900">{application.companyName}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Industry</label>
                <p className="text-slate-900">{application.industry}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Email</label>
                <p className="text-slate-900">{application.companyEmail}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Website</label>
                <a href={application.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {application.companyWebsite}
                </a>
              </div>
            </div>
          </div>

          {/* Documents */}
          {application.documents && application.documents.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Submitted Documents</h4>
              <div className="space-y-2">
                {application.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Document {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-sm text-slate-500">Current Status</label>
            <p className={`inline-flex px-3 py-1 rounded-full text-sm mt-1 ${application.status === 'approved' ? 'bg-green-100 text-green-700' :
              application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
              {application.status}
            </p>
          </div>

          {/* Submission Date */}
          <div className="text-sm text-slate-500">
            Submitted: {new Date(application.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {application.status === 'pending' && (
            <>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={onReject}
              >
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onApprove}
              >
                Approve
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default {
  DeleteDialog,
  VerifyDialog,
  ProfileModal,
  VerificationModal
};
