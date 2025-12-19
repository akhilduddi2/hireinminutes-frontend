import React, { useState, useEffect } from 'react';
import { GraduationCap, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface CollegeLoginPageProps {
  onNavigate: (page: string) => void;
}

const CollegeLoginPage = ({ onNavigate }: CollegeLoginPageProps) => {
  const { collegeSignIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (loginSuccess && user && user.role === 'college') {
      setLoading(false);
      onNavigate('college');
      setLoginSuccess(false); // Reset the flag
    }
  }, [user, loginSuccess, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await collegeSignIn(formData.email, formData.password);
      setLoginSuccess(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      if (errorMessage === 'REQUIRES_2FA') {
        // For college, we might want to handle 2FA differently or show an error
        // Since college login is usually direct, let's show an error for now
        setError('Two-factor authentication is required. Please contact support.');
      } else {
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const image = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'; // Students group

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-slate-50 relative selection:bg-teal-100">

      {/* Background Ambience (Fixed & Static) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-teal-100 to-green-100 blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 blur-[100px] opacity-60"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4 pt-12 pb-12 md:p-8 md:pt-16">

        {/* Navigation / Return */}
        <div className="w-full max-w-6xl mb-6 flex justify-start">
          <button
            onClick={() => onNavigate('role-select')}
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </button>
        </div>

        {/* Main Split Card */}
        <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row min-h-[600px] max-w-6xl w-full transition-all duration-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

          {/* Left Side: Image Panel */}
          <div className="md:w-5/12 relative overflow-hidden h-64 md:h-auto group bg-slate-900">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
              style={{ backgroundImage: `url(${image})` }}>
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent md:bg-gradient-to-r md:from-slate-900/80 md:to-transparent"></div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center text-white relative z-10">
              <div className="inline-flex items-center px-3 py-1 mb-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-full w-fit">
                <GraduationCap className="h-3 w-3 text-teal-300 mr-2" />
                <span className="text-xs font-bold tracking-widest uppercase text-teal-100">Academic Partner</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Institutional Access.
              </h1>
              <p className="text-slate-300 text-lg mb-8 max-w-sm">
                Manage your institution's profile, students, and placement drives efficiently.
              </p>

              <div className="hidden md:block space-y-4">
                {[
                  'Manage student data & placements',
                  'Track recruitment drives',
                  'Secure institutional communication'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-teal-200" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Form Panel */}
          <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="w-full max-w-md mx-auto">

              {/* Mobile Header */}
              <div className="md:hidden mb-8 text-center">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 rounded-xl shadow-lg shadow-slate-200">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">College Login</h1>
              </div>

              {/* Desktop Header Icon */}
              <div className="hidden md:flex justify-center mb-8">
                <div className="w-14 h-14 bg-teal-50 text-teal-700 flex items-center justify-center rounded-2xl shadow-sm border border-teal-100">
                  <GraduationCap className="h-7 w-7" />
                </div>
              </div>

              <div className="text-center mb-8 hidden md:block">
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Sign in to your college dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="college@example.com"
                      className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium rounded-xl pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
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
                  className="h-12 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-8 text-center pt-6 border-t border-slate-100">
                <p className="text-slate-500 text-sm mb-4">New Institution?</p>
                <button
                  onClick={() => onNavigate('college/register')}
                  className="inline-flex items-center justify-center w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                >
                  Register College
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeLoginPage;