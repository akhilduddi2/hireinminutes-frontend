// Pages barrel export
// Auth pages
export { AuthPage } from './AuthPage';
export { ForgotPasswordPage } from './ForgotPasswordPage';
export { RoleSelectPage } from './RoleSelectPage';
export { AdminLoginPage } from './AdminLoginPage';
export { AdminRegisterPage } from './AdminRegisterPage';
export { default as CollegeLoginPage } from './CollegeLoginPage';
export { default as CollegeRegisterPage } from './CollegeRegisterPage';
export { VerifyTwoFactorPage } from './VerifyTwoFactorPage';

// Public pages
export { LandingPage } from './LandingPage';
export { JobsPage } from './JobsPage';
export { JobDetailsPage } from './JobDetailsPage';
export { ContactPage } from './ContactPage';
export { FaqPage } from './FaqPage';
export { ForCandidatesPage } from './ForCandidatesPage';
export { ForRecruitersPage } from './ForRecruitersPage';
export { TermsPrivacyPage } from './TermsPrivacyPage';
export { CourseDetailsPage } from './CourseDetailsPage';
export { PublicCandidateProfile } from './PublicCandidateProfile';

// Dashboard pages
export { ApplicantsPage } from './ApplicantsPage';
export { NotificationsPage } from './NotificationsPage';
export { PostJobPage } from './PostJobPage';
export { RecruiterOnboardingPage } from './RecruiterOnboardingPage';
export { SavedJobsPage } from './SavedJobsPage';
export { SettingsPage } from './SettingsPage';

// Re-export specific items from subfolders to avoid conflicts
// Admin pages
export { AdminDashboard } from './AdminDashboard';

// College pages
export { CollegeDashboardLayout } from './college';

// Jobseeker pages - re-export layout and components only
export {
  JobSeekerLayout,
  JobSeekerOverview,
  JobSeekerBrowseJobs,
  JobSeekerRecommended,
  JobSeekerApplications,
  JobSeekerSavedJobs,
  JobSeekerCourses,
  JobSeekerNotifications,
  JobSeekerProfile,
  JobSeekerSettings,
} from './jobseeker';

// Recruiter pages - re-export layout and components only
export {
  RecruiterLayout,
  RecruiterOverview,
  RecruiterJobs,
  RecruiterApplicants,
  RecruiterFindCandidates,
  RecruiterCompany,
  RecruiterPostJob,
} from './recruiter';
