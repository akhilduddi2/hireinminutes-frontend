// Shared TypeScript types for the application

// User types
export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'job_seeker' | 'employer' | 'admin' | 'college';
  profilePicture?: string;
  isVerified?: boolean;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token?: string;
}

// Location type
export interface Location {
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  zipCode?: string;
}

// Profile types
export interface CandidateProfile {
  _id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  profile: {
    profilePhoto?: string;
    phone?: string;
    location?: Location;
    dateOfBirth?: Date;
    gender?: string;
    professionalSummary?: string;
    skills: Skill[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    documents: Documents;
    socialProfiles: SocialProfiles;
    codingProfiles: CodingProfiles;
  };
  savedJobs: string[];
  appliedJobs: AppliedJob[];
  isVerified: boolean;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecruiterProfile {
  _id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  _isRecruiterProfile?: boolean;
  recruiterOnboardingDetails?: {
    phone?: string;
    phoneVerified?: boolean;
    jobTitle?: string;
    employmentProof?: string | null;
    company?: {
      name?: string;
      website?: string;
      logo?: string | null;
      size?: string;
      address?: string;
      images?: string[];
      socialLinks?: SocialLinks;
    };
    isComplete?: boolean;
    submittedAt?: string;
  };
}

// Skill type
export interface Skill {
  name: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

// Experience type
export interface Experience {
  jobTitle: string;
  companyName: string;
  employmentType: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyWorking: boolean;
  description?: string;
}

// Education type
export interface Education {
  degreeName: string;
  institution: string;
  specialization?: string;
  startYear: number;
  endYear?: number;
  score?: string;
  grade?: string;
}

// Project type
export interface Project {
  title: string;
  description: string;
  techStack: string[];
  role?: string;
  startDate?: Date;
  endDate?: Date;
  duration?: string;
  githubLink?: string;
  demoLink?: string;
  isLive: boolean;
}

// Certification type
export interface Certification {
  certificateName: string;
  issuingOrganization: string;
  issueDate?: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  isVerified: boolean;
}

// Documents type
export interface Documents {
  resume?: string;
  coverLetter?: string;
  portfolioUrl?: string;
}

// Social profiles
export interface SocialProfiles {
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

export interface SocialLinks {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

// Coding profiles
export interface CodingProfiles {
  leetcode?: string;
  geeksforgeeks?: string;
  hackerrank?: string;
  codechef?: string;
  codeforces?: string;
  atcoder?: string;
  spoj?: string;
  hackerearth?: string;
}

// Applied job type
export interface AppliedJob {
  jobId: string;
  appliedAt: Date;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}

// Job types
export interface Job {
  _id: string;
  postedBy: {
    _id: string;
    profile?: {
      fullName?: string;
      company?: {
        name?: string;
        logo?: string;
      };
    };
  };
  jobDetails: {
    basicInfo: {
      jobTitle: string;
      department?: string;
      numberOfOpenings?: number;
      employmentType: string;
      workMode: string;
      jobLevel?: string;
    };
    location: Location;
    compensation: {
      salary?: number;
      salaryType?: string;
      minSalary?: number;
      maxSalary?: number;
    };
    description: {
      roleSummary: string;
      responsibilities?: string[];
      requiredSkills?: string[];
    };
    qualifications?: {
      minimumEducation?: string;
      preferredEducation?: string;
      yearsOfExperience?: number;
    };
  };
  status: 'active' | 'closed' | 'draft' | 'paused';
  applicationCount?: number;
  views?: number;
  tags?: string[];
  benefits?: string[];
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Application type
export interface Application {
  _id: string;
  job: Job | string;
  candidate: CandidateProfile | string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: Date;
  coverLetter?: string;
  resume?: string;
  notes?: string;
}

// Course type
export interface Course {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category: string;
  subcategory?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail?: string | null;
  promoVideo?: string | null;
  price: number;
  discountPrice?: number | null;
  accessType: 'Lifetime' | 'Subscription' | 'Limited Period';
  estimatedDuration: string;
  totalLessons: number;
  language: string;
  tags?: string[];
  whatYouWillLearn?: string[];
  certificateAvailable: boolean;
  courseContent?: CourseModule[];
  instructorName: string;
  instructorBio?: string;
  averageRating?: number;
  reviewCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  moduleTitle: string;
  moduleDuration?: string;
  lessons?: {
    lessonTitle: string;
    lessonDuration?: string;
  }[];
}

// Contact submission type
export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// Navigation types
export type NavigateFunction = (
  page: string,
  jobId?: string,
  role?: 'job_seeker' | 'employer',
  courseId?: string,
  successMessage?: string,
  profileSlug?: string,
  dashboardSection?: string
) => void;

// Tab/Menu item type
export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number | null;
  path?: string;
}
