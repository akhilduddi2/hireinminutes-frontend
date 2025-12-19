// Application Constants

// Route Constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  LANDING: 'landing',
  JOBS: 'jobs',
  JOB_DETAILS: 'job-details',
  CONTACT: 'contact',
  FAQ: 'faq',
  TERMS_PRIVACY: 'terms-privacy',
  FOR_CANDIDATES: 'for-candidates',
  FOR_RECRUITERS: 'for-recruiters',
  
  // Auth routes
  AUTH: 'auth',
  LOGIN: 'login',
  REGISTER: 'register',
  ROLE_SELECT: 'role-select',
  FORGOT_PASSWORD: 'forgot-password',
  ADMIN_LOGIN: 'admin-login',
  ADMIN_REGISTER: 'admin-register',
  COLLEGE_LOGIN: 'college-login',
  COLLEGE_REGISTER: 'college-register',
  
  // Candidate routes
  CANDIDATE_DASHBOARD: 'candidate-dashboard',
  PROFILE: 'profile',
  APPLICATIONS: 'applications',
  SAVED_JOBS: 'saved-jobs',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  
  // Recruiter routes
  RECRUITER_DASHBOARD: 'recruiter-dashboard',
  RECRUITER_ONBOARDING: 'recruiter-onboarding',
  POST_JOB: 'post-job',
  APPLICANTS: 'applicants',
  
  // Admin routes
  ADMIN_DASHBOARD: 'admin-dashboard',
  
  // College routes
  COLLEGE_DASHBOARD: 'college',
  COLLEGE_OVERVIEW: 'overview',
  COLLEGE_STUDENTS: 'students',
  COLLEGE_PROFILE: 'profile',
  
  // Course routes
  COURSES: 'courses',
  COURSE_DETAILS: 'course-details',
} as const;

// User Roles
export const USER_ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
  COLLEGE: 'college',
} as const;

// Application Status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  OFFERED: 'offered',
  REJECTED: 'rejected',
  HIRED: 'hired',
  WITHDRAWN: 'withdrawn',
} as const;

// Job Status
export const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  DRAFT: 'draft',
  PAUSED: 'paused',
} as const;

// Job Types
export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  FREELANCE: 'freelance',
  REMOTE: 'remote',
} as const;

// Experience Levels
export const EXPERIENCE_LEVELS = {
  FRESHER: 'fresher',
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  EXECUTIVE: 'executive',
} as const;

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

// Alert Types
export const ALERT_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_PROFILE: '/api/auth/profile',
  AUTH_FORGOT_PASSWORD: '/api/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/api/auth/reset-password',
  
  // Jobs
  JOBS: '/api/jobs',
  JOBS_MY_JOBS: '/api/jobs/my-jobs',
  JOBS_SEARCH: '/api/jobs/search',
  
  // Applications
  APPLICATIONS: '/api/applications',
  APPLICATIONS_MY: '/api/applications/my-applications',
  APPLICATIONS_RECRUITER: '/api/applications/recruiter/all',
  
  // Candidates
  CANDIDATES: '/api/candidates',
  CANDIDATES_PROFILE: '/api/candidates/profile',
  CANDIDATES_SAVED_JOBS: '/api/candidates/saved-jobs',
  
  // Courses
  COURSES: '/api/courses',
  ENROLLMENTS: '/api/enrollments',
  
  // Admin
  ADMIN_CANDIDATES: '/api/admin/candidates',
  ADMIN_RECRUITERS: '/api/admin/recruiters',
  ADMIN_APPROVALS: '/api/admin/recruiter-approvals',
  ADMIN_ALERTS: '/api/admin/alerts',
  ADMIN_ADS: '/api/admin/ads',
  ADMIN_VERIFICATIONS: '/api/admin/verification-applications',
  
  // College
  COLLEGE_PROFILE: '/api/college/profile',
  COLLEGE_STUDENTS: '/api/college/students',
  
  // Contact
  CONTACT: '/api/contact',
  CONTACT_ALL: '/api/contact/all',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  SAVED_JOBS: 'savedJobs',
  RECENT_SEARCHES: 'recentSearches',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[\d\s-()]{10,}$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_REQUIREMENTS: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  JOB_POSTED: 'Job posted successfully!',
  JOB_APPLIED: 'Application submitted successfully!',
  SAVED: 'Saved successfully!',
  DELETED: 'Deleted successfully!',
} as const;

// Export types for constants
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];
export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];
export type JobType = typeof JOB_TYPES[keyof typeof JOB_TYPES];
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[keyof typeof EXPERIENCE_LEVELS];
export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
export type AlertType = typeof ALERT_TYPES[keyof typeof ALERT_TYPES];
