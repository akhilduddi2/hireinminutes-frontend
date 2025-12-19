import { LucideIcon } from 'lucide-react';

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  profile: {
    phone?: string;
    location?: {
      city?: string;
      country?: string;
    };
    skills?: string[];
  };
  isVerified?: boolean;
  createdAt: string;
}

export interface CollegeProfile {
  _id: string;
  name: string;
  email: string;
  contactNumber?: string;
  address?: {
    city?: string;
    country?: string;
  };
  website?: string;
  description?: string;
  logo?: string;
  isVerified: boolean;
  verificationStatus: string;
  students: Student[];
}

export interface NewStudent {
  fullName: string;
  email: string;
  password: string;
}

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  count: number | null;
  path: string;
}
