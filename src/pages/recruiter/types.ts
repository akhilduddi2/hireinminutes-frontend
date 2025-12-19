// Shared types for Recruiter Dashboard pages

export interface Job {
  _id?: string;
  id?: string;
  title?: string;
  status: string;
  created_at?: string;
  createdAt?: string;
  location?: string;
  applications_count?: number;
  jobDetails?: {
    basicInfo?: {
      jobTitle: string;
      employmentType?: string;
      department?: string;
      numberOfOpenings?: number;
      workMode?: string;
      jobLevel?: string;
    };
    location?: {
      city?: string;
      state?: string;
      country?: string;
      officeAddress?: string;
    };
    compensation?: {
      salary?: number;
      salaryType?: string;
    };
    description?: {
      roleSummary?: string;
      responsibilities?: string[];
      requiredSkills?: string[];
    };
    qualifications?: {
      minimumEducation?: string;
      preferredEducation?: string;
      yearsOfExperience?: number;
    };
  };
  benefits?: string[];
}

export interface Application {
  _id: string;
  status: string;
  createdAt: string;
  job: {
    _id: string;
    jobDetails: {
      basicInfo?: {
        jobTitle: string;
        employmentType?: string;
        department?: string;
      };
      location?: {
        city?: string;
        state?: string;
      };
    };
    createdAt: string;
  };
  applicant: {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
    isVerified: boolean;
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
      skills?: Array<string | { name: string; isVerified: boolean; _id: string }>;
      experience?: Array<{
        jobTitle: string;
        companyName: string;
        employmentType: string;
        location?: string;
        startDate: string;
        endDate?: string;
        isCurrentlyWorking: boolean;
      }>;
      education?: Array<{
        degreeName: string;
        institution: string;
        specialization?: string;
        startYear: number;
        endYear?: number;
        score?: string;
        grade?: string;
      }>;
      projects?: Array<{
        title: string;
        description: string;
        techStack: string[];
        role?: string;
        duration?: string;
        githubLink?: string;
        demoLink?: string;
        isLive: boolean;
      }>;
      certifications?: Array<{
        certificateName: string;
        issuingOrganization: string;
        issueDate?: string;
        expiryDate?: string;
        credentialId?: string;
        credentialUrl?: string;
        isVerified?: boolean;
      }>;
      socialProfiles?: {
        linkedin?: string;
        github?: string;
        website?: string;
        twitter?: string;
        facebook?: string;
      };
      codingProfiles?: {
        leetcode?: string;
        hackerrank?: string;
        codeforces?: string;
        codechef?: string;
        geeksforgeeks?: string;
      };
      documents?: {
        resume?: string;
        portfolioUrl?: string;
      };
    };
  };
}

export interface Company {
  name: string;
  description: string;
  location: string;
  website: string;
}

export interface Candidate {
  _id: string;
  verifiedAt: string;
  profile: {
    fullName: string;
    skills: string[];
    location: string;
    currentRole: string;
    experience?: string;
    education?: string;
    profilePicture?: string;
  };
}

export interface JobFormData {
  jobTitle: string;
  department: string;
  numberOfOpenings: number;
  employmentType: string;
  workMode: string;
  jobLevel: string;
  city: string;
  state: string;
  country: string;
  officeAddress: string;
  salary: string;
  salaryType: string;
  roleSummary: string;
  responsibilities: string[];
  requiredSkills: string[];
  minimumEducation: string;
  preferredEducation: string;
  yearsOfExperience: number;
  benefits: string[];
}

export interface Alert {
  _id: string;
  name: string;
  message: string;
  showFor: 'candidates' | 'recruiters' | 'both';
  images?: string[];
  video?: string;
  links?: { label: string; url: string }[];
}

export interface RecruiterPageProps {
  onNavigate: (
    page: string,
    jobId?: string,
    role?: 'job_seeker' | 'employer',
    courseId?: string,
    successMessage?: string,
    profileSlug?: string,
    dashboardSection?: string,
    authMode?: 'signin' | 'signup'
  ) => void;
}
