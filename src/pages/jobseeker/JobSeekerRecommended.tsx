import { useEffect, useState } from 'react';
import {
  Briefcase, BookOpen, MapPin, Clock, DollarSign, ChevronRight, Star,
  ArrowRight, CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders, useAuth } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Job, AvailableCourse } from './types';

export function JobSeekerRecommended({ onNavigate }: JobSeekerPageProps) {
  const { profile } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<AvailableCourse[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Fetch recommended jobs
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        setJobsLoading(true);
        const response = await fetch(getApiUrl('/api/jobs'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          // Filter/recommend based on user skills if available
          let jobs = data.data;
          const skillsList = profile?.profile?.skills || [];
          const userSkills = skillsList.map((skill: string | { name: string }) =>
            typeof skill === 'string' ? skill : skill.name
          );

          if (userSkills.length > 0) {
            jobs = jobs.filter((job: any) => {
              const jobSkills = job.skillsRequired || [];
              return jobSkills.some((skill: string) =>
                userSkills.some((userSkill: string) =>
                  skill.toLowerCase().includes(userSkill.toLowerCase()) ||
                  userSkill.toLowerCase().includes(skill.toLowerCase())
                )
              );
            });
          }

          const transformedJobs = jobs.slice(0, 6).map((job: any) => ({
            id: job._id,
            title: job.title,
            company: {
              name: job.recruiter?.companyName || 'Unknown Company',
              logo: job.recruiter?.companyLogo || job.recruiter?.companyName?.charAt(0).toUpperCase() || '?',
            },
            location: job.location,
            job_type: job.jobType,
            salary_min: job.salaryMin || 0,
            salary_max: job.salaryMax,
            category: job.category,
            description: job.description?.substring(0, 150) + '...' || '',
            posted_date: new Date(job.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            match_score: Math.floor(Math.random() * 20) + 80, // Mock score for now
          }));
          setRecommendedJobs(transformedJobs);
        }
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [profile]);

  // Fetch recommended courses
  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await fetch(getApiUrl('/api/courses'), {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.success) {
          const transformedCourses = data.data.slice(0, 3).map((course: any) => ({
            id: course._id,
            title: course.title,
            provider: course.college?.name || 'Top Provider',
            description: course.description?.substring(0, 150) + '...' || '',
            image: course.image || null,
            duration: course.duration || 'Self-paced',
            level: course.level || 'All Levels',
            price: course.price || 0,
            rating: course.rating || 4.8,
            enrolledCount: course.enrolledCount || 0,
            skills: course.skills || [],
          }));
          setRecommendedCourses(transformedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider mb-4 text-blue-200">
            <Star className="w-3 h-3 fill-current" /> Curated For You
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Recommended Opportunities
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            We've analyzed your profile and found these roles that perfectly match your skills and experience.
          </p>
        </div>
      </div>

      {/* Recommended Jobs Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Top Job Matches</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Based on your skills</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold"
            onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'browse')}
          >
            View All Jobs <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {jobsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col h-full bg-white border border-slate-100 rounded-[24px] overflow-hidden p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2 mt-auto">
                  <Skeleton className="h-7 w-20 rounded-lg" />
                  <Skeleton className="h-7 w-20 rounded-lg" />
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendedJobs.length === 0 ? (
          <Card className="p-16 text-center border border-slate-100 bg-white rounded-[24px] shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No specific matches found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Update your profile skills and preferences to get personalized job recommendations.</p>
            <Button
              onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'profile')}
              className="bg-slate-900 text-white hover:bg-black font-bold px-6 py-2.5 rounded-xl"
            >
              Update Profile
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <Card key={job.id} className="group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full bg-white border border-slate-100 shadow-lg shadow-slate-200/50 rounded-[24px] overflow-hidden">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl font-bold text-slate-700 overflow-hidden relative z-10">
                      {typeof job.company.logo === 'string' && job.company.logo.length > 2
                        ? <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                        : job.company.name.charAt(0)}
                    </div>
                    {job.match_score && (
                      <div className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-black uppercase tracking-wider rounded-lg border border-green-100 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 fill-current/20" />
                        {job.match_score}% Match
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-500">{job.company.name}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {job.job_type}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Salary</p>
                    <p className="text-sm font-black text-slate-900">
                      {job.salary_min > 0
                        ? `₹${(job.salary_min / 100000).toFixed(1)}L - ${(job.salary_max / 100000).toFixed(1)}L`
                        : 'Negotiable'}
                    </p>
                  </div>
                  <Button
                    onClick={() => onNavigate('job-details', job.id)}
                    className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm h-10 px-5 rounded-xl transition-all shadow-sm hover:shadow"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Courses Section */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Skill Up</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Boost your value</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-purple-600 hover:bg-purple-50 font-bold"
            onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'courses')}
          >
            View All Courses <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col bg-white border border-slate-100 rounded-[24px] overflow-hidden h-full shadow-sm">
                <Skeleton className="h-44 w-full" />
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="pt-4 border-t border-slate-100 mt-auto flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendedCourses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[24px] border border-slate-100 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No specific courses recommended at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <Card key={course.id} className="group flex flex-col bg-white border border-slate-100 hover:border-purple-200 shadow-lg shadow-slate-200/50 hover:shadow-purple-500/10 rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {course.image ? (
                    <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-slate-800 shadow-sm border border-slate-100/50">
                    {course.level}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-300 mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {course.rating}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-1">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md">Course</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-purple-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-1">{course.provider}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price</p>
                      <span className="font-black text-slate-900 text-lg">{course.price > 0 ? `₹${course.price}` : 'Free'}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('course-details', course.id)}
                      className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default JobSeekerRecommended;
