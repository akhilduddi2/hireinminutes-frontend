// Admin Dashboard Type Definitions

export interface FormattedCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: string;
  status: string;
  plan?: 'free' | 'starter' | 'premium' | 'pro';
  interviewCount?: number;
  joinDate: string;
  appliedJobs: number;
  skillPassport?: {
    score: number;
    level: string;
    verifiedSkills: string[];
    badgeId?: string;
  };
}

export interface FormattedRecruiterApproval {
  id: string;
  recruiterId: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  companySize: string;
  website: string;
  companyLogo: string | null;
  companyImages: string[];
  companyAddress: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  employmentProof: string | null;
  applicationDate: string;
  onboardingComplete: boolean;
  status: string;
}

export interface FormattedJob {
  _id: string;
  postedBy: {
    _id: string;
    profile: {
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
      department: string;
      numberOfOpenings: number;
      employmentType: string;
      workMode: string;
      jobLevel: string;
    };
    location: {
      city: string;
      state: string;
      country: string;
      officeAddress?: string;
    };
    compensation: {
      salary: number;
      salaryType: string;
    };
    description: {
      roleSummary: string;
      responsibilities: string[];
      requiredSkills: string[];
    };
    qualifications: {
      minimumEducation: string;
      preferredEducation?: string;
      yearsOfExperience: number;
    };
  };
  status: string;
  applicationCount: number;
  views: number;
  tags: string[];
  benefits: string[];
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  applications?: unknown[];
}

export interface Candidate {
  _id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  profile: {
    profilePhoto?: string;
    phone?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
    dateOfBirth?: Date;
    gender?: string;
    professionalSummary?: string;
    skills: Array<{
      name: string;
      isVerified: boolean;
      verifiedBy?: string;
      verifiedAt?: Date;
    }>;
    experience: Array<{
      jobTitle: string;
      companyName: string;
      employmentType: string;
      location?: string;
      startDate: Date;
      endDate?: Date;
      isCurrentlyWorking: boolean;
    }>;
    education: Array<{
      degreeName: string;
      institution: string;
      specialization?: string;
      startYear: number;
      endYear?: number;
      score?: string;
      grade?: string;
    }>;
    projects: Array<{
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
    }>;
    certifications: Array<{
      certificateName: string;
      issuingOrganization: string;
      issueDate?: Date;
      expiryDate?: Date;
      credentialId?: string;
      credentialUrl?: string;
      isVerified: boolean;
    }>;
    documents: {
      resume?: string;
      coverLetter?: string;
      portfolioUrl?: string;
    };
    socialProfiles: {
      linkedin?: string;
      github?: string;
      facebook?: string;
      instagram?: string;
      twitter?: string;
      website?: string;
    };
    codingProfiles: {
      leetcode?: string;
      geeksforgeeks?: string;
      hackerrank?: string;
      codechef?: string;
      codeforces?: string;
      atcoder?: string;
      spoj?: string;
      hackerearth?: string;
    };
  };
  savedJobs: string[];
  registeredCourses: Array<{
    courseId: string;
    enrolledAt: Date;
    progress: number;
    completedAt?: Date;
    certificateUrl?: string;
  }>;
  appliedJobs: Array<{
    jobId: string;
    appliedAt: Date;
    status: string;
  }>;
  notifications: Array<{
    type: string;
    title: string;
    message: string;
    relatedId?: string;
    isRead: boolean;
    createdAt: Date;
  }>;
  profileCompletion: {
    basicInfo: boolean;
    professionalSummary: boolean;
    skills: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    certifications: boolean;
    documents: boolean;
    socialProfiles: boolean;
    overall: number;
  };
  isVerified: boolean;
  lastLogin?: Date;
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
  _isRecruiterProfile: boolean;
  recruiterOnboardingDetails: {
    phone: string;
    phoneVerified: boolean;
    jobTitle: string;
    employmentProof: string | null;
    company: {
      name: string;
      website: string;
      logo: string | null;
      size: string;
      address: string;
      images: string[];
      socialLinks: {
        facebook: string;
        linkedin: string;
        twitter: string;
        instagram: string;
      };
    };
    isComplete: boolean;
    submittedAt?: string;
  };
}

