import { createContext, useContext, useState, useEffect } from 'react';

interface Experience {
  jobTitle: string;
  companyName: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
}

interface Education {
  degreeName: string;
  institution: string;
  specialization: string;
  startYear: string;
  endYear: string;
  grade: string;
  score: string;
}

interface Project {
  title: string;
  description: string;
  techStack: string[];
  role: string;
  duration: string;
  githubLink: string;
  demoLink: string;
  isLive: boolean;
}

interface Certification {
  certificateName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  isVerified?: boolean;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  plan?: string;
  isVerified?: boolean;
  isApproved?: boolean;
  hasPaidJobAccess?: boolean;
  profilePicture?: string; // base64 encoded image
  slug?: string; // URL-friendly slug for public profile
  profile?: {
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    professionalSummary?: string;
    skills?: (string | { name: string; isVerified?: boolean })[];
    experience?: Experience[];
    education?: Education[];
    projects?: Project[];
    certifications?: Certification[];
    socialProfiles?: {
      linkedin?: string;
      github?: string;
      facebook?: string;
      instagram?: string;
      twitter?: string;
      website?: string;
    };
    codingProfiles?: {
      leetcode?: string;
      geeksforgeeks?: string;
      hackerrank?: string;
      codechef?: string;
      codeforces?: string;
    };
    documents?: {
      resume?: string; // base64 encoded file
      coverLetter?: string; // base64 encoded file
      portfolioUrl?: string;
    };
  };
  recruiterOnboardingDetails?: {
    phone?: string;
    phoneVerified?: boolean;
    company?: {
      name?: string;
      website?: string;
      logo?: string;
      size?: string;
      address?: string;
      images?: string[];
      socialLinks?: {
        facebook?: string;
        linkedin?: string;
        twitter?: string;
        instagram?: string;
      };
    };
    jobTitle?: string;
    employmentProof?: string;
    submittedAt?: string;
    isComplete?: boolean;
  };
  resume_url?: string;
  createdAt?: string;
  updatedAt?: string;
  rejectionReason?: string;
}

type AuthContextType = {
  user: User | null;
  profile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: string, navigate?: (page: string) => void) => Promise<void>;
  signIn: (email: string, password: string, role: string) => Promise<void>;
  collegeSignIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (user: any, token: string) => void;
  updateProfile: (data: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  verifyTwoFactorLoginOTP: (email: string, otp: string, role: string) => Promise<void>;
  sendTwoFactorLoginOTP: (email: string, role: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getAuthHeaders = (includeContentType: boolean = true): Record<string, string> => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') {
    return includeContentType ? { 'Content-Type': 'application/json' } : {};
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`
  };

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      // Validate token and get user data
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshProfile = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user || data.data);
        setProfile(data.data.user || data.data);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      localStorage.removeItem('token');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Refresh profile after update
      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        fullName,
        role
        // Removed additionalData for now - users will add this in profile page later
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // For admin accounts, registration returns token and user directly
    if (role === 'admin') {
      // Store token and user data
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      setProfile(data.data.user);
      return; // Admin is now logged in
    }

    // For other roles, throw success to let components handle OTP flow
    throw new Error('REGISTRATION_SUCCESS');
  };

  const signIn = async (email: string, password: string, role: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        role
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Check if 2FA is required
    if (data.requiresTwoFactor) {
      // Store temporary data for 2FA verification
      sessionStorage.setItem('tempToken', data.tempToken);
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('twoFactorUser', JSON.stringify(data.user));
      // Also store in localStorage to survive page refresh
      localStorage.setItem('tempToken', data.tempToken);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', role);
      localStorage.setItem('twoFactorUser', JSON.stringify(data.user));
      throw new Error('REQUIRES_2FA');
    }

    // Check if onboarding is required (for recruiters)
    if (data.requiresOnboarding) {
      // Store token temporarily for onboarding
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      setProfile(data.data.user);
      throw new Error('REQUIRES_ONBOARDING');
    }

    // Store token and user data
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    setProfile(data.data.user);

    // Mark that user just logged in (for alerts)
    sessionStorage.setItem('alertsShownThisLogin', 'false');

    // Reset ad timer and rotation for fresh start
    localStorage.removeItem('lastAdShownTime');
    localStorage.removeItem('adRotationIndex');
  };

  const collegeSignIn = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        role: 'college'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Check if 2FA is required
    if (data.requiresTwoFactor) {
      // Store temporary data for 2FA verification
      sessionStorage.setItem('tempToken', data.tempToken);
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userRole', 'college');
      sessionStorage.setItem('twoFactorUser', JSON.stringify(data.user));
      // Also store in localStorage to survive page refresh
      localStorage.setItem('tempToken', data.tempToken);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', 'college');
      localStorage.setItem('twoFactorUser', JSON.stringify(data.user));
      throw new Error('REQUIRES_2FA');
    }

    // Store token and user data
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    setProfile(data.data.user);

    // Mark that user just logged in (for alerts)
    sessionStorage.setItem('alertsShownThisLogin', 'false');

    // Reset ad timer and rotation for fresh start
    localStorage.removeItem('lastAdShownTime');
    localStorage.removeItem('adRotationIndex');
  };

  const signOut = async () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Clear user state immediately
    setUser(null);
    setProfile(null);

    // Clear any other auth-related data from localStorage
    localStorage.removeItem('pageState');

    // Clear temporary 2FA session data
    sessionStorage.removeItem('tempToken');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('twoFactorUser');
    localStorage.removeItem('tempToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('twoFactorUser');

    // Clear alerts flag and ad rotation for next login
    sessionStorage.removeItem('alertsShownThisLogin');
    localStorage.removeItem('adRotationIndex');

    console.log('User logged out successfully');
  };

  const login = (user: any, token: string) => {
    localStorage.setItem('token', token);
    setUser(user);
    setProfile(user);

    // Mark that user just logged in (for alerts)
    sessionStorage.setItem('alertsShownThisLogin', 'false');

    // Reset ad timer and rotation for fresh start
    localStorage.removeItem('lastAdShownTime');
    localStorage.removeItem('adRotationIndex');
  };

  const sendTwoFactorLoginOTP = async (email: string, role: string) => {
    const tempToken = sessionStorage.getItem('tempToken') || localStorage.getItem('tempToken');
    if (!tempToken) {
      throw new Error('Session expired. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/send-2fa-login-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        role,
        tempToken
      })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to send OTP');
    }
  };

  const verifyTwoFactorLoginOTP = async (email: string, otp: string, role: string) => {
    const tempToken = sessionStorage.getItem('tempToken') || localStorage.getItem('tempToken');
    if (!tempToken) {
      throw new Error('Session expired. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/verify-2fa-login-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        otp,
        role,
        tempToken
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Verification failed');
    }

    // Store token and user data
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    setProfile(data.data.user);

    // Clear temporary 2FA session data
    sessionStorage.removeItem('tempToken');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('twoFactorUser');
    localStorage.removeItem('tempToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('twoFactorUser');

    // Mark that user just logged in (for alerts)
    sessionStorage.setItem('alertsShownThisLogin', 'false');

    // Reset ad timer and rotation for fresh start
    localStorage.removeItem('lastAdShownTime');
    localStorage.removeItem('adRotationIndex');
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      collegeSignIn,
      signOut,
      login,
      updateProfile,
      refreshProfile,
      verifyTwoFactorLoginOTP,
      sendTwoFactorLoginOTP,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}