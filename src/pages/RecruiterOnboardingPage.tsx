import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2, Briefcase, Globe,
  CheckCircle, ArrowRight, Phone, Linkedin, Twitter,
  Instagram, Facebook, FileText, Shield, Clock, Sparkles,
  Award, Target, X, Camera, ImageIcon
} from 'lucide-react';

interface RecruiterOnboardingPageProps {
  onComplete: () => void;
}

export function RecruiterOnboardingPage({ onComplete }: RecruiterOnboardingPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Personal legitimacy
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Company authenticity
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [companyImages, setCompanyImages] = useState<File[]>([]);
  const [companyImagePreviews, setCompanyImagePreviews] = useState<string[]>([]);
  const [companySize, setCompanySize] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');

  // Recruiter's authority
  const [jobTitle, setJobTitle] = useState('');
  const [employmentProof, setEmploymentProof] = useState<File | null>(null);
  const [employmentProofPreview, setEmploymentProofPreview] = useState<string>('');

  const companyLogoRef = useRef<HTMLInputElement>(null);
  const companyImagesRef = useRef<HTMLInputElement>(null);
  const employmentProofRef = useRef<HTMLInputElement>(null);

  // Check authentication and onboarding requirements
  useEffect(() => {
    // Wait for authentication to be determined
    if (authLoading) {
      return; // Still loading
    }

    setAuthChecked(true);

    if (!user) {
      // Redirect to auth page if not authenticated
      window.location.href = '/';
      return;
    }

    if (user?.role !== 'employer') {
      // Only recruiters should access this page
      onComplete();
      return;
    }

    // Check if user is approved and doesn't need onboarding
    if (user?.isApproved && user?.recruiterOnboardingDetails?.isComplete) {
      // User is already approved and has completed onboarding, redirect to dashboard
      onComplete();
      return;
    }

    // Check if user has completed onboarding but is NOT approved
    if (!user?.isApproved && user?.recruiterOnboardingDetails?.isComplete) {
      // Show success/pending screen immediately
      setShowSuccess(true);
      setLoading(false);
      return;
    }
  }, [authLoading, user, onComplete]);

  // Show loading while authentication is being checked
  if (!authChecked || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const jobTitles = [
    'HR', 'Talent Acquisition', 'Hiring Manager', 'Recruitment Manager',
    'HR Manager', 'CEO', 'CTO', 'COO', 'Founder', 'Other'
  ];

  const companySizes = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ];

  const handleSendOtp = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number first');
      return;
    }
    // For testing purposes, just show OTP input
    setShowOtpInput(true);
    setOtpSent(true);
    alert('OTP sent to your phone (Testing: use 123456)');
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      setPhoneVerified(true);
      setShowOtpInput(false);
      alert('Phone number verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
      setOtp('');
    }
  };

  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + companyImages.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const newImages = [...companyImages, ...files];
    setCompanyImages(newImages);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCompanyImage = (index: number) => {
    setCompanyImages(prev => prev.filter((_, i) => i !== index));
    setCompanyImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmploymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEmploymentProof(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setEmploymentProofPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    // Validate required fields based on current step
    if (step === 1) {
      if (!phoneNumber.trim()) {
        alert('Please enter your phone number');
        return;
      }
      if (!phoneVerified) {
        alert('Please verify your phone number first');
        return;
      }
      nextStep();
      return;
    }

    if (step === 2) {
      if (!companyName.trim() || !companyWebsite.trim() || !companyAddress.trim() || !companySize) {
        alert('Please fill in all required company fields');
        return;
      }
      nextStep();
      return;
    }

    if (step === 3) {
      if (!jobTitle || !employmentProof) {
        alert('Please fill in all required fields');
        return;
      }
    }

    // Final submission - Submit application for admin review
    setLoading(true);

    try {
      // Convert files to base64
      const employmentProofBase64 = employmentProof ? await convertFileToBase64(employmentProof) : '';
      const companyLogoBase64 = companyLogo ? await convertFileToBase64(companyLogo) : '';
      const companyImagesBase64 = await Promise.all(
        companyImages.map(file => convertFileToBase64(file))
      );

      const applicationData = {
        personalInfo: {
          fullName: '', // Will be populated from user profile
          phone: phoneNumber.trim(),
          phoneVerified: phoneVerified
        },
        companyInfo: {
          name: companyName.trim(),
          website: companyWebsite.trim(),
          logo: companyLogoBase64 || undefined,
          size: companySize,
          address: companyAddress.trim(),
          images: companyImagesBase64,
          socialLinks: Object.fromEntries(
            Object.entries({
              facebook: facebook.trim() || undefined,
              linkedin: linkedin.trim() || undefined,
              twitter: twitter.trim() || undefined,
              instagram: instagram.trim() || undefined
            }).filter(([_, v]) => v !== undefined)
          ) as Record<string, string>
        },
        authorityInfo: {
          jobTitle: jobTitle,
          employmentProof: employmentProofBase64
        }
      };

      console.log('Submitting recruiter application:', applicationData);

      const result = await authApi.submitRecruiterApplication(applicationData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit application');
      }

      console.log('Application submitted successfully:', result.data);

      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            {/* Success Animation */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center animate-bounce shadow-xl">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
              <div className="absolute inset-0 w-32 h-32 bg-green-400/20 rounded-full mx-auto animate-ping"></div>
            </div>

            {/* Success Message */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-amber-500" />
                <h1 className="text-4xl font-bold text-slate-900">Application Submitted!</h1>
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-xl text-slate-600 mb-6">
                Your recruiter verification application has been submitted for review
              </p>
            </div>

            {/* Verification Info */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-900">Verification in Progress</h2>
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Your account is currently under review by our admin team. This process typically takes 24-48 hours.
                You'll receive an email notification once your account is verified and activated.
              </p>

              {/* Status Steps */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Application Submitted</p>
                  <p className="text-xs text-slate-500">Completed</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-amber-500 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Admin Review</p>
                  <p className="text-xs text-slate-500">In Progress</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Award className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Verification</p>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                What happens next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Admin Review</p>
                    <p className="text-sm text-slate-600">Our team will review your application and company credentials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Email Notification</p>
                    <p className="text-sm text-slate-600">You'll receive an email when your account is approved</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Start Hiring</p>
                    <p className="text-sm text-slate-600">Access your dashboard and begin posting jobs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg font-semibold shadow-lg"
            >
              Return to Homepage
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Support Info */}
            <p className="text-sm text-slate-500 mt-6">
              Questions? Contact us at <span className="font-medium text-slate-700">support@jobboard.com</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <Building2 className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Recruiter Onboarding</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Complete Your Profile
          </h1>
          <p className="text-lg text-slate-600">
            Help us know you better to provide the best hiring experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step >= s
                  ? 'bg-purple-600 text-white shadow-lg scale-110'
                  : 'bg-slate-200 text-slate-400'
                  }`}>
                  {step > s ? <CheckCircle className="h-6 w-6" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 mx-3 rounded transition-all ${step > s ? 'bg-purple-600' : 'bg-slate-200'
                    }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-around text-sm px-4">
            <span className={`text-center ${step >= 1 ? 'text-purple-600 font-medium' : 'text-slate-400'}`}>Personal Legitimacy</span>
            <span className={`text-center ${step >= 2 ? 'text-purple-600 font-medium' : 'text-slate-400'}`}>Company Authenticity</span>
            <span className={`text-center ${step >= 3 ? 'text-purple-600 font-medium' : 'text-slate-400'}`}>Authority Verification</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-100">
          {/* Step 1: Personal Legitimacy */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Personal Legitimacy</h2>
                  <p className="text-slate-600">Verify your identity for account security</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        disabled={phoneVerified}
                      />
                    </div>
                    {!phoneVerified ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendOtp}
                        disabled={!phoneNumber.trim() || otpSent}
                        className="px-6"
                      >
                        {otpSent ? 'OTP Sent' : 'Send OTP'}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Required for OTP verification</p>
                </div>

                {showOtpInput && !phoneVerified && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6}
                        className="px-6 bg-green-600 hover:bg-green-700"
                      >
                        Verify
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Testing OTP: 123456</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Company Authenticity */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Company Authenticity</h2>
                  <p className="text-slate-600">Verify your company's legitimacy</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Website <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://yourcompany.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Size <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select size</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Official Company Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="123 Business Street, City, State, PIN Code"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Images <span className="text-slate-500">(Optional - Max 10)</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    {companyImagePreviews.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {companyImagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Company ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeCompanyImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {companyImages.length < 10 && (
                          <div>
                            <input
                              ref={companyImagesRef}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleCompanyImageUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => companyImagesRef.current?.click()}
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Add More Images
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="h-12 w-12 text-slate-400 mx-auto" />
                        <div>
                          <p className="text-sm text-slate-600 mb-2">
                            Upload company photos (office, team, products)
                          </p>
                          <p className="text-xs text-slate-500 mb-4">
                            PNG, JPG up to 5MB each • Max 10 images
                          </p>
                          <input
                            ref={companyImagesRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleCompanyImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => companyImagesRef.current?.click()}
                          >
                            Choose Images
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Social Media Handles <span className="text-slate-500">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="facebook.com/yourcompany"
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="linkedin.com/company/yourcompany"
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="twitter.com/yourcompany"
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="instagram.com/yourcompany"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Logo <span className="text-slate-500">(Optional - Will be displayed in job listings)</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    {companyLogoPreview ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <img
                              src={companyLogoPreview}
                              alt="Company Logo"
                              className="w-32 h-32 object-contain rounded-lg shadow-md bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setCompanyLogo(null);
                                setCompanyLogoPreview(null);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <input
                            ref={companyLogoRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCompanyLogoUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => companyLogoRef.current?.click()}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Change Logo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="h-12 w-12 text-slate-400 mx-auto" />
                        <div>
                          <p className="text-sm text-slate-600 mb-2">
                            Upload your company logo
                          </p>
                          <p className="text-xs text-slate-500 mb-4">
                            PNG, JPG, SVG up to 2MB • Square images work best
                          </p>
                          <input
                            ref={companyLogoRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCompanyLogoUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => companyLogoRef.current?.click()}
                          >
                            Choose Logo
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Recruiter's Authority */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Authority Verification</h2>
                  <p className="text-slate-600">Confirm your position within the company</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select your role</option>
                    {jobTitles.map((title) => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Employment Proof Upload <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    {employmentProofPreview ? (
                      <div className="space-y-4">
                        <img
                          src={employmentProofPreview}
                          alt="Employment Proof"
                          className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-slate-600">{employmentProof?.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEmploymentProof(null);
                            setEmploymentProofPreview('');
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto" />
                        <div>
                          <p className="text-sm text-slate-600 mb-2">
                            Upload ID Card or Appointment Letter
                          </p>
                          <p className="text-xs text-slate-500 mb-4">
                            PNG, JPG, PDF up to 5MB • For verification only
                          </p>
                          <input
                            ref={employmentProofRef}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleEmploymentProofUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => employmentProofRef.current?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className={step === 1 ? 'invisible' : ''}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full transition-all ${step === s ? 'bg-purple-600 w-8' : 'bg-slate-300'
                      }`}
                  ></div>
                ))}
              </div>
            </div>

            {step < 3 ? (
              <Button
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Why do we need this information?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This information helps our admin team verify your identity and company legitimacy.
                Once verified, you'll gain full access to post jobs, review applications, and connect with top talent.
                All data is securely stored and used only for verification purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
