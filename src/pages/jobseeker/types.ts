// Shared types for Job Seeker Dashboard pages

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  category: string;
  salary_min: number;
  salary_max: number;
  company: { name: string; logo: string };
  match_score: number;
  skills_required: string[];
  posted_date: string;
}

export interface Application {
  id: string;
  job: Job;
  status: string;
  created_at: string;
  last_updated: string;
}

export interface EnrolledCourse {
  id: string;
  course: {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    provider: string;
    image?: string | null;
  };
  progress: number;
  status: string;
  enrolledAt: string;
  completedAt?: string;
}

export interface AvailableCourse {
  _id: string;
  id?: string; // Alias for _id
  title: string;
  description?: string;
  shortDescription?: string;
  fullDescription?: string;
  category: string;
  subcategory?: string;
  level: string;
  thumbnail?: string | null;
  image?: string | null; // Alias for thumbnail
  promoVideo?: string;
  price: number;
  discountPrice?: number;
  accessType?: string;
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
    lessons?: {
      lessonTitle: string;
      lessonDuration?: string;
    }[];
  }[];
  instructorName?: string;
  instructorBio?: string;
  averageRating?: number;
  reviewCount?: number;
  rating?: number;
  enrolledCount?: number;
  provider?: string; // College name or provider
  college?: { name: string; _id?: string };
  createdBy?: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt?: string;
}

export interface Experience {
  id?: string;
  _id?: string;
  jobTitle: string;
  companyName: string;
  employmentType: string; // 'full-time' | 'part-time' | 'internship' | 'freelance' | 'contract'
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  description?: string;
}

export interface Education {
  id?: string;
  _id?: string;
  degreeName: string;
  institution: string;
  specialization?: string;
  startYear: string | number;
  endYear?: string | number;
  grade?: string;
  score?: string;
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  role: string;
  duration: string;
  githubLink: string;
  demoLink: string;
  isLive: boolean;
}

export interface Certification {
  certificateName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  isVerified?: boolean;
}

export interface NotificationItem {
  id: string;
  type?: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  readAt?: string;
  data?: {
    applicationId?: string;
    jobId?: string;
    status?: string;
    customMessage?: string;
    jobTitle?: string;
    companyName?: string;
    location?: string;
    meetingLink?: string;
    meetingDetails?: {
      date: string;
      time: string;
      location: string;
      notes?: string;
    };
  };
}

export interface JobSeekerPageProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
}
