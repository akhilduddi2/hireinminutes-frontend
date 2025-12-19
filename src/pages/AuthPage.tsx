import { useState, useEffect } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';

interface AuthPageProps {
  role: 'job_seeker' | 'employer';
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
  successMessage?: string;
  initialMode?: 'signin' | 'signup';
}

export function AuthPage({ role, onNavigate, successMessage, initialMode }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Update internal state when props change (e.g., URL change)
  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
  }, [initialMode]);

  const handleToggleMode = () => {
    const newMode = !isSignUp ? 'signup' : 'signin';
    setIsSignUp(!isSignUp);
    // Persist to URL
    onNavigate('auth', undefined, role, undefined, undefined, undefined, undefined, newMode);
  };

  return (
    <AuthLayout role={role} onNavigate={onNavigate} isSignUp={isSignUp}>
      {isSignUp ? (
        <SignUpForm
          role={role}
          onNavigate={onNavigate}
          onToggleMode={handleToggleMode}
          successMessage={successMessage}
        />
      ) : (
        <SignInForm
          role={role}
          onNavigate={onNavigate}
          onToggleMode={handleToggleMode}
        />
      )}
    </AuthLayout>
  );
}
