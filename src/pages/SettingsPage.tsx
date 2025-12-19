import { useEffect, useState, useCallback } from 'react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface Company {
  id?: string;
  name: string;
  logo_url: string;
  website: string;
  industry: string;
  company_size: string;
  description: string;
  location: string;
}

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [, setCompany] = useState<Company | null>(null);
  const [tab, setTab] = useState(profile?.role === 'employer' ? 'company' : 'profile');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    experience_years: '',
    resume_url: '',
  });

  const [companyData, setCompanyData] = useState({
    name: '',
    logo_url: '',
    website: '',
    industry: '',
    company_size: '',
    description: '',
    location: '',
  });

  const loadCompany = useCallback(async () => {
    if (!profile) return;

    // Dummy data - Supabase removed
    const dummyCompany: Company = {
      name: 'Tech Corp',
      logo_url: '',
      website: 'https://techcorp.com',
      industry: 'Technology',
      company_size: '100-500',
      description: 'Leading tech company',
      location: 'New York'
    };
    setCompany(dummyCompany);
    setCompanyData(dummyCompany);
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.fullName || '',
        email: profile.email || '',
        phone: profile.profile?.phone || '',
        location: profile.profile?.location?.city || '',
        bio: profile.profile?.professionalSummary || '',
        experience_years: profile.profile?.experience?.length?.toString() || '0',
        resume_url: profile.resume_url || '',
      });

      if (profile.role === 'employer') {
        loadCompany();
      }
    }
  }, [profile, loadCompany]);



  const handleSaveProfile = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // Dummy implementation - Supabase removed
      console.log('Profile updated');
      refreshProfile();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // Dummy implementation - Supabase removed
      console.log('Company settings saved');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-b-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate mb-10 pt-24">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <button
            onClick={() => onNavigate(profile?.role === 'employer' ? 'recruiter-dashboard' : 'job-seeker-dashboard')}
            className="flex items-center text-slate-300 hover:text-white mb-6 transition-colors font-bold text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Account Settings</h1>
          <p className="text-lg text-slate-400 font-medium">Manage your profile details and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 w-fit mx-auto md:mx-0">
          {profile?.role === 'employer' ? (
            <>
              <button
                onClick={() => setTab('company')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${tab === 'company'
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                Company Profile
              </button>
              <button
                onClick={() => setTab('profile')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${tab === 'profile'
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                Personal Info
              </button>
            </>
          ) : (
            <button
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/10"
            >
              Personal Profile
            </button>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

          {tab === 'profile' && (
            <div className="p-8 md:p-10">
              <div className="mb-8 pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
                <p className="text-slate-500 mt-1">Update your personal details and resume.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-slate-50 text-slate-500 border-slate-100 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                  />
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                  />
                </div>

                {profile?.role === 'job_seeker' && (
                  <>
                    <Textarea
                      label="Bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      rows={4}
                      className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Years of Experience"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                        className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                      />
                      <Input
                        label="Resume URL"
                        value={formData.resume_url}
                        onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                        placeholder="https://..."
                        className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <Button type="submit" disabled={loading} className="px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {tab === 'company' && profile?.role === 'employer' && (
            <div className="p-8 md:p-10">
              <div className="mb-8 pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900">Company Profile</h2>
                <p className="text-slate-500 mt-1">Manage your company's public information.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveCompany(); }} className="space-y-6 max-w-2xl">
                <Input
                  label="Company Name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  required
                  className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Website"
                    type="url"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                  />
                  <Input
                    label="Industry"
                    value={companyData.industry}
                    onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                    className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 block">Company Size</label>
                    <Select
                      label=""
                      value={companyData.company_size}
                      onChange={(e) => setCompanyData({ ...companyData, company_size: e.target.value })}
                      options={[
                        { value: '', label: 'Select company size' },
                        { value: '1-10', label: '1-10 employees' },
                        { value: '11-50', label: '11-50 employees' },
                        { value: '51-200', label: '51-200 employees' },
                        { value: '201-500', label: '201-500 employees' },
                        { value: '500+', label: '500+ employees' },
                      ]}
                      className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0 w-full"
                    />
                  </div>
                  <Input
                    label="Location"
                    value={companyData.location}
                    onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                    className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                  />
                </div>

                <Textarea
                  label="Description"
                  value={companyData.description}
                  onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                  placeholder="Tell us about your company"
                  rows={4}
                  className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-0"
                />

                <div className="pt-4">
                  <Button type="submit" disabled={loading} className="px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                    {loading ? 'Saving...' : 'Save Company'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}