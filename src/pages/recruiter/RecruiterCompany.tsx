import {
  Building2, MapPin, Users, Globe, ExternalLink, Phone, CheckCircle,
  Shield, Briefcase, Download, Link as LinkIcon, Linkedin, Twitter, Sparkles
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { RecruiterPageProps } from './types';

// Interface representing the full User object structure as passed via 'profile' prop
interface CompanyProfile {
  // Live profile data
  profile?: {
    fullName?: string;
    jobTitle?: string;
    workEmail?: string;
    workPhone?: string;
    phone?: string;

    company?: {
      name?: string;
      logo?: string;
      description?: string;

      // Location might be nested in headOfficeLocation or direct
      headOfficeLocation?: {
        address?: string;
        city?: string;
        state?: string;
        country?: string;
      };

      size?: string;
      website?: string;
      images?: string[]; // Often stored here in some schemas, or only in onboarding

      socialLinks?: {
        linkedin?: string;
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
      };
    };
  };

  // Historic onboarding data
  recruiterOnboardingDetails?: {
    isComplete?: boolean;
    phone?: string;
    phoneVerified?: boolean;
    jobTitle?: string;
    employmentProof?: string;
    submittedAt?: string;
    company?: {
      name?: string;
      logo?: string;
      address?: string; // Flat address in onboarding
      size?: string;
      website?: string;
      images?: string[];
      socialLinks?: {
        linkedin?: string;
        facebook?: string;
        twitter?: string;
        instagram?: string;
      };
    };
  };
}

interface RecruiterCompanyProps extends RecruiterPageProps {
  profile: CompanyProfile | null;
  onNavigateToOnboarding: () => void;
}

export function RecruiterCompany({ profile, onNavigateToOnboarding }: RecruiterCompanyProps) {
  // Primary source: Live Profile Data
  const liveCompany = profile?.profile?.company;
  // Fallback source: Onboarding Data
  const onboardingCompany = profile?.recruiterOnboardingDetails?.company;

  const onboarding = profile?.recruiterOnboardingDetails;

  // Normalize company data for display
  const displayCompany = {
    name: liveCompany?.name || onboardingCompany?.name || 'Company Name',
    logo: liveCompany?.logo || onboardingCompany?.logo,
    website: liveCompany?.website || onboardingCompany?.website,
    size: liveCompany?.size || onboardingCompany?.size,

    // Address normalization: Prioritize meaningful data
    address: (liveCompany?.headOfficeLocation?.address && liveCompany.headOfficeLocation.address.trim() !== '')
      ? liveCompany.headOfficeLocation.address
      : (liveCompany?.headOfficeLocation?.city ? `${liveCompany.headOfficeLocation.city}, ${liveCompany.headOfficeLocation.country || ''}` : undefined)
      || onboardingCompany?.address,

    // Images might only exist in onboarding if not moved to profile yet
    images: liveCompany?.images || onboardingCompany?.images || [],

    socialLinks: liveCompany?.socialLinks || onboardingCompany?.socialLinks
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {onboarding?.isComplete ? (
        <>
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[280px] flex items-end p-8 md:p-10 shadow-xl ring-1 ring-white/10 group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
            <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-purple-600 rounded-full opacity-30 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-blue-600 rounded-full opacity-30 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

            {/* Company Info Content */}
            <div className="relative z-20 flex flex-col md:flex-row items-end md:items-end gap-6 w-full">
              <div className="w-28 h-28 rounded-2xl bg-white p-2 shadow-2xl border-4 border-white/20 backdrop-blur-sm -mb-0 md:-mb-0 flex-shrink-0 flex items-center justify-center">
                {displayCompany.logo ? (
                  <img
                    src={displayCompany.logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-slate-400" />
                )}
              </div>

              <div className="flex-1 mb-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{displayCompany.name}</h1>
                  {onboarding.phoneVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-semibold border border-emerald-500/30 backdrop-blur-md">
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm md:text-base font-medium">
                  {displayCompany.address && (
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-400" /> {displayCompany.address}</span>
                  )}
                  {displayCompany.size && (
                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-400" /> {displayCompany.size} employees</span>
                  )}
                  {displayCompany.website && (
                    <a href={displayCompany.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Globe className="h-4 w-4 text-pink-400" /> {new URL(displayCompany.website).hostname} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <Button variant="outline" onClick={() => { }} className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Left Column: Verification & Contact */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" /> Verification Status
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Role</p>
                      <p className="font-semibold text-slate-900">{profile?.profile?.jobTitle || onboarding.jobTitle || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Location</p>
                      <p className="font-semibold text-slate-900">{displayCompany.address || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Employment Proof</p>
                      <p className="font-semibold text-slate-900 text-sm mb-2">Document Verified</p>
                      {onboarding.employmentProof && (
                        <a
                          href={onboarding.employmentProof}
                          download
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" /> Download
                        </a>
                      )}
                    </div>
                  </div>

                  {(profile?.profile?.phone || onboarding.phone) && (
                    <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Contact</p>
                        <p className="font-semibold text-slate-900">{profile?.profile?.phone || onboarding.phone}</p>
                        {onboarding.phoneVerified && (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                            <CheckCircle className="h-3 w-3" /> Phone Verified
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {displayCompany.socialLinks && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-slate-600" /> Social Profiles
                  </h3>
                  <div className="space-y-3">
                    {displayCompany.socialLinks.linkedin && (
                      <a href={displayCompany.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                        <Linkedin className="h-5 w-5 text-[#0077b5]" />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">LinkedIn</span>
                        <ExternalLink className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {displayCompany.socialLinks.twitter && (
                      <a href={displayCompany.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                        <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Twitter</span>
                        <ExternalLink className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {displayCompany.socialLinks.facebook && (
                      <a href={displayCompany.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#1877F2] text-white font-bold text-[10px]">f</span>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Facebook</span>
                        <ExternalLink className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {displayCompany.socialLinks.instagram && (
                      <a href={displayCompany.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                        <span className="w-5 h-5 flex items-center justify-center rounded-md bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white font-bold text-[10px]">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </span>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Instagram</span>
                        <ExternalLink className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Gallery & About */}
            <div className="md:col-span-2 space-y-6">
              {displayCompany.images && displayCompany.images.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Office & Culture
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayCompany.images.map((image: string, index: number) => (
                      <div key={index} className="aspect-video relative group overflow-hidden rounded-xl border border-slate-100 shadow-sm cursor-zoom-in bg-slate-100">
                        <img
                          src={image}
                          alt={`Company image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholder for future sections like 'About Us' text if it existed in the model */}
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center">
                <p className="text-slate-500 italic">
                  More company details and "About Us" content can be added here in the future.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Building2 className="h-10 w-10 text-slate-300" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 text-center">Setup Your Company Profile</h1>
          <p className="text-slate-500 text-lg mb-8 text-center max-w-lg">
            Complete your recruiter onboarding to verify your company details, unlock job posting features, and start hiring.
          </p>
          <Button
            onClick={onNavigateToOnboarding}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg rounded-xl shadow-xl shadow-slate-900/20"
          >
            <Building2 className="mr-2 h-5 w-5" />
            Complete Onboarding Now
          </Button>
        </div>
      )}
    </div>
  );
}
