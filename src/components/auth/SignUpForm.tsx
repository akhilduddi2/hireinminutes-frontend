import { useState, useRef } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { config } from '../../config/api';

interface SignUpFormProps {
    role: 'job_seeker' | 'employer';
    onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
    onToggleMode: () => void;
    successMessage?: string;
}

export function SignUpForm({ role, onNavigate, onToggleMode, successMessage }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const otpInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            otpInputRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs[index - 1].current?.focus();
        }
    };

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${config.endpoints.auth}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: registeredEmail,
                    otp: otpValue,
                    role
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            // Login successful
            login(data.data.user, data.data.token);

            if (role === 'employer') {
                // Check if recruiter needs onboarding
                if (data.data.requiresOnboarding) {
                    onNavigate('recruiter-onboarding');
                } else {
                    onNavigate('recruiter-dashboard');
                }
            } else {
                onNavigate('jobseeker-dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.fullName.trim()) {
            setError('Full name is required');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${config.endpoints.auth}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setRegisteredEmail(formData.email);
            setShowOtpInput(true);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (showOtpInput) {
        return (
            <div className="w-full max-w-md mx-auto p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify Email</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Please enter the 6-digit code sent to <br />
                    <span className="font-semibold text-gray-900">{registeredEmail}</span>
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={verifyOtp} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={otpInputRefs[index]}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify Email'
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setShowOtpInput(false)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Change email address
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Create Account
                    </h2>
                    <p className="text-gray-600 mt-2">Join us as a {role === 'employer' ? 'recruiter' : 'job seeker'}</p>
                </div>

                {successMessage && (
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 animate-fade-in mb-6">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                            <p className="text-green-800 text-sm font-bold tracking-wide">{successMessage}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-shake mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest">
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors">
                                <User className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900" />
                            </div>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="JOHN DOE"
                                className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium rounded-none"
                                required
                            />
                        </div>
                    </div>

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
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="NAME@COMPANY.COM"
                                className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium rounded-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                className="w-full pl-8 pr-10 py-3 bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium rounded-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        className="h-14 text-sm font-bold uppercase tracking-[0.15em] bg-slate-900 hover:bg-black text-white shadow-none rounded-none transition-all border border-transparent hover:scale-[1.01]"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        )}
                    </Button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">Already have an account?</p>
                    <button
                        onClick={onToggleMode}
                        className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-black hover:underline decoration-2 underline-offset-4 group uppercase tracking-wide"
                    >
                        Sign in
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