export interface Recruiter {
  _id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  role: string;
  profile: {
    fullName?: string;
    jobTitle?: string;
    workEmail?: string;
    workPhone?: string;
    profilePhoto?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
    company: {
      name?: string;
      logo?: string;
      description?: string;
      industry?: string;
      size?: string;
      website?: string;
      headOfficeLocation?: {
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
      };
      foundingYear?: number;
      socialLinks: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
      };
      gstNumber?: string;
      companyType?: string;
    };
  };
  permissions: {
    canPostJobs: boolean;
    canViewApplications: boolean;
    canScheduleInterviews: boolean;
    canManageTeam: boolean;
    isAdmin: boolean;
  };
  team: Array<{
    memberId: string;
    role: string;
    joinedAt: Date;
  }>;
  postedJobs: Array<{
    jobId: string;
    postedAt: Date;
    status: string;
  }>;
  applicationsReceived: Array<{
    applicationId: string;
    jobId: string;
    candidateId: string;
    appliedAt: Date;
    status: string;
  }>;
  notifications: Array<{
    type: string;
    title: string;
    message: string;
    relatedId?: string;
    isRead: boolean;
    createdAt: Date;
  }>;
  subscription: {
    plan: string;
    jobsLimit: number;
    applicationsLimit: number;
    features: string[];
    expiresAt?: Date;
    isActive: boolean;
  };
  analytics: {
    totalJobsPosted: number;
    totalApplications: number;
    activeJobs: number;
    profileViews: number;
  };
  isVerified: boolean;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationApplication {
  _id: string;
  candidate: {
    _id: string;
    fullName: string;
    email: string;
    profile?: unknown;
  } | string;
  companyName?: string;
  companyEmail?: string;
  companyWebsite?: string;
  industry?: string;
  documents?: string[];
  status: string;
  applicationDate: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  rejectionReason?: string;
  meetingDetails?: {
    date?: Date;
    time?: string;
    location?: string;
    notes?: string;
  };
  notificationsSent: Array<{
    type: string;
    sentAt: Date;
    message?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subcategory?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail?: string | null;
  promoVideo?: string | null;
  price: number;
  discountPrice?: number | null;
  accessType: 'Lifetime' | 'Subscription' | 'Limited Period';
  estimatedDuration: string;
  duration?: string;
  totalLessons: number;
  language: string;
  tags: string[];
  whatYouWillLearn: string[];
  certificateAvailable: boolean;
  courseContent: {
    moduleTitle: string;
    moduleDuration?: string;
    lessons?: {
      lessonTitle: string;
      lessonDuration?: string;
    }[];
  }[];
  instructorName: string;
  instructor?: string;
  instructorBio?: string;
  averageRating?: number;
  reviewCount?: number;
  enrolledStudents?: number;
  isFeatured?: boolean;
  isFree?: boolean;
  courseUrl?: string;
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  _id: string;
  name: string;
  title?: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  images?: string[];
  video?: string;
  showFor: 'candidates' | 'recruiters' | 'both';
  links?: { title: string; url: string }[];
  isActive: boolean;
  expiresAt?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Ad {
  _id: string;
  title: string;
  description: string;
  image: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl: string;
  linkUrl?: string;
  placement?: string;
  displayDuration: number;
  unskippableDuration?: number;
  frequency?: number;
  targetAudience: 'candidates' | 'recruiters' | 'both';
  adType: 'popup' | 'banner' | 'fullscreen-modal';
  priority: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isPaused?: boolean;
  impressions?: number;
  clicks?: number;
  // Full-screen modal specific fields
  modalDelay?: number;
  modalCloseBehavior?: 'closeable' | 'auto-close' | 'both';
  modalAutoCloseDelay?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  userType: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  isRead: boolean;
  adminNotes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface DashboardStats {
  totalCandidates: number;
  candidatesGrowth: number;
  totalRecruiters: number;
  recruitersGrowth: number;
  totalJobs: number;
  jobsGrowth: number;
  pendingApprovals: number;
  approvalsGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  activeCourses: number;
  coursesGrowth: number;
}

export interface CourseFormData {
  title: string;
  shortDescription?: string;
  description?: string;
  fullDescription?: string;
  category: string;
  subcategory?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string | null;
  thumbnailFile?: File | null;
  promoVideo?: string;
  promoVideoFile?: File | null;
  price: number;
  discountPrice?: number | null;
  accessType?: 'Lifetime' | 'Subscription' | 'Limited Period';
  estimatedDuration?: string;
  duration?: string;
  totalLessons?: number;
  language?: string;
  tags?: string[];
  whatYouWillLearn?: string[];
  certificateAvailable?: boolean;
  courseContent?: {
    moduleTitle: string;
    moduleDuration?: string;
    lessons?: { lessonTitle: string; lessonDuration?: string }[];
  }[];
  instructorName?: string;
  instructor?: string;
  instructorBio?: string;
  isFree?: boolean;
  isFeatured?: boolean;
  courseUrl?: string;
}

export interface AlertFormData {
  name?: string;
  title?: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  images?: string[];
  imageFiles?: File[];
  video?: string;
  videoFile?: File | null;
  showFor?: 'candidates' | 'recruiters' | 'both';
  links?: { title: string; url: string }[];
  isActive: boolean;
  expiresAt?: string;
}

export interface AdFormData {
  title: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  imageFile?: File | null;
  ctaText?: string;
  ctaUrl?: string;
  linkUrl?: string;
  placement?: string;
  displayDuration?: number;
  unskippableDuration?: number;
  frequency?: number;
  targetAudience?: 'candidates' | 'recruiters' | 'both';
  adType?: 'popup' | 'banner' | 'fullscreen-modal';
  priority?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  // Full-screen modal specific fields
  modalDelay?: number;
  modalCloseBehavior?: 'closeable' | 'auto-close' | 'both';
  modalAutoCloseDelay?: number;
}


// Type guard functions
export const isRecruiter = (profile: Candidate | Recruiter | RecruiterProfile): profile is Recruiter | RecruiterProfile => {
  return ('role' in profile && profile.role === 'employer') ||
    ('recruiterOnboardingDetails' in profile && profile.recruiterOnboardingDetails !== null) ||
    ('_isRecruiterProfile' in profile && profile._isRecruiterProfile === true);
};
