// Admin Dashboard API utilities and hooks

export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// API fetch helper with auth
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
};

// Candidates API
export const fetchCandidates = async () => {
  const response = await fetchWithAuth('/api/admin/candidates');
  if (!response.ok) throw new Error('Failed to fetch candidates');
  const data = await response.json();
  return data.data || [];
};

export const verifyCandidateApi = async (candidateId: string) => {
  const response = await fetchWithAuth(`/api/admin/candidates/${candidateId}/verify`, {
    method: 'PUT',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to verify candidate');
  }
  return response.json();
};

export const fetchCandidateProfile = async (candidateId: string) => {
  const response = await fetchWithAuth(`/api/admin/candidates/${candidateId}/profile`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  const data = await response.json();
  return data.data;
};

// Recruiters API
export const fetchRecruiters = async () => {
  const response = await fetchWithAuth('/api/admin/recruiters');
  if (!response.ok) throw new Error('Failed to fetch recruiters');
  const data = await response.json();
  return data.data || [];
};

export const fetchPendingApprovals = async () => {
  const response = await fetchWithAuth('/api/admin/recruiter-approvals');
  if (!response.ok) throw new Error('Failed to fetch pending approvals');
  const data = await response.json();
  return data.data || [];
};

export const approveRecruiter = async (recruiterId: string) => {
  const response = await fetchWithAuth(`/api/admin/recruiters/${recruiterId}/approve`, {
    method: 'PUT',
  });
  if (!response.ok) throw new Error('Failed to approve recruiter');
  return response.json();
};

export const rejectRecruiter = async (recruiterId: string) => {
  const response = await fetchWithAuth(`/api/admin/recruiters/${recruiterId}/reject`, {
    method: 'PUT',
  });
  if (!response.ok) throw new Error('Failed to reject recruiter');
  return response.json();
};

export const fetchRecruiterProfile = async (recruiterId: string) => {
  const response = await fetchWithAuth(`/api/admin/recruiters/${recruiterId}/profile`);
  if (!response.ok) throw new Error('Failed to fetch recruiter profile');
  const data = await response.json();
  return { ...data.data, _isRecruiterProfile: true };
};

// Jobs API
export const fetchJobs = async () => {
  const response = await fetchWithAuth('/api/jobs');
  if (!response.ok) throw new Error('Failed to fetch jobs');
  const data = await response.json();
  return data.data || [];
};

// Verification Applications API
export const fetchVerificationApplications = async () => {
  const response = await fetchWithAuth('/api/admin/verification-applications');
  if (!response.ok) throw new Error('Failed to fetch verification applications');
  const data = await response.json();
  return data.data || [];
};

export const approveVerificationApplication = async (applicationId: string, meetingDetails: unknown) => {
  const response = await fetchWithAuth(`/api/admin/verification-applications/${applicationId}/approve`, {
    method: 'PUT',
    body: JSON.stringify(meetingDetails),
  });
  if (!response.ok) throw new Error('Failed to approve verification application');
  return response.json();
};

export const rejectVerificationApplication = async (applicationId: string, reason: string) => {
  const response = await fetchWithAuth(`/api/admin/verification-applications/${applicationId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ rejectionReason: reason }),
  });
  if (!response.ok) throw new Error('Failed to reject verification application');
  return response.json();
};

// Courses API
export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/courses`);
  if (!response.ok) {
    console.error('Failed to fetch courses:', response.status);
    return [];
  }
  const data = await response.json();
  return Array.isArray(data.data) ? data.data : [];
};

export const createCourse = async (courseData: unknown) => {
  const response = await fetchWithAuth('/api/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
  if (!response.ok) throw new Error('Failed to create course');
  return response.json();
};

export const updateCourse = async (courseId: string, courseData: unknown) => {
  const response = await fetchWithAuth(`/api/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
  if (!response.ok) throw new Error('Failed to update course');
  return response.json();
};

export const deleteCourse = async (courseId: string) => {
  const response = await fetchWithAuth(`/api/courses/${courseId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete course');
  return response.json();
};

// Alerts API
export const fetchAlerts = async () => {
  const response = await fetchWithAuth('/api/admin/alerts');
  if (!response.ok) return [];
  const data = await response.json();
  return data.data || [];
};

export const createAlert = async (alertData: unknown) => {
  const response = await fetchWithAuth('/api/admin/alerts', {
    method: 'POST',
    body: JSON.stringify(alertData),
  });
  if (!response.ok) throw new Error('Failed to create alert');
  return response.json();
};

export const updateAlert = async (alertId: string, alertData: unknown) => {
  const response = await fetchWithAuth(`/api/admin/alerts/${alertId}`, {
    method: 'PUT',
    body: JSON.stringify(alertData),
  });
  if (!response.ok) throw new Error('Failed to update alert');
  return response.json();
};

export const deleteAlert = async (alertId: string) => {
  const response = await fetchWithAuth(`/api/admin/alerts/${alertId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete alert');
  return response.json();
};

// Ads API
export const fetchAds = async () => {
  const response = await fetchWithAuth('/api/admin/ads');
  if (!response.ok) return [];
  const data = await response.json();
  return data.data || [];
};

export const createAd = async (adData: unknown) => {
  const response = await fetchWithAuth('/api/admin/ads', {
    method: 'POST',
    body: JSON.stringify(adData),
  });
  if (!response.ok) throw new Error('Failed to create ad');
  return response.json();
};

export const updateAd = async (adId: string, adData: unknown) => {
  const response = await fetchWithAuth(`/api/admin/ads/${adId}`, {
    method: 'PUT',
    body: JSON.stringify(adData),
  });
  if (!response.ok) throw new Error('Failed to update ad');
  return response.json();
};

export const deleteAd = async (adId: string) => {
  const response = await fetchWithAuth(`/api/admin/ads/${adId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete ad');
  return response.json();
};

// Contact Submissions API
export const fetchContactSubmissions = async () => {
  const response = await fetchWithAuth('/api/contact/all?limit=100');
  if (!response.ok) return [];
  const data = await response.json();
  return data.data || [];
};

export const markContactAsRead = async (contactId: string) => {
  const response = await fetchWithAuth(`/api/contact/${contactId}/read`, {
    method: 'PUT',
  });
  return response.ok;
};

export const updateContactStatus = async (contactId: string, data: { status: string; adminNotes?: string; isRead?: boolean }) => {
  const response = await fetchWithAuth(`/api/contact/${contactId}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update contact submission');
  return response.json();
};

export const deleteContact = async (contactId: string) => {
  const response = await fetchWithAuth(`/api/contact/${contactId}`, {
    method: 'DELETE',
  });
  return response.ok;
};

// Delete User API
export const deleteUser = async (userId: string, userType: string) => {
  const response = await fetchWithAuth(`/api/admin/users/${userId}`, {
    method: 'DELETE',
    body: JSON.stringify({ userType }),
  });
  if (!response.ok) throw new Error('Failed to delete user');
  return response.json();
};

// Stats API
export const fetchStats = async () => {
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  const [candidatesRes, recruitersRes, jobsRes, approvalsRes, coursesRes] = await Promise.all([
    fetch(`${API_BASE_URL}/api/admin/candidates`, { headers }),
    fetch(`${API_BASE_URL}/api/admin/recruiters`, { headers }),
    fetch(`${API_BASE_URL}/api/jobs`, { headers }),
    fetch(`${API_BASE_URL}/api/admin/recruiters/pending`, { headers }),
    fetch(`${API_BASE_URL}/api/courses`, { headers })
  ]);

  const candidatesData = candidatesRes.ok ? await candidatesRes.json() : { data: [] };
  const recruitersData = recruitersRes.ok ? await recruitersRes.json() : { data: [] };
  const jobsData = jobsRes.ok ? await jobsRes.json() : { data: [] };
  const approvalsData = approvalsRes.ok ? await approvalsRes.json() : { data: [] };
  const coursesData = coursesRes.ok ? await coursesRes.json() : { data: [] };

  return {
    totalCandidates: candidatesData.data?.length || 0,
    candidatesGrowth: 0,
    totalRecruiters: recruitersData.data?.length || 0,
    recruitersGrowth: 0,
    totalJobs: jobsData.data?.length || 0,
    jobsGrowth: 0,
    pendingApprovals: approvalsData.data?.length || 0,
    approvalsGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    activeCourses: coursesData.data?.length || 0,
    coursesGrowth: 0
  };
};
