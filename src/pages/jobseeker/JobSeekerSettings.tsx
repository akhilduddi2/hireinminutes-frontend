import { useEffect, useState } from 'react';
import {
  Bell, Globe, Lock, LogOut, X, CheckCircle, XCircle, Award,
  Shield, Eye, AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getApiUrl } from '../../config/api';
import { useAuth, getAuthHeaders } from '../../contexts/AuthContext';
import { authApi } from '../../services/api';
import { JobSeekerPageProps } from './types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { Skeleton } from '../../components/ui/Skeleton';

export function JobSeekerSettings({ onNavigate }: JobSeekerPageProps) {
  // Premium upgrade handler
  const { profile, signOut, loading, refreshProfile } = useAuth();

  // Initialize plan from profile
  const [currentPlan, setCurrentPlan] = useState(profile?.plan || 'free');

  useEffect(() => {
    if (profile?.plan) {
      setCurrentPlan(profile.plan);
    }
  }, [profile]);

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Password change state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email notifications confirmation
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false);
  const [pendingEmailEnabled, setPendingEmailEnabled] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  // Premium upgrade state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [collegeDiscount, setCollegeDiscount] = useState(false);

  // Two-Factor Authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState<'setup' | 'verify' | 'disable'>('setup');
  const [twoFactorOTP, setTwoFactorOTP] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Delete Account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'confirm' | 'final'>('confirm');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check for college discount
  useEffect(() => {
    const checkCollegeDiscount = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/payment/create-order`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            amount: 9900,
            currency: 'INR',
            planType: 'premium'
          })
        });

        const orderData = await response.json();
        if (orderData.success && orderData.data.discountApplied) {
          setCollegeDiscount(true);
        }
      } catch (error) {
        console.error('Error checking discount:', error);
      }
    };

    checkCollegeDiscount();
  }, []);

  const handlePremiumUpgrade = async () => {
    setPaymentLoading(true);
    try {
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const response = await fetch(`${getApiUrl()}/api/payment/create-order`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          amount: 9900, // ₹99 in paisa
          currency: 'INR',
          planType: 'premium'
        })
      });

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      const options = {
        key: 'rzp_test_RLpLrHsemzs7ZF',
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Job Board Platform',
        description: 'Premium Plan Subscription',
        order_id: orderData.data.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(`${getApiUrl()}/api/payment/verify`, {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planType: 'premium'
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              await refreshProfile(); // Refresh global auth state
              setCurrentPlan('premium');
              setShowUpgradeModal(false);
              showToast('Successfully upgraded to Premium!', 'success');
            } else {
              showToast('Payment verification failed', 'error');
            }
          } catch (error) {
            showToast('Payment verification failed', 'error');
          }
        },
        prefill: {
          name: profile?.fullName || '',
          email: profile?.email || '',
        },
        theme: {
          color: '#0f172a'
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      showToast(`Payment failed: ${error.message || 'Please try again.'}`, 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Load user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const response = await fetch(getApiUrl('/api/auth/preferences'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          const prefs = data.preferences;
          setEmailNotifications(prefs.emailNotifications || false);
          setProfileVisibility(prefs.profileVisibility ?? true);
          // setSelectedTheme(prefs.theme || 'light');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    const loadUserProfile = async () => {
      try {
        const response = await fetch(getApiUrl('/api/auth/me'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          setTwoFactorEnabled(data.data.twoFactorEnabled || false);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    const fetchUserPlan = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/payment/history`, {
          headers: getAuthHeaders()
        });
        await response.json();
      } catch (error) {
        console.error('Error fetching user plan:', error);
      }
    };

    if (profile) {
      loadUserPreferences();
      loadUserProfile();
      fetchUserPlan();
    }
  }, [profile]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate('landing');
    } catch (error) {
      console.error('Logout error:', error);
      onNavigate('landing');
    }
  };

  // Change password handler
  const handleChangePassword = async () => {
    setPasswordError('');

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/api/auth/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Password changed successfully!', 'success');
        setShowChangePasswordModal(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (deleteStep === 'confirm') {
      if (!deletePassword) {
        showToast('Please enter your password to confirm', 'error');
        return;
      }
      setDeleteStep('final');
      return;
    }

    // Final confirmation step
    setDeleteLoading(true);

    try {
      const response = await authApi.deleteAccount(deletePassword);

      if (response.success) {
        showToast('Account deleted successfully', 'success');
        // Sign out and redirect to landing page
        signOut();
        onNavigate('landing');
      } else {
        showToast(response.error || 'Failed to delete account', 'error');
        setDeleteStep('confirm');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
      setDeleteStep('confirm');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle email notifications toggle
  const handleEmailNotificationsToggle = (enabled: boolean) => {
    setPendingEmailEnabled(enabled);
    setShowEmailConfirmModal(true);
  };

  // Confirm email notifications change
  const confirmEmailNotificationsChange = async () => {
    setPreferencesLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/auth/email-notifications'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ enabled: pendingEmailEnabled }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailNotifications(pendingEmailEnabled);
        showToast(
          pendingEmailEnabled
            ? 'Email notifications enabled!'
            : 'Email notifications disabled.',
          'success'
        );
      } else {
        showToast(data.message || 'Failed to update email notifications', 'error');
      }
    } catch (error) {
      console.error('Error updating email notifications:', error);
      showToast('Failed to update email notifications', 'error');
    } finally {
      setPreferencesLoading(false);
      setShowEmailConfirmModal(false);
    }
  };

  // const updateThemePreference = async (theme: string) => {
  //   // setSelectedTheme(theme);
  //   try {
  //     await fetch(getApiUrl('/api/auth/preferences'), {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...getAuthHeaders(),
  //       },
  //       body: JSON.stringify({ theme }),
  //     });
  //   } catch (error) {
  //     console.error('Error saving theme preference:', error);
  //   }
  // };

  // Two-Factor Authentication functions
  const handleEnableTwoFactor = async () => {
    setTwoFactorLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/auth/enable-2fa'), {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        setTwoFactorStep('verify');
        showToast('2FA setup initiated. Check your email for the verification code.', 'success');
      } else {
        showToast(data.message || 'Failed to initiate 2FA setup', 'error');
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      showToast('Failed to enable 2FA', 'error');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleVerifyTwoFactorSetup = async () => {
    if (!twoFactorOTP.trim()) {
      showToast('Please enter the verification code', 'error');
      return;
    }

    setTwoFactorLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/auth/verify-2fa-setup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ otp: twoFactorOTP }),
      });

      const data = await response.json();

      if (data.success) {
        setTwoFactorEnabled(true);
        setBackupCodes(data.backupCodes || []);
        setTwoFactorStep('setup');
        setShowTwoFactorModal(false);
        setTwoFactorOTP('');
        setShowBackupCodes(true);
        showToast('Two-factor authentication enabled successfully!', 'success');
      } else {
        showToast(data.message || 'Invalid verification code', 'error');
      }
    } catch (error) {
      console.error('Error verifying 2FA setup:', error);
      showToast('Failed to verify 2FA setup', 'error');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setTwoFactorLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/auth/disable-2fa'), {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        setTwoFactorEnabled(false);
        setShowTwoFactorModal(false);
        showToast('Two-factor authentication disabled', 'success');
      } else {
        showToast(data.message || 'Failed to disable 2FA', 'error');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      showToast('Failed to disable 2FA', 'error');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const openTwoFactorModal = (action: 'enable' | 'disable') => {
    if (action === 'enable') {
      setTwoFactorStep('setup');
      handleEnableTwoFactor();
    } else {
      setTwoFactorStep('disable');
    }
    setShowTwoFactorModal(true);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-4 text-blue-200">
            <Shield className="w-3 h-3 fill-current" /> Account Settings
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Settings
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            Manage your preferences and security
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">



        {/* Account Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Security & Access</h3>
          </div>
          <Card className="divide-y divide-slate-100 border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] overflow-hidden bg-white">

            <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 shadow-sm">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Password</h4>
                  <p className="text-sm text-slate-500 mt-1">Last changed 3 months ago</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowChangePasswordModal(true)}
                className="bg-white hover:bg-slate-50 border-slate-200 text-slate-900 font-bold rounded-xl px-5 h-10"
              >
                Change
              </Button>
            </div>

            <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-slate-500 mt-1">Add an extra layer of security</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => openTwoFactorModal(twoFactorEnabled ? 'disable' : 'enable')}
                disabled={twoFactorLoading}
                className={`bg-white hover:bg-slate-50 border-slate-200 text-slate-900 font-bold rounded-xl px-5 h-10 ${twoFactorEnabled ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : ''
                  }`}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>

          </Card>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-slate-900">Preferences</h3>
          </div>
          <Card className="divide-y divide-slate-100 border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] overflow-hidden bg-white">

            <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0 shadow-sm">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Notifications</h4>
                  <p className="text-sm text-slate-500 mt-1">Get updates about new jobs and applications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={emailNotifications} onChange={(e) => handleEmailNotificationsToggle(e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-slate-900 shadow-inner"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 shadow-sm">
                  <Eye className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Profile Visibility</h4>
                  <p className="text-sm text-slate-500 mt-1">Allow recruiters to find your profile</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={profileVisibility} onChange={(e) => setProfileVisibility(e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-slate-900 shadow-inner"></div>
              </label>
            </div>



          </Card>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
          </div>
          <Card className="border border-red-200 shadow-lg shadow-red-200/50 rounded-[24px] overflow-hidden divide-y divide-red-100 bg-white">
            <div className="p-6 flex items-center justify-between hover:bg-red-50/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 shadow-sm">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Logout</h4>
                  <p className="text-sm text-slate-500">Sign out from your account on this device</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-bold rounded-xl px-5 h-10"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
            <div className="p-6 flex items-center justify-between hover:bg-red-50/50 transition-colors bg-red-50/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0 shadow-sm">
                  <X className="w-6 h-6 text-red-700" />
                </div>
                <div>
                  <h4 className="font-bold text-red-700">Delete Account</h4>
                  <p className="text-sm text-red-600/80">Permanently remove your account and data</p>
                </div>
              </div>
              <Button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-5 h-10 shadow-lg shadow-red-600/20"
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>

      </div>

      {/* Modals */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
              <button onClick={() => setShowChangePasswordModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Current Password</label>
                <Input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">New Password</label>
                <Input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">Confirm Password</label>
                <Input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleChangePassword} disabled={passwordLoading} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
                <Button onClick={() => setShowChangePasswordModal(false)} variant="ghost" className="flex-1">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Email Confirm Modal */}
      {showEmailConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Email Notifications</h3>
              <button onClick={() => setShowEmailConfirmModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-slate-600 mb-6">
              {pendingEmailEnabled
                ? "Enable email notifications to receive the latest job updates and alerts?"
                : "Are you sure you want to disable email notifications? You might miss important updates."}
            </p>
            <div className="flex gap-3">
              <Button onClick={confirmEmailNotificationsChange} disabled={preferencesLoading} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                {preferencesLoading ? 'Saving...' : 'Confirm'}
              </Button>
              <Button onClick={() => setShowEmailConfirmModal(false)} variant="ghost" className="flex-1">Cancel</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-0 overflow-hidden animate-fade-in-up">
            <div className="bg-slate-900 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-900/20">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h3>
              <p className="text-slate-300">Unlock premium features for your job search</p>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {[
                  'Unlimited Job Applications',
                  'Priority Application Review',
                  'Direct Messaging with Recruiters',
                  'Profile Performance Analytics',
                  'Ad-free Experience'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  {collegeDiscount ? (
                    <div>
                      <div className="text-lg text-slate-500 line-through">₹99</div>
                      <div className="text-2xl font-bold text-green-600">₹79</div>
                      <div className="text-xs text-green-600">20% college discount!</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold text-slate-900">₹99</div>
                      <div className="text-xs text-slate-500">per month</div>
                    </div>
                  )}
                </div>
                <Button onClick={handlePremiumUpgrade} disabled={paymentLoading} className="flex-1 bg-slate-900 text-white hover:bg-slate-800 h-12 text-lg">
                  {paymentLoading ? 'Processing...' : 'Upgrade Now'}
                </Button>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="w-full text-center text-slate-500 text-sm mt-4 hover:text-slate-700">
                No thanks, stick to Basic
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {twoFactorStep === 'disable' ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
              </h3>
              <button onClick={() => setShowTwoFactorModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {twoFactorStep === 'setup' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-slate-600 mb-6">
                  Setting up two-factor authentication...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            )}

            {twoFactorStep === 'verify' && (
              <div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-slate-600 mb-4">
                  We've sent a verification code to your email. Enter it below to complete the setup.
                </p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={twoFactorOTP}
                  onChange={(e) => setTwoFactorOTP(e.target.value)}
                  className="text-center text-lg tracking-widest mb-4"
                  maxLength={6}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleVerifyTwoFactorSetup}
                    disabled={twoFactorLoading || twoFactorOTP.length !== 6}
                    className="flex-1 bg-slate-900 text-white hover:bg-slate-800"
                  >
                    {twoFactorLoading ? 'Verifying...' : 'Verify & Enable'}
                  </Button>
                  <Button onClick={() => setShowTwoFactorModal(false)} variant="ghost" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {twoFactorStep === 'disable' && (
              <div>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to disable two-factor authentication? This will make your account less secure.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDisableTwoFactor}
                    disabled={twoFactorLoading}
                    className="flex-1 bg-red-600 text-white hover:bg-red-700"
                  >
                    {twoFactorLoading ? 'Disabling...' : 'Disable 2FA'}
                  </Button>
                  <Button onClick={() => setShowTwoFactorModal(false)} variant="ghost" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Backup Codes Modal */}
      {showBackupCodes && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Backup Codes</h3>
              <button onClick={() => setShowBackupCodes(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <p className="text-slate-600 mb-4 text-center">
              Two-factor authentication has been successfully enabled! Save these backup codes in a secure location.
            </p>

            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white p-2 rounded border text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium text-sm">Important Security Notice</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Each backup code can only be used once. Store them securely and don't share them with anyone.
                    If you lose access to your email, these codes are your only way to recover your account.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={() => setShowBackupCodes(false)} className="w-full bg-slate-900 text-white hover:bg-slate-800">
              I have saved these codes
            </Button>
          </Card>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Delete Account</h3>
              <button onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword('');
                setDeleteStep('confirm');
              }} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {deleteStep === 'confirm' ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Are you sure?</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    This action cannot be undone. Your account and all associated data will be permanently deleted.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                    <p className="text-sm text-red-700 font-medium mb-2">This will permanently delete:</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• Your profile and personal information</li>
                      <li>• All job applications</li>
                      <li>• Saved jobs and preferences</li>
                      <li>• Reviews and ratings</li>
                      <li>• Notifications and messages</li>
                      <li>• Verification applications</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Enter your password to confirm</label>
                    <Input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowDeleteModal(false)}
                      variant="ghost"
                      className="flex-1"
                      disabled={deleteLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={!deletePassword || deleteLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {deleteLoading ? 'Confirming...' : 'Continue'}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Final Confirmation</h4>
                  <p className="text-sm text-slate-600">
                    This is your final chance to cancel. Once deleted, your account cannot be recovered.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setDeleteStep('confirm')}
                    variant="ghost"
                    className="flex-1"
                    disabled={deleteLoading}
                  >
                    Go Back
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in-up flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default JobSeekerSettings;
