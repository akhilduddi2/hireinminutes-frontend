import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft, Mail, Lock, Shield, CheckCircle, Zap, Globe, Key, Eye, EyeOff
} from 'lucide-react';


interface AdminLoginPageProps {
  onNavigate?: (page: string, jobId?: string, role?: 'job_seeker' | 'employer' | 'admin', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
}

export function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password, 'admin');
      if (onNavigate) {
        onNavigate('admin', undefined, undefined, undefined, undefined, undefined, 'overview');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      if (errorMessage === 'REQUIRES_2FA') {
        if (onNavigate) {
          onNavigate('verify-2fa', undefined, 'admin');
        } else {
          setError('Two-factor authentication required. Please verify your email.');
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Shield, text: 'Full system administration access' },
    { icon: CheckCircle, text: 'Manage users and job listings' },
    { icon: Zap, text: 'Monitor platform performance' },
    { icon: Globe, text: 'Oversee global operations' },
  ];

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 font-sans overflow-hidden">

      {/* Left Side - Content (Dark Theme, Full Height) */}
      <div className="hidden lg:flex flex-col justify-center bg-slate-950 p-16 xl:p-24 text-white h-full relative">
        <button
          onClick={() => window.history.back()}
          className="absolute top-12 left-12 inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
        >
          <ArrowLeft className="h-3 w-3 mr-2" />
          Return
        </button>

        <div className="max-w-lg">
          <div className="inline-flex items-center px-3 py-1 mb-8 border border-red-900/30 bg-red-900/10 rounded-none">
            <Shield className="h-3 w-3 text-red-500 mr-2" />
            <span className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">Administrator Access</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-light text-white mb-8 leading-tight tracking-tight">
            System Entry.
          </h1>

          <p className="text-xl text-slate-400 font-light leading-relaxed mb-16">
            Authenticate to gain secure access to the platform's administrative control panel.
          </p>

          <div className="space-y-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="mt-1">
                    <Icon className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-slate-300 font-light tracking-wide text-lg group-hover:text-white transition-colors">{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Form (White Theme, Full Height) */}
      <div className="w-full bg-white h-full flex flex-col justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden mb-12">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-8"
            >
              <ArrowLeft className="h-3 w-3 mr-2" /> Back
            </button>
            <h1 className="text-4xl font-light text-slate-900 tracking-tight mb-2">
              Admin Login
            </h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest border-b border-slate-100 pb-4 inline-block">
              System Access
            </p>
          </div>

          <div className="lg:hidden text-center mb-10">
            <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center mx-auto mb-4">
              <Key className="h-5 w-5" />
            </div>
          </div>

          {/* Form Content */}
          <div className="text-center mb-12 hidden lg:block">
            <h2 className="text-2xl font-light text-slate-900 tracking-wide uppercase">Admin Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ADMIN@COMPANY.COM"
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium rounded-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wide"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-10 py-3 bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium rounded-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-shake">
                <div className="flex items-center">
                  <span className="text-red-500 font-bold mr-2">!</span>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="h-14 text-sm font-bold uppercase tracking-[0.15em] bg-slate-900 hover:bg-black text-white shadow-none rounded-none transition-all border border-transparent hover:scale-[1.01]"
            >
              {loading ? 'Authenticating Access...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">New Administrator?</p>
            <a
              href="/admin/register"
              className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-black hover:underline decoration-2 underline-offset-4 group uppercase tracking-wide"
            >
              Create Account
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}