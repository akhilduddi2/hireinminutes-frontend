import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import {
  MapPin, Calendar, Award, Code, Briefcase, GraduationCap,
  ExternalLink, Github, Linkedin, Twitter, Globe, Mail,
  Share2, Copy, CheckCircle, Star, Users, Trophy
} from 'lucide-react';

interface PublicCandidateProfileProps {
  profileSlug?: string;
}

interface PublicCandidateProfile {
  _id: string;
  fullName: string;
  slug: string;
  profilePicture?: string;
  profile: {
    profilePhoto?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
    professionalSummary?: string;
    skills?: Array<{
      name: string;
      isVerified: boolean;
    }>;
    experience?: Array<{
      jobTitle: string;
      companyName: string;
      employmentType: string;
      location?: string;
      startDate: Date;
      endDate?: Date;
      isCurrentlyWorking: boolean;
    }>;
    education?: Array<{
      degreeName: string;
      institution: string;
      specialization?: string;
      startYear: number;
      endYear?: number;
      score?: string;
    }>;
    projects?: Array<{
      title: string;
      description: string;
      techStack: string[];
      githubLink?: string;
      demoLink?: string;
      isLive: boolean;
    }>;
    certifications?: Array<{
      certificateName: string;
      issuingOrganization: string;
      issueDate?: Date;
    }>;
    socialProfiles?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
    };
    codingProfiles?: {
      leetcode?: string;
      hackerrank?: string;
    };
  };
  isVerified: boolean;
  profileCompletion: {
    overall: number;
  };
  createdAt: string;
}

export function PublicCandidateProfile({ profileSlug }: PublicCandidateProfileProps) {
  const [candidate, setCandidate] = useState<PublicCandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profileSlug) {
      fetchCandidateProfile();
    }
  }, [profileSlug]);

  const fetchCandidateProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/candidates/profile/${profileSlug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      setCandidate(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const shareProfile = async (platform: string) => {
    if (!candidate) return;

    const profileUrl = `${window.location.origin}/c/${candidate.slug}`;
    const text = `Check out ${candidate.fullName}'s profile on V Hire Today! 🚀`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + profileUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Profile Not Found</h2>
          <p className="text-slate-600">{error || 'The profile you\'re looking for doesn\'t exist.'}</p>
        </div>
      </div>
    );
  }

  const profileUrl = `${window.location.origin}/c/${candidate.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                VH
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">V Hire Today</h1>
                <p className="text-slate-600">Professional Profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.open('/', '_blank')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <span>🏠</span>
                <span>Visit Platform</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
              <div className="relative">
                <img
                  src={candidate.profile?.profilePhoto || candidate.profilePicture || '/default-avatar.png'}
                  alt={candidate.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {candidate.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-3xl font-bold text-slate-800">{candidate.fullName}</h2>
                  {candidate.isVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
                {candidate.profile?.location && (
                  <div className="flex items-center text-slate-600 mb-3">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>
                      {candidate.profile.location.city}, {candidate.profile.location.state}, {candidate.profile.location.country}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {new Date(candidate.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    <span>{candidate.profileCompletion.overall}% Profile Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share this profile
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => shareProfile('whatsapp')}
                  className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                >
                  <span>📱</span>
                  <span>WhatsApp</span>
                </Button>
                <Button
                  onClick={() => shareProfile('linkedin')}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </Button>
                <Button
                  onClick={() => shareProfile('twitter')}
                  className="bg-sky-500 hover:bg-sky-600 flex items-center space-x-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </Button>
                <Button
                  onClick={() => shareProfile('copy')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Summary */}
            {candidate.profile?.professionalSummary && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Professional Summary
                </h3>
                <p className="text-slate-700 leading-relaxed">{candidate.profile.professionalSummary}</p>
              </div>
            )}

            {/* Skills */}
            {candidate.profile?.skills && candidate.profile.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-green-600" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {candidate.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        skill.isVerified
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {skill.isVerified && <CheckCircle className="w-3 h-3 mr-1" />}
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {candidate.profile?.experience && candidate.profile.experience.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                  Experience
                </h3>
                <div className="space-y-6">
                  {candidate.profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-semibold text-slate-800">{exp.jobTitle}</h4>
                      <p className="text-blue-600 font-medium">{exp.companyName}</p>
                      <p className="text-slate-600 text-sm mb-2">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                      </p>
                      {exp.location && <p className="text-slate-500 text-sm">{exp.location}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {candidate.profile?.projects && candidate.profile.projects.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-orange-600" />
                  Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidate.profile.projects.map((project, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-slate-800 mb-2">{project.title}</h4>
                      <p className="text-slate-600 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.techStack.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-3">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 flex items-center text-sm">
                            <Github className="w-4 h-4 mr-1" />
                            Code
                          </a>
                        )}
                        {project.demoLink && (
                          <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Education */}
            {candidate.profile?.education && candidate.profile.education.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
                  Education
                </h3>
                <div className="space-y-4">
                  {candidate.profile.education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-slate-800">{edu.degreeName}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                      <p className="text-slate-500 text-sm">
                        {edu.startYear} - {edu.endYear || 'Present'}
                      </p>
                      {edu.score && <p className="text-slate-500 text-sm">Score: {edu.score}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {candidate.profile?.certifications && candidate.profile.certifications.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Certifications
                </h3>
                <div className="space-y-3">
                  {candidate.profile.certifications.map((cert, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3">
                      <h4 className="font-semibold text-slate-800 text-sm">{cert.certificateName}</h4>
                      <p className="text-slate-600 text-sm">{cert.issuingOrganization}</p>
                      {cert.issueDate && (
                        <p className="text-slate-500 text-xs">
                          Issued: {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(candidate.profile?.socialProfiles || candidate.profile?.codingProfiles) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Connect
                </h3>
                <div className="space-y-3">
                  {candidate.profile.socialProfiles?.linkedin && (
                    <a href={candidate.profile.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 text-slate-700 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {candidate.profile.socialProfiles?.github && (
                    <a href={candidate.profile.socialProfiles.github} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 text-slate-700 hover:text-slate-800 transition-colors">
                      <Github className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {candidate.profile.socialProfiles?.twitter && (
                    <a href={candidate.profile.socialProfiles.twitter} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 text-slate-700 hover:text-sky-500 transition-colors">
                      <Twitter className="w-5 h-5" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {candidate.profile.socialProfiles?.website && (
                    <a href={candidate.profile.socialProfiles.website} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 text-slate-700 hover:text-purple-600 transition-colors">
                      <Globe className="w-5 h-5" />
                      <span>Website</span>
                    </a>
                  )}
                  {candidate.profile.codingProfiles?.leetcode && (
                    <a href={`https://leetcode.com/${candidate.profile.codingProfiles.leetcode}`} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 text-slate-700 hover:text-orange-600 transition-colors">
                      <Code className="w-5 h-5" />
                      <span>LeetCode</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicCandidateProfile;