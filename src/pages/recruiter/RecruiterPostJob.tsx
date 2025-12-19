import { useState, useEffect } from 'react';
import { Check, X, ArrowLeft, ArrowRight, UploadCloud } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { RecruiterPageProps, JobFormData } from './types';

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface RecruiterPostJobProps extends RecruiterPageProps {
  onJobPosted: () => void;
  onCancel: () => void;
}

const initialJobForm: JobFormData = {
  jobTitle: '',
  department: '',
  numberOfOpenings: 1,
  employmentType: 'full-time',
  workMode: 'onsite',
  jobLevel: 'fresher',
  city: '',
  state: '',
  country: '',
  officeAddress: '',
  salary: '',
  salaryType: 'annual',
  roleSummary: '',
  responsibilities: [''],
  requiredSkills: [''],
  minimumEducation: 'bachelors',
  preferredEducation: '',
  yearsOfExperience: 0,
  benefits: ['']
};

export function RecruiterPostJob({ onJobPosted, onCancel }: RecruiterPostJobProps) {
  const { profile: userProfile } = useAuth(); // renamed to avoid conflict
  const [currentStep, setCurrentStep] = useState(1);
  const [jobForm, setJobForm] = useState<JobFormData>(initialJobForm);
  const [loading, setLoading] = useState(false);

  // Pre-fill form from recruiter profile
  useEffect(() => {
    if (userProfile) {
      // Get address from onboarding details or profile
      const onboardingAddress = userProfile.recruiterOnboardingDetails?.company?.address;
      const profileAddress = userProfile.profile?.company?.headOfficeLocation?.address;

      const address = profileAddress || onboardingAddress;

      if (address) {
        setJobForm(prev => ({
          ...prev,
          officeAddress: address,
          // Try to infer city/state/country if address has commas
          // This is a naive heuristic but helpful
          ...(address.includes(',') ? {
            city: address.split(',')[1]?.trim() || prev.city,
            state: address.split(',')[2]?.trim() || prev.state
          } : {})
        }));
      }

      const city = userProfile.profile?.company?.headOfficeLocation?.city;
      const state = userProfile.profile?.company?.headOfficeLocation?.state;
      const country = userProfile.profile?.company?.headOfficeLocation?.country;

      if (city || state || country) {
        setJobForm(prev => ({
          ...prev,
          city: city || prev.city,
          state: state || prev.state,
          country: country || prev.country
        }));
      }
    }
  }, [userProfile]);

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return jobForm.jobTitle && jobForm.department && jobForm.employmentType && jobForm.workMode && jobForm.jobLevel;
      case 2:
        return jobForm.city && jobForm.state && jobForm.country;
      case 3:
        return jobForm.salary;
      case 4:
        return jobForm.roleSummary && jobForm.responsibilities.some(r => r.trim()) && jobForm.requiredSkills.some(s => s.trim());
      case 5:
        return jobForm.minimumEducation && jobForm.yearsOfExperience >= 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        jobDetails: {
          basicInfo: {
            jobTitle: jobForm.jobTitle,
            department: jobForm.department,
            numberOfOpenings: jobForm.numberOfOpenings,
            employmentType: jobForm.employmentType,
            workMode: jobForm.workMode,
            jobLevel: jobForm.jobLevel
          },
          location: {
            city: jobForm.city,
            state: jobForm.state,
            country: jobForm.country,
            officeAddress: jobForm.officeAddress
          },
          compensation: {
            salary: parseInt(jobForm.salary),
            salaryType: jobForm.salaryType
          },
          description: {
            roleSummary: jobForm.roleSummary,
            responsibilities: jobForm.responsibilities.filter(r => r.trim()),
            requiredSkills: jobForm.requiredSkills.filter(s => s.trim())
          },
          qualifications: {
            minimumEducation: jobForm.minimumEducation,
            preferredEducation: jobForm.preferredEducation || undefined,
            yearsOfExperience: jobForm.yearsOfExperience
          }
        },
        benefits: jobForm.benefits.filter(b => b.trim()),
        status: 'active'
      };

      const headers = getAuthHeaders();
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create job: ${response.status} ${errorText}`);
      }

      alert('Job posted successfully!');
      setJobForm(initialJobForm);
      setCurrentStep(1);
      onJobPosted();
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basics' },
    { number: 2, title: 'Location' },
    { number: 3, title: 'Pay' },
    { number: 4, title: 'Details' },
    { number: 5, title: 'Quals' },
    { number: 6, title: 'Review' }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in font-sans pb-24 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Glassmorphic Header - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 md:p-10 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-purple-200">
            <UploadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Create Job Posting
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2">Post a New Job</h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium">Create a compelling job post to attract the best talent.</p>
        </div>
      </div>

      {/* Step Indicator - Mobile Optimized */}
      <div className="relative px-2 sm:px-0">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="relative z-10 flex justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center gap-1 sm:gap-2">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-4 transition-all duration-300 ${step.number < currentStep
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                  : step.number === currentStep
                    ? 'bg-white border-blue-600 text-blue-600 shadow-xl shadow-blue-500/20 scale-125'
                    : 'bg-white border-slate-200 text-slate-400'
                  }`}
              >
                {step.number < currentStep ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.number}
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${step.number <= currentStep ? 'text-slate-800' : 'text-slate-400'
                } hidden sm:block`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-[24px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Progress Bar Top */}
        <div className="h-1.5 bg-slate-50 w-full">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out" style={{ width: `${(currentStep / 6) * 100}%` }}></div>
        </div>

        <form onSubmit={handleJobSubmit} className="p-8 md:p-10">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
                <p className="text-slate-500 mt-1">Let's start with the core details of the role.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Job Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={jobForm.jobTitle}
                    onChange={(e) => setJobForm({ ...jobForm, jobTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    placeholder="e.g., Senior React Developer"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Department <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    placeholder="e.g., Engineering, Marketing"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Employment Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={jobForm.employmentType}
                      onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Work Mode <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={jobForm.workMode}
                      onChange={(e) => setJobForm({ ...jobForm, workMode: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="onsite">On-site</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Job Level <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={jobForm.jobLevel}
                      onChange={(e) => setJobForm({ ...jobForm, jobLevel: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="fresher">Fresher</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                      <option value="executive">Executive</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Number of Openings <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="1"
                  value={jobForm.numberOfOpenings}
                  onChange={(e) => setJobForm({ ...jobForm, numberOfOpenings: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="1"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Location Details</h2>
                <p className="text-slate-500 mt-1">Where will this role be based?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={jobForm.city}
                    onChange={(e) => setJobForm({ ...jobForm, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="e.g., Bangalore"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">State <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={jobForm.state}
                    onChange={(e) => setJobForm({ ...jobForm, state: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="e.g., Karnataka"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Country <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={jobForm.country}
                    onChange={(e) => setJobForm({ ...jobForm, country: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="e.g., India"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Office Address</label>
                  <input
                    type="text"
                    value={jobForm.officeAddress}
                    onChange={(e) => setJobForm({ ...jobForm, officeAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Complete office address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Compensation */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Compensation</h2>
                <p className="text-slate-500 mt-1">Define the salary range for this position.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Salary <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="0"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="e.g., 50000"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Salary Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={jobForm.salaryType}
                      onChange={(e) => setJobForm({ ...jobForm, salaryType: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="annual">Annual</option>
                      <option value="monthly">Monthly</option>
                      <option value="hourly">Hourly</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-700">
                Note: Enter the salary amount in your local currency. This will be displayed to candidates precisely as entered.
              </p>
            </div>
          )}

          {/* Step 4: Description */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Job Description</h2>
                <p className="text-slate-500 mt-1">Describe the role, responsibilities, and requirements.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Role Summary <span className="text-red-500">*</span></label>
                <textarea
                  value={jobForm.roleSummary}
                  onChange={(e) => setJobForm({ ...jobForm, roleSummary: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="The ideal candidate will..."
                  rows={6}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Key Responsibilities <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  {jobForm.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex gap-3 group">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs mt-3 font-bold">{index + 1}</span>
                      <input
                        type="text"
                        value={responsibility}
                        onChange={(e) => {
                          const newResponsibilities = [...jobForm.responsibilities];
                          newResponsibilities[index] = e.target.value;
                          setJobForm({ ...jobForm, responsibilities: newResponsibilities });
                        }}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Add a responsibility..."
                      />
                      {jobForm.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newResponsibilities = jobForm.responsibilities.filter((_, i) => i !== index);
                            setJobForm({ ...jobForm, responsibilities: newResponsibilities });
                          }}
                          className="px-3 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setJobForm({ ...jobForm, responsibilities: [...jobForm.responsibilities, ''] })}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-bold px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors ml-9"
                  >
                    + Add Another Responsibility
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Required Skills <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  {jobForm.requiredSkills.map((skill, index) => (
                    <div key={index} className="flex gap-3 group">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs mt-3 font-bold">•</span>
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...jobForm.requiredSkills];
                          newSkills[index] = e.target.value;
                          setJobForm({ ...jobForm, requiredSkills: newSkills });
                        }}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="e.g., React.js, Node.js"
                      />
                      {jobForm.requiredSkills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = jobForm.requiredSkills.filter((_, i) => i !== index);
                            setJobForm({ ...jobForm, requiredSkills: newSkills });
                          }}
                          className="px-3 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setJobForm({ ...jobForm, requiredSkills: [...jobForm.requiredSkills, ''] })}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-bold px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors ml-9"
                  >
                    + Add Another Skill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Qualifications */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Qualifications</h2>
                <p className="text-slate-500 mt-1">Education and experience requirements.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Minimum Education <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={jobForm.minimumEducation}
                      onChange={(e) => setJobForm({ ...jobForm, minimumEducation: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="high-school">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Preferred Education</label>
                  <div className="relative">
                    <select
                      value={jobForm.preferredEducation}
                      onChange={(e) => setJobForm({ ...jobForm, preferredEducation: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Not specified</option>
                      <option value="high-school">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Years of Experience <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    value={jobForm.yearsOfExperience}
                    onChange={(e) => setJobForm({ ...jobForm, yearsOfExperience: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value={0}>Fresher (0 years)</option>
                    <option value={1}>1+ years</option>
                    <option value={2}>2+ years</option>
                    <option value={3}>3+ years</option>
                    <option value={5}>5+ years</option>
                    <option value={7}>7+ years</option>
                    <option value={10}>10+ years</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Benefits & Perks</label>
                <div className="space-y-3">
                  {jobForm.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-3 group">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs mt-2.5 font-bold">+</span>
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...jobForm.benefits];
                          newBenefits[index] = e.target.value;
                          setJobForm({ ...jobForm, benefits: newBenefits });
                        }}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="e.g., Health Insurance, Remote Work"
                      />
                      {jobForm.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newBenefits = jobForm.benefits.filter((_, i) => i !== index);
                            setJobForm({ ...jobForm, benefits: newBenefits });
                          }}
                          className="px-3 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setJobForm({ ...jobForm, benefits: [...jobForm.benefits, ''] })}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-bold px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors ml-9"
                  >
                    + Add Another Benefit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Review & Submit</h2>
                <p className="text-slate-500 mt-1">Review your job posting before publishing.</p>
              </div>

              <div className="space-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <div className="grid md:grid-cols-2 gap-8 border-b border-slate-200 pb-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Basic Info</h3>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-slate-900">{jobForm.jobTitle}</p>
                      <p className="text-slate-600"><span className="font-medium text-slate-900">Dept:</span> {jobForm.department}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">{jobForm.employmentType}</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">{jobForm.workMode}</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">{jobForm.jobLevel}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Location & Pay</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><span className="font-medium text-slate-900">Location:</span> {jobForm.city}, {jobForm.state}, {jobForm.country}</p>
                      <p><span className="font-medium text-slate-900">Office:</span> {jobForm.officeAddress || 'N/A'}</p>
                      <p className="text-emerald-600 font-bold text-base mt-2">{jobForm.salary} <span className="text-xs font-medium uppercase text-emerald-500">/ {jobForm.salaryType}</span></p>
                      <p><span className="font-medium text-slate-900">Openings:</span> {jobForm.numberOfOpenings}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-200 pb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Description</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">{jobForm.roleSummary}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">Responsibilities</p>
                      <ul className="text-sm list-disc list-inside space-y-1 text-slate-600">
                        {jobForm.responsibilities.filter(r => r.trim()).map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {jobForm.requiredSkills.filter(s => s.trim()).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Requirements</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-900">Min Education:</span> {jobForm.minimumEducation}</p>
                    <p><span className="font-medium text-slate-900">Pref Education:</span> {jobForm.preferredEducation || 'N/A'}</p>
                    <p><span className="font-medium text-slate-900">Experience:</span> {jobForm.yearsOfExperience}+ years</p>
                  </div>

                  {jobForm.benefits.filter(b => b.trim()).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                      <h4 className="font-bold text-slate-900 text-sm mb-2">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {jobForm.benefits.filter(b => b.trim()).map((benefit, i) => (
                          <span key={i} className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                            <Check className="h-3 w-3 text-emerald-500" /> {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 mt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? onCancel : prevStep}
              className="px-6 py-2.5 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>

            <div className="flex gap-4">
              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateCurrentStep()}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-[1.02]"
                >
                  Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 mr-2" /> Publish Job
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
