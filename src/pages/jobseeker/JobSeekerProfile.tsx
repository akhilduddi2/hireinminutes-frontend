import { useEffect, useState } from 'react';
import {
  User, MapPin, Phone, Edit3, X, FileText, Briefcase, GraduationCap,
  Award, Plus, Trash2, CheckCircle, Mail, Calendar, Camera
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { getApiUrl } from '../../config/api';
import { useAuth, getAuthHeaders } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Experience, Education } from './types';

import { Skeleton } from '../../components/ui/Skeleton';

export function JobSeekerProfile(_props: JobSeekerPageProps) {
  const { profile, refreshProfile, loading } = useAuth();

  if (loading || !profile) {
    return (
      <div className="space-y-10 pb-12">
        {/* Skeleton Header */}
        <div className="relative overflow-hidden rounded-[32px] bg-slate-900/50 h-96 shadow-2xl animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeletons */}
          <div className="space-y-8 lg:col-span-2">
            <div className="p-6 border border-slate-100 rounded-[24px] bg-white h-64">
              <div className="flex gap-4 mb-4">
                <Skeleton className="w-10 h-10 rounded-2xl" />
                <Skeleton className="w-40 h-8 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="p-6 border border-slate-100 rounded-[24px] bg-white h-96">
              <div className="flex justify-between mb-8">
                <div className="flex gap-4">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="w-32 h-8 rounded-lg" />
                </div>
                <Skeleton className="w-32 h-8 rounded-xl" />
              </div>
              <div className="space-y-8">
                {[1, 2].map(i => (
                  <div key={i} className="pl-6 border-l-2 border-slate-100">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeletons */}
          <div className="space-y-8">
            <div className="p-6 border border-slate-100 rounded-[24px] bg-white h-auto space-y-4">
              <div className="flex justify-between">
                <Skeleton className="w-24 h-6" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}
              </div>
            </div>
            <div className="p-6 border border-slate-100 rounded-[24px] bg-white h-64 space-y-4">
              <Skeleton className="w-40 h-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit states
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [editingSkills, setEditingSkills] = useState(false);
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [addingExperience, setAddingExperience] = useState(false);
  const [addingEducation, setAddingEducation] = useState(false);

  // Form states
  const [personalForm, setPersonalForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    profilePicture: '',
  });

  const [summaryForm, setSummaryForm] = useState('');
  const [skillsForm, setSkillsForm] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({});
  const [educationForm, setEducationForm] = useState<Partial<Education>>({});

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setPersonalForm({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.profile?.phone || '',
        dateOfBirth: profile.profile?.dateOfBirth?.split('T')[0] || '',
        gender: profile.profile?.gender || '',
        city: profile.profile?.location?.city || '',
        state: profile.profile?.location?.state || '',
        country: profile.profile?.location?.country || '',
        profilePicture: profile.profilePicture || '',
      });
      setSummaryForm(profile.profile?.professionalSummary || '');
      // Handle skills - can be strings or objects with name property
      const skillsList = profile.profile?.skills || [];
      const normalizedSkills = skillsList.map((skill: string | { name: string }) =>
        typeof skill === 'string' ? skill : skill.name
      );
      setSkillsForm(normalizedSkills);
      setExperiences(profile.profile?.experience || []);
      setEducations(profile.profile?.education || []);
    }
  }, [profile]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calculate profile completion
  const profileCompletion = () => {
    let completed = 0;
    const total = 8;

    if (profile?.fullName) completed++;
    if (profile?.email) completed++;
    if (profile?.profile?.phone) completed++;
    if (profile?.profile?.professionalSummary) completed++;
    if ((profile?.profile?.skills?.length ?? 0) > 0) completed++;
    if ((profile?.profile?.experience?.length ?? 0) > 0) completed++;
    if ((profile?.profile?.education?.length ?? 0) > 0) completed++;
    if (profile?.profilePicture) completed++;

    return Math.round((completed / total) * 100);
  };

  // Save personal info
  const savePersonal = async () => {
    setSaving(true);
    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          fullName: personalForm.fullName,
          // email: personalForm.email, // Email cannot be updated here usually
          profilePicture: personalForm.profilePicture,
          phone: personalForm.phone,
          dateOfBirth: personalForm.dateOfBirth,
          gender: personalForm.gender,
          city: personalForm.city,
          state: personalForm.state,
          country: personalForm.country,
        }),
      });

      if (response.ok) {
        showToast('Personal information updated!');
        setEditingPersonal(false);
        refreshProfile?.();
      } else {
        showToast('Failed to update', 'error');
      }
    } catch (error) {
      showToast('Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save summary
  const saveSummary = async () => {
    setSaving(true);
    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          professionalSummary: summaryForm,
        }),
      });

      if (response.ok) {
        showToast('Summary updated!');
        setEditingSummary(false);
        refreshProfile?.();
      }
    } catch (error) {
      showToast('Error updating summary', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save skills
  const saveSkills = async () => {
    setSaving(true);
    try {
      const response = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          skills: skillsForm.map(skill => ({ name: skill })),
        }),
      });

      if (response.ok) {
        showToast('Skills updated!');
        setEditingSkills(false);
        refreshProfile?.();
      }
    } catch (error) {
      showToast('Error updating skills', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Add skill
  const addSkill = () => {
    if (newSkill.trim() && !skillsForm.includes(newSkill.trim())) {
      setSkillsForm([...skillsForm, newSkill.trim()]);
      setNewSkill('');
    }
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    setSkillsForm(skillsForm.filter(s => s !== skill));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(getApiUrl('/api/auth/upload-profile-picture'), {
        method: 'POST',
        headers: getAuthHeaders(false), // Let browser set Content-Type with boundary for FormData
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setPersonalForm({ ...personalForm, profilePicture: data.url });
        showToast('Profile picture uploaded!');
      } else {
        showToast('Failed to upload', 'error');
      }
    } catch (error) {
      showToast('Error uploading image', 'error');
    }
  };

  // Save experience
  const saveExperience = async () => {
    setSaving(true);
    try {
      const updatedExperiences = addingExperience
        ? [...experiences, { ...experienceForm, id: Date.now().toString() }]
        : experiences.map(exp => exp.id === editingExperience ? { ...exp, ...experienceForm } : exp);

      const response = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          experience: updatedExperiences,
        }),
      });

      if (response.ok) {
        setExperiences(updatedExperiences as Experience[]);
        showToast('Experience saved!');
        setAddingExperience(false);
        setEditingExperience(null);
        setExperienceForm({});
        refreshProfile?.();
      }
    } catch (error) {
      showToast('Error saving experience', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete experience
  const deleteExperience = async (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    try {
      await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          experience: updatedExperiences,
        }),
      });
      setExperiences(updatedExperiences);
      showToast('Experience deleted!');
      refreshProfile?.();
    } catch (error) {
      showToast('Error deleting experience', 'error');
    }
  };

  // Save education
  const saveEducation = async () => {
    setSaving(true);
    try {
      const updatedEducations = addingEducation
        ? [...educations, { ...educationForm, id: Date.now().toString() }]
        : educations.map(edu => edu.id === editingEducation ? { ...edu, ...educationForm } : edu);

      const response = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          education: updatedEducations,
        }),
      });

      if (response.ok) {
        setEducations(updatedEducations as Education[]);
        showToast('Education saved!');
        setAddingEducation(false);
        setEditingEducation(null);
        setEducationForm({});
        refreshProfile?.();
      }
    } catch (error) {
      showToast('Error saving education', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl border-4 border-white/20 shadow-2xl bg-white overflow-hidden flex-shrink-0 backdrop-blur-sm">
                {profile?.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-2.5 bg-white text-slate-900 rounded-xl cursor-pointer hover:bg-slate-100 transition shadow-lg opacity-0 group-hover:opacity-100">
                <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                <Camera className="w-4 h-4" />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-3 text-blue-200">
                <User className="w-3 h-3 fill-current" /> My Profile
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                {profile?.fullName || 'Your Name'}
              </h1>
              <div className="flex flex-wrap gap-4 text-slate-200">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  {profile?.email}
                </div>
                {profile?.profile?.location?.city && (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    {profile.profile.location.city}, {profile.profile.location.country}
                  </div>
                )}
                {profile?.profile?.phone && (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    {profile.profile.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Strength */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 min-w-[180px] shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Profile Strength</span>
                <span className="text-lg font-black text-white">{profileCompletion()}%</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 shadow-lg"
                  style={{ width: `${profileCompletion()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Skills */}
        <div className="space-y-8 lg:col-span-2">

          {/* Professional Summary */}
          <Section value={summaryForm} title="About" icon={FileText} isEditing={editingSummary} onEdit={() => setEditingSummary(true)} onSave={saveSummary} onCancel={() => setEditingSummary(false)}>
            {editingSummary ? (
              <Textarea
                value={summaryForm}
                onChange={(e) => setSummaryForm(e.target.value)}
                placeholder="Write a professional summary..."
                rows={6}
                className="w-full text-sm leading-relaxed"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-sm">
                {profile?.profile?.professionalSummary || 'No summary added yet. Add a professional summary to highlight your expertise.'}
              </p>
            )}
          </Section>

          {/* Experience */}
          <Card className="p-6 border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] relative overflow-hidden bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Experience</h3>
              </div>
              <Button onClick={() => { setAddingExperience(true); setExperienceForm({ employmentType: 'full-time', isCurrentlyWorking: false }); }} variant="outline" size="sm" className="hidden sm:flex rounded-xl border-slate-200 hover:bg-slate-50">
                <Plus className="w-4 h-4 mr-2" /> Add Experience
              </Button>
              <Button onClick={() => { setAddingExperience(true); setExperienceForm({ employmentType: 'full-time', isCurrentlyWorking: false }); }} variant="outline" size="icon" className="sm:hidden rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {(addingExperience || editingExperience) && (
                <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Job Title *</label>
                      <Input value={experienceForm.jobTitle || ''} onChange={(e) => setExperienceForm({ ...experienceForm, jobTitle: e.target.value })} placeholder="e.g. Senior Developer" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Company *</label>
                      <Input value={experienceForm.companyName || ''} onChange={(e) => setExperienceForm({ ...experienceForm, companyName: e.target.value })} placeholder="e.g. Acme Corp" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Employment Type *</label>
                      <select
                        value={experienceForm.employmentType || 'full-time'}
                        onChange={(e) => setExperienceForm({ ...experienceForm, employmentType: e.target.value })}
                        className="w-full text-sm rounded border-slate-200 h-9"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="internship">Internship</option>
                        <option value="freelance">Freelance</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Location</label>
                      <Input value={experienceForm.location || ''} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} placeholder="e.g. New York, NY" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Start Date *</label>
                      <Input type="date" value={experienceForm.startDate ? new Date(experienceForm.startDate).toISOString().split('T')[0] : ''} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">End Date</label>
                      <Input type="date" value={experienceForm.endDate ? new Date(experienceForm.endDate).toISOString().split('T')[0] : ''} onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })} disabled={experienceForm.isCurrentlyWorking} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="currentRole"
                      checked={experienceForm.isCurrentlyWorking || false}
                      onChange={(e) => setExperienceForm({ ...experienceForm, isCurrentlyWorking: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <label htmlFor="currentRole" className="text-sm text-slate-700">I am currently working here</label>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                    <Textarea value={experienceForm.description || ''} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} rows={3} placeholder="Describe your responsibilities..." />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={saveExperience} disabled={saving} className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-slate-900/10">
                      {saving ? 'Saving...' : 'Save Position'}
                    </Button>
                    <Button onClick={() => { setAddingExperience(false); setEditingExperience(null); setExperienceForm({}); }} variant="ghost">Cancel</Button>
                  </div>
                </div>
              )}

              {experiences.length > 0 ? (
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp.id || index} className="relative pl-6 pb-6 border-l-2 border-slate-100 last:pb-0 last:border-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-2 border-white" />
                      <div className="flex items-start justify-between group">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{exp.jobTitle}</h4>
                          <div className="text-sm font-medium text-slate-700">{exp.companyName} • {exp.employmentType}</div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} — {exp.isCurrentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
                            {exp.location && <span>• {exp.location}</span>}
                          </div>
                          {exp.description && (
                            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">{exp.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingExperience(exp.id || exp._id || null); setExperienceForm(exp); }}>
                            <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id || exp._id || '')}>
                            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !addingExperience && (
                  <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 text-sm">No work experience added.</p>
                  </div>
                )
              )}
            </div>
          </Card>

          {/* Education */}
          <Card className="p-6 border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Education</h3>
              </div>
              <Button onClick={() => { setAddingEducation(true); setEducationForm({}); }} variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50">
                <Plus className="w-4 h-4 mr-2" /> Add Education
              </Button>
            </div>

            <div className="space-y-6">
              {(addingEducation || editingEducation) && (
                <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Degree *</label>
                      <Input value={educationForm.degreeName || ''} onChange={(e) => setEducationForm({ ...educationForm, degreeName: e.target.value })} placeholder="e.g. Bachelor of Science" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Field of Study</label>
                      <Input value={educationForm.specialization || ''} onChange={(e) => setEducationForm({ ...educationForm, specialization: e.target.value })} placeholder="e.g. Computer Science" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Institution *</label>
                      <Input value={educationForm.institution || ''} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} placeholder="e.g. University of Technology" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Start Year *</label>
                        <Input type="number" value={educationForm.startYear || ''} onChange={(e) => setEducationForm({ ...educationForm, startYear: parseInt(e.target.value) })} placeholder="2020" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">End Year</label>
                        <Input type="number" value={educationForm.endYear || ''} onChange={(e) => setEducationForm({ ...educationForm, endYear: parseInt(e.target.value) })} placeholder="2024" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Grade</label>
                        <Input value={educationForm.grade || ''} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} placeholder="3.8 GPA" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={saveEducation} disabled={saving} className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-slate-900/10">
                      {saving ? 'Saving...' : 'Save Education'}
                    </Button>
                    <Button onClick={() => { setAddingEducation(false); setEditingEducation(null); setEducationForm({}); }} variant="ghost">Cancel</Button>
                  </div>
                </div>
              )}

              {educations.length > 0 ? (
                <div className="grid gap-4">
                  {educations.map((edu) => (
                    <div key={edu.id || edu._id} className="p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900">{edu.degreeName}</h4>
                          <div className="text-sm font-medium text-slate-700">{edu.institution}</div>
                          <div className="text-xs text-slate-500 mt-1">{edu.specialization} • {edu.startYear} - {edu.endYear || 'Present'}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingEducation(edu.id || edu._id || null); setEducationForm(edu); }}>
                            <Edit3 className="w-4 h-4 text-slate-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !addingEducation && (
                  <div className="text-center py-6 text-slate-500 text-sm">No education added.</div>
                )
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Details & Stats */}
        <div className="space-y-8">
          {/* Section wrapper for custom components */}
          <SkillsSection
            skills={skillsForm}
            isEditing={editingSkills}
            onEdit={() => setEditingSkills(true)}
            onSave={saveSkills}
            onCancel={() => setEditingSkills(false)}
            onAdd={addSkill}
            onRemove={removeSkill}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            saving={saving}
          />

          <Card className="p-6 border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-slate-900">Personal Details</h3>
              </div>
              {!editingPersonal ? (
                <Button variant="ghost" size="sm" onClick={() => setEditingPersonal(true)}>
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button size="sm" onClick={savePersonal} className="h-7 px-2 bg-green-600 hover:bg-green-700 rounded-xl"><CheckCircle className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingPersonal(false)} className="h-7 px-2"><X className="w-3.5 h-3.5" /></Button>
                </div>
              )}
            </div>

            {editingPersonal ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Gender</label>
                  <select
                    value={personalForm.gender}
                    onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                    className="w-full text-sm rounded border-slate-200"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Date of Birth</label>
                  <Input type="date" value={personalForm.dateOfBirth} onChange={(e) => setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">City</label>
                  <Input value={personalForm.city} onChange={(e) => setPersonalForm({ ...personalForm, city: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Country</label>
                  <Input value={personalForm.country} onChange={(e) => setPersonalForm({ ...personalForm, country: e.target.value })} className="h-9 text-sm" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Gender</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">{profile?.profile?.gender || '—'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Born</span>
                  <span className="text-sm font-medium text-slate-900">
                    {profile?.profile?.dateOfBirth ? new Date(profile.profile.dateOfBirth).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Location</span>
                  <span className="text-sm font-medium text-slate-900 text-right">
                    {profile?.profile?.location?.city ? `${profile.profile.location.city}, ${profile.profile.location.country}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-500">Member Since</span>
                  <span className="text-sm font-medium text-slate-900">
                    {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] bg-gradient-to-br from-slate-50 to-white">
            <h3 className="font-bold text-slate-900 mb-2">Public Profile Link</h3>
            <p className="text-xs text-slate-500 mb-4">Share your profile with recruiters directly.</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-600 truncate">
                {window.location.origin}/candidate/{profile?.id}
              </div>
              <Button size="sm" variant="outline" className="shrink-0 rounded-xl border-slate-200 hover:bg-slate-50" onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/candidate/${profile?.id}`);
                showToast('Link copied!');
              }}>
                Copy
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in-up ${toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// Sub-components to keep the main file clean
function Section({ title, icon: Icon, isEditing, onEdit, onSave, onCancel, children }: any) {
  return (
    <Card className="p-6 border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit3 className="w-4 h-4 mr-2" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave} className="bg-slate-900 text-white hover:bg-black font-bold rounded-xl">Save</Button>
            <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        )}
      </div>
      <div>{children}</div>
    </Card>
  );
}

function SkillsSection({ skills, isEditing, onEdit, onSave, onCancel, onAdd, onRemove, newSkill, setNewSkill }: any) {
  return (
    <Card className="p-6 border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-slate-400" />
          <h3 className="font-bold text-slate-900">Skills</h3>
        </div>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit3 className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button size="sm" onClick={onSave} className="h-7 px-2 bg-slate-900 text-white hover:bg-black rounded-xl"><CheckCircle className="w-3.5 h-3.5" /></Button>
            <Button size="sm" variant="ghost" onClick={onCancel} className="h-7 px-2"><X className="w-3.5 h-3.5" /></Button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex gap-2 mb-4">
          <Input
            value={newSkill}
            onChange={(e: any) => setNewSkill(e.target.value)}
            onKeyPress={(e: any) => e.key === 'Enter' && onAdd()}
            placeholder="Add skill..."
            className="h-8 text-sm"
          />
          <Button size="sm" onClick={onAdd} className="h-8 w-8 p-0 shrink-0 bg-slate-900 hover:bg-black text-white rounded-xl"><Plus className="w-4 h-4" /></Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill: string, idx: number) => (
            <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-700 border border-slate-100 shadow-sm">
              {skill}
              {isEditing && (
                <button onClick={() => onRemove(skill)} className="ml-1.5 text-slate-400 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500 italic">No skills added.</p>
        )}
      </div>
    </Card>
  )
}

export default JobSeekerProfile;
