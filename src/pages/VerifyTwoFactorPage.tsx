import { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Mail, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

interface VerifyTwoFactorPageProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
  role?: 'job_seeker' | 'employer' | 'admin';
}

export function VerifyTwoFactorPage({ onNavigate, role }: VerifyTwoFactorPageProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const { verifyTwoFactorLoginOTP, sendTwoFactorLoginOTP } = useAuth();
  const [initialOTPSent, setInitialOTPSent] = useState(false);

  // Get stored data from sessionStorage or localStorage
  const tempToken = sessionStorage.getItem('tempToken') || localStorage.getItem('tempToken');
  const userEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
  const userRole = (sessionStorage.getItem('userRole') || localStorage.getItem('userRole')) as 'job_seeker' | 'employer';

  useEffect(() => {
    // Check session data on mount
    const checkSessionData = () => {
      const token = sessionStorage.getItem('tempToken') || localStorage.getItem('tempToken');
      const email = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
      const role = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');

      if (!token || !email || !role) {
        console.warn('Missing 2FA session data, redirecting to login');
        onNavigate('auth', undefined, role as 'job_seeker' | 'employer');
        return false;
      }
      setIsValidSession(true);
      return true;
    };

    // Only redirect if session data is missing
    if (!checkSessionData()) {
      return;
    }
  }, [onNavigate]);

  // Automatically send OTP when session is valid
  useEffect(() => {
    if (isValidSession && userEmail && userRole && !initialOTPSent) {
      handleSendOTP();
      setInitialOTPSent(true);
    }
  }, [isValidSession, userEmail, userRole, initialOTPSent]);

  const handleSendOTP = async () => {
    if (!userEmail || !userRole) return;

    setResendLoading(true);
    setError('');

    try {
      await sendTwoFactorLoginOTP(userEmail, userRole);
      // OTP sent successfully
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // Show loading if session is not valid yet or initial OTP is being sent
  if (!isValidSession || (isValidSession && !initialOTPSent)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <p className="text-slate-600 font-medium">Sending verification code...</p>
          <p className="text-sm text-slate-500 mt-2">Please check your email</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyTwoFactorLoginOTP(userEmail!, otp, userRole!);
      // Clear session storage on success
      sessionStorage.removeItem('tempToken');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('twoFactorUser');
      localStorage.removeItem('tempToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('twoFactorUser');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await sendTwoFactorLoginOTP(userEmail!, userRole!);
      setError('OTP resent to your email');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-slate-50 relative">
      <div className="w-full max-w-md mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Two-Factor Authentication</h1>
          <p className="text-slate-600 text-sm">
            Enter the verification code sent to your email to complete login.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Verification Code
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="pl-10 text-center text-lg font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          {error && (
            <div className={`p-3 rounded-lg text-sm ${error.includes('resent') || error.includes('success')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={loading || otp.length !== 6}
            className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </Button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-3">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm underline disabled:opacity-50"
          >
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              // Clear session storage
              sessionStorage.removeItem('tempToken');
              sessionStorage.removeItem('userEmail');
              sessionStorage.removeItem('userRole');
              sessionStorage.removeItem('twoFactorUser');
              localStorage.removeItem('tempToken');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userRole');
              localStorage.removeItem('twoFactorUser');
              onNavigate('auth', undefined, role);
            }}
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}