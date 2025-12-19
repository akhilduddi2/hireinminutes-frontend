// API Service - Centralized API calls with error handling

import { getApiUrl } from '../config/api';
import type { ApiResponse } from '../types';

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// HTTP methods
export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'DELETE' }),
};

// Auth API
export const authApi = {
  login: (email: string, password: string, role: string) =>
    api.post<{ token: string; user: unknown }>('/api/auth/login', { email, password, role }),

  register: (data: { fullName: string; email: string; password: string; role: string }) =>
    api.post<{ token: string; user: unknown }>('/api/auth/register', data),

  getProfile: () => api.get<unknown>('/api/auth/profile'),

  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/api/auth/reset-password', { token, password }),

  // Two-Factor Authentication
  enableTwoFactor: () => api.post('/api/auth/enable-2fa'),

  verifyTwoFactorSetup: (otp: string) =>
    api.post('/api/auth/verify-2fa-setup', { otp }),

  disableTwoFactor: () => api.post('/api/auth/disable-2fa'),

  sendTwoFactorLoginOTP: (email: string, role: string) =>
    api.post('/api/auth/send-2fa-login-otp', { email, role }),

  verifyTwoFactorLoginOTP: (email: string, otp: string, role: string) =>
    api.post('/api/auth/verify-2fa-login-otp', { email, otp, role }),

  deleteAccount: (password: string) =>
    api.post('/api/auth/delete-account', { password }),

  submitRecruiterApplication: (applicationData: {
    personalInfo?: {
      fullName?: string;
      phone?: string;
      phoneVerified?: boolean;
    };
    companyInfo?: {
      name?: string;
      website?: string;
      logo?: string;
      size?: string;
      address?: string;
      images?: string[];
      socialLinks?: Record<string, string>;
    };
    authorityInfo?: {
      jobTitle?: string;
      employmentProof?: string;
    };
  }) => api.put('/api/auth/profile', { profile: applicationData }),
};

// Jobs API
export const jobsApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return api.get<unknown[]>(`/api/jobs${queryString}`);
  },

  getById: (id: string) => api.get<unknown>(`/api/jobs/${id}`),

  create: (data: unknown) => api.post<unknown>('/api/jobs', data),

  update: (id: string, data: unknown) => api.put<unknown>(`/api/jobs/${id}`, data),

  delete: (id: string) => api.delete<void>(`/api/jobs/${id}`),

  getMyJobs: () => api.get<unknown[]>('/api/jobs/my-jobs'),

  apply: (jobId: string, data?: unknown) =>
    api.post<unknown>(`/api/applications/apply/${jobId}`, data),
};

// Applications API
export const applicationsApi = {
  getMyApplications: () => api.get<unknown[]>('/api/applications/my-applications'),

  getRecruiterApplications: () => api.get<unknown[]>('/api/applications/recruiter/all'),

  updateStatus: (id: string, status: string) =>
    api.put<unknown>(`/api/applications/${id}/status`, { status }),
};

// Courses API
export const coursesApi = {
  getAll: () => api.get<unknown[]>('/api/courses'),

  getById: (id: string) => api.get<unknown>(`/api/courses/${id}`),

  create: (data: unknown) => api.post<unknown>('/api/courses', data),

  update: (id: string, data: unknown) => api.put<unknown>(`/api/courses/${id}`, data),

  delete: (id: string) => api.delete<void>(`/api/courses/${id}`),

  enroll: (courseId: string) => api.post<unknown>(`/api/enrollments/${courseId}`),
};

// Admin API
export const adminApi = {
  getCandidates: () => api.get<unknown[]>('/api/admin/candidates'),

  getRecruiters: () => api.get<unknown[]>('/api/admin/recruiters'),

  getPendingApprovals: () => api.get<unknown[]>('/api/admin/recruiters/pending'),

  approveRecruiter: (id: string) => api.put<unknown>(`/api/admin/recruiters/${id}/approve`),

  rejectRecruiter: (id: string, reason: string) => api.put<unknown>(`/api/admin/recruiters/${id}/reject`, { reason }),

  verifyCandidate: (id: string) => api.put<unknown>(`/api/admin/candidates/${id}/verify`),

  deleteUser: (id: string, _userType: string) =>
    api.delete<void>(`/api/admin/users/${id}`),

  getAlerts: () => api.get<unknown[]>('/api/admin/alerts'),

  createAlert: (data: unknown) => api.post<unknown>('/api/admin/alerts', data),

  updateAlert: (id: string, data: unknown) => api.put<unknown>(`/api/admin/alerts/${id}`, data),

  deleteAlert: (id: string) => api.delete<void>(`/api/admin/alerts/${id}`),

  getAds: () => api.get<unknown[]>('/api/admin/ads'),

  createAd: (data: unknown) => api.post<unknown>('/api/admin/ads', data),

  updateAd: (id: string, data: unknown) => api.put<unknown>(`/api/admin/ads/${id}`, data),

  deleteAd: (id: string) => api.delete<void>(`/api/admin/ads/${id}`),
};

export const adsApi = {
  getActiveAds: (placement?: string) => {
    const query = placement ? `?placement=${placement}` : '';
    return api.get<unknown[]>(`/api/ads/active${query}`);
  },
  trackImpression: (adId: string) => {
    return api.post(`/api/ads/track/impression/${adId}`, {});
  },
  trackClick: (adId: string) => {
    return api.post(`/api/ads/track/click/${adId}`, {});
  },
};

// Contact API
export const contactApi = {
  submit: (data: { name: string; email: string; subject?: string; message: string }) =>
    api.post<unknown>('/api/contact', data),

  getAll: (limit?: number) => api.get<unknown[]>(`/api/contact/all?limit=${limit || 100}`),

  markAsRead: (id: string) => api.put<void>(`/api/contact/${id}/read`),

  delete: (id: string) => api.delete<void>(`/api/contact/${id}`),
};

// College API
export const collegeApi = {
  getProfile: () => api.get<unknown>('/api/college/profile'),

  getStudents: () => api.get<unknown[]>('/api/college/students'),

  createStudent: (data: { fullName: string; email: string; password: string }) =>
    api.post<unknown>('/api/college/students', data),
};

export default api;
