import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface SignInFormProps {
    role: 'job_seeker' | 'employer';
    onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
    onToggleMode: () => void;
}

export function SignInForm({ role, onNavigate, onToggleMode }: SignInFormProps) {
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
            await signIn(email, password, role);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            if (errorMessage === 'REQUIRES_2FA') {
                // Navigate to 2FA verification page
                onNavigate('verify-2fa', undefined, role);
            } else if (errorMessage === 'REQUIRES_ONBOARDING') {
                // Navigate to recruiter onboarding
                onNavigate('recruiter-onboarding');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                            placeholder="NAME@COMPANY.COM"
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
                            onClick={() => onNavigate('forgot-password', undefined, role)}
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
                    {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
            </form>

            <div className="mt-12 text-center">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">New to Platform?</p>
                <button
                    onClick={onToggleMode}
                    className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-black hover:underline decoration-2 underline-offset-4 group uppercase tracking-wide"
                >
                    Create Account
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </>
    );
}
