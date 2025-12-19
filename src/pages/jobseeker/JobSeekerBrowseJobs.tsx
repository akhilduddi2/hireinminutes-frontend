import { useEffect, useState } from 'react';
import {
  Briefcase, Search, MapPin, Clock, X, DollarSign, Filter, ChevronDown, LayoutGrid, List
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders, useAuth } from '../../contexts/AuthContext';
import { JobSeekerPageProps, Job } from './types';
import { AdBanner } from '../../components/ads/AdBanner';

import { PlanCard } from '../../components/subscription/PlanCard';

export function JobSeekerBrowseJobs({ onNavigate }: JobSeekerPageProps) {
  const { user } = useAuth();
  const [browseJobs, setBrowseJobs] = useState<Job[]>([]);
  const [browseJobsLoading, setBrowseJobsLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isTogglingSave, setIsTogglingSave] = useState<string | null>(null);

  // Subscription state
  const [subscribingTo, setSubscribingTo] = useState<string | null>(null);

  // Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan: string) => {
    try {
      setSubscribingTo(plan);

      // 1. Load Razorpay SDK
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const token = localStorage.getItem('token');

      // 2. Determine Amount
      let amount = 9900; // default starter
      if (plan === 'premium') amount = 49900;
      if (plan === 'pro') amount = 99900;

      // 3. Create Order
      const orderResponse = await fetch(getApiUrl('/api/payment/create-order'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          planType: plan
        })
      });

      if (!orderResponse.ok) {
        const errData = await orderResponse.json();
        throw new Error(errData.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();
      const { id: order_id, currency, amount: finalAmount } = orderData.data;

      // 4. Initialize Razorpay
      const options = {
        key: "rzp_test_RLpLrHsemzs7ZF", // Test Key
        amount: finalAmount.toString(),
        currency: currency,
        name: "HireMe Subscription",
        description: `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        order_id: order_id,
        handler: async function (response: any) {
          try {
            // 5. Verify Payment
            const verifyResponse = await fetch(getApiUrl('/api/payment/verify'), {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planType: plan
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              alert(verifyData.message || 'Subscription successful!');
              window.location.reload();
            } else {
              alert(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Verification Error:', error);
            alert('Payment verified failed internally.');
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: {
          color: "#0f172a"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error('Subscription error:', error);
      alert(error.message || 'Failed to process subscription');
    } finally {
      setSubscribingTo(null);
    }
  };

  // Filter states
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobCategory, setJobCategory] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch jobs and saved jobs
  // Fetch jobs and saved jobs
  // Debounce search query
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  // Debounce search query - Reset page to 1 when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset page
      fetchJobs(1, true); // Fetch first page, reset list
    }, 500);
    return () => clearTimeout(timer);
  }, [jobSearchQuery, jobLocation, jobCategory, jobType]);

  const fetchJobs = async (pageNum = 1, reset = false) => {
    try {
      setBrowseJobsLoading(true);

      // Build query string
      const params = new URLSearchParams();
      if (jobSearchQuery) params.append('search', jobSearchQuery);
      if (jobLocation) params.append('location', jobLocation);
      if (jobCategory !== 'all') params.append('department', jobCategory);
      if (jobType !== 'all') params.append('employmentType', jobType);
      params.append('limit', '20'); // Reduced from 50
      params.append('page', pageNum.toString());

      const response = await fetch(getApiUrl(`/api/jobs?${params.toString()}`), {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        const transformedJobs = data.data.map((job: any) => ({
          id: job._id,
          title: job.jobDetails?.basicInfo?.jobTitle || 'Untitled Position',
          company: {
            name: (() => {
              const postedBy = job.postedBy || {};
              const profileCompany = postedBy.profile?.company?.name;
              const onboardingCompany = postedBy.recruiterOnboardingDetails?.company?.name;

              return profileCompany ||
                onboardingCompany ||
                (postedBy.profile?.fullName ? `${postedBy.profile.fullName}'s Company` : '') ||
                (postedBy.fullName ? `${postedBy.fullName}'s Company` : '') ||
                'Confidential Company';
            })(),
            logo: job.postedBy?.profile?.company?.logo || job.postedBy?.recruiterOnboardingDetails?.company?.logo || job.postedBy?.profile?.company?.name?.charAt(0).toUpperCase() || job.postedBy?.recruiterOnboardingDetails?.company?.name?.charAt(0).toUpperCase() || '?',
          },
          location: job.jobDetails?.location ?
            `${job.jobDetails.location.city || ''}${job.jobDetails.location.city && job.jobDetails.location.country ? ', ' : ''}${job.jobDetails.location.country || ''}` || 'Remote'
            : 'Remote',
          job_type: job.jobDetails?.basicInfo?.employmentType || 'Full-time',
          salary_min: job.jobDetails?.compensation?.salary || 0,
          salary_max: job.jobDetails?.compensation?.salary,
          category: job.jobDetails?.basicInfo?.department || 'General',
          description: job.jobDetails?.description?.roleSummary ?
            (job.jobDetails.description.roleSummary.length > 150 ? job.jobDetails.description.roleSummary.substring(0, 150) + '...' : job.jobDetails.description.roleSummary)
            : 'No description available for this position.',
          posted_date: new Date(job.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        }));

        if (reset) {
          setBrowseJobs(transformedJobs);
        } else {
          setBrowseJobs(prev => [...prev, ...transformedJobs]);
        }


        setHasMore(data.pagination?.page < data.pagination?.pages);
      }

      // Optimally fetch ONLY saved job IDs (only on first load or refresh to keep sync)
      if (reset) {
        const savedResponse = await fetch(getApiUrl('/api/jobs/saved/my-saved-jobs?idsOnly=true'), {
          headers: getAuthHeaders(),
        });
        const savedData = await savedResponse.json();
        if (savedData.success) {
          setSavedJobIds(savedData.data || []);
        }
      }

    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setBrowseJobsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage, false);
  };

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (isTogglingSave) return;

    setIsTogglingSave(jobId);
    const isSaved = savedJobIds.includes(jobId);
    const endpoint = isSaved ? `/api/jobs/${jobId}/unsave` : `/api/jobs/${jobId}/save`;
    const method = isSaved ? 'DELETE' : 'POST';

    try {
      const response = await fetch(getApiUrl(endpoint), {
        method,
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setSavedJobIds(prev =>
          isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsTogglingSave(null);
    }
  };

  // No client-side filtering needed anymore
  const filteredJobs = browseJobs;

  const clearAllFilters = () => {
    setJobSearchQuery('');
    setJobLocation('');
    setJobCategory('all');
    setJobType('all');
  };

  // Render Plans Section
  const renderPlans = () => {
    if (user?.plan && user.plan !== 'free') {
      return (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              You are on the {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
            </h2>
            <p className="text-blue-100 opacity-90">
              {user.plan === 'starter' ? 'You can apply for unlimited jobs.' :
                user.plan === 'premium' ? 'You have 1 interview opportunity remaining.' :
                  'You have 3 interview opportunities remaining.'}
            </p>
          </div>
          <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold border border-white/20">
            Active
          </div>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upgrade to unlock job applications and interview opportunities. Select the plan that fits your career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <PlanCard
            name="Starter"
            price={99}
            features={[
              "Apply for unlimited jobs",
              "Profile visibility to recruiters",
              "No interview support included"
            ]}
            onSubscribe={() => handleSubscribe('starter')}
            isLoading={subscribingTo === 'starter'}
          />
          <PlanCard
            name="Premium"
            price={499}
            features={[
              "Everything in Starter",
              "1 Guaranteed Interview Opportunity",
              "Priority application status"
            ]}
            recommended={true}
            onSubscribe={() => handleSubscribe('premium')}
            isLoading={subscribingTo === 'premium'}
          />
          <PlanCard
            name="Pro"
            price={999}
            features={[
              "Everything in Premium",
              "3 Guaranteed Interview Opportunities",
              "Direct Admin Support",
              "Resume Review"
            ]}
            onSubscribe={() => handleSubscribe('pro')}
            isLoading={subscribingTo === 'pro'}
          />
        </div>
      </div>
    );
  };




  return (
    <div className="space-y-10 pb-12">
      {renderPlans()}

      <div className="relative">
        {/* Overlay for Free Plan Users - Covers Filter & Jobs */}
        {(!user?.plan || user.plan === 'free') && (
          <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center rounded-3xl border border-white/20 pt-[20vh]">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4 border border-white/50 sticky top-20">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-slate-900/20">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Unlock Job Listings</h3>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">
                Subscribe to any plan above to view full job details and start applying.
              </p>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select a plan above
              </div>
            </div>
          </div>
        )}

        <div className={(!user?.plan || user.plan === 'free') ? 'blur-sm pointer-events-none select-none opacity-50' : ''}>

          {/* Glassmorphic Header - Mobile Optimized */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-[32px] bg-slate-900 text-white p-6 sm:p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-blue-200">
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Job Search
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3">
                Browse Jobs
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                Discover opportunities that match your <span className="text-white font-bold">skills</span> and <span className="text-white font-bold">aspirations</span>.
              </p>
            </div>
          </div>

          {/* Ad Banner - Home Banner Placement */}
          <AdBanner position="home-banner" />

          {/* Sticky Search & Filter Bar */}
          <div className="sticky top-4 z-40 mb-8">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2 md:p-3 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by role, company, or keywords..."
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border-0 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white rounded-xl transition-all font-medium"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                  <div className="relative w-40 md:w-56 flex-shrink-0 group">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Location..."
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      className="block w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border-0 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white rounded-xl transition-all font-medium"
                    />
                  </div>

                  <Button
                    variant={showFilters ? "primary" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex-shrink-0 gap-2 h-auto py-3 md:py-3.5 px-4 md:px-6 rounded-xl font-bold transition-all ${showFilters ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>

                  <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200 flex-shrink-0">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      title="List View"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Filters Panel */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="p-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Department</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={jobCategory}
                        onChange={(e) => setJobCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
                      >
                        <option value="all">All Departments</option>
                        <option value="Technology">Technology</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Sales">Sales</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Job Type</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-0 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
                      >
                        <option value="all">Any Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Tags */}
              {(jobCategory !== 'all' || jobType !== 'all') && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 px-1">
                  {jobCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 animate-in fade-in zoom-in duration-200">
                      {jobCategory}
                      <button onClick={() => setJobCategory('all')} className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {jobType !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 animate-in fade-in zoom-in duration-200">
                      {jobType}
                      <button onClick={() => setJobType('all')} className="hover:bg-emerald-100 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  <button onClick={clearAllFilters} className="text-xs font-bold text-slate-500 hover:text-slate-900 underline ml-auto transition-colors">Clear all</button>
                </div>
              )}
            </div>
          </div>

          {/* Ad Banner - Jobs Page Placement */}
          <AdBanner position="jobs-page" />

          {/* Jobs Grid Container with Overlay relative positioning */}
          <div className="relative">
            {/* Overlay for Free Plan Users */}
            {(!user?.plan || user.plan === 'free') && (
              <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center rounded-3xl border border-white/20">
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4 border border-white/50">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-slate-900/20">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Unlock Job Listings</h3>
                  <p className="text-slate-600 mb-6 font-medium leading-relaxed">
                    Subscribe to any plan above to view full job details and start applying.
                  </p>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select a plan above
                  </div>
                </div>
              </div>
            )}

            {/* Actual Job Grid (Blurred if free plan) */}
            <div className={(!user?.plan || user.plan === 'free') ? 'blur-sm pointer-events-none select-none opacity-50' : ''}>
              {browseJobsLoading ? (

                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={`bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm ${viewMode === 'list' ? 'flex items-center gap-6' : ''}`}>
                      {viewMode === 'list' ? (
                        <>
                          <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                            <div className="flex gap-2 mt-2">
                              <Skeleton className="h-4 w-16 rounded-md" />
                              <Skeleton className="h-4 w-16 rounded-md" />
                            </div>
                          </div>
                          <Skeleton className="h-10 w-28 rounded-xl" />
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-6">
                            <Skeleton className="w-16 h-16 rounded-2xl" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </div>
                          <div className="space-y-3 mb-6">
                            <Skeleton className="h-7 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                          <div className="flex gap-2 mb-6">
                            <Skeleton className="h-6 w-20 rounded-lg" />
                            <Skeleton className="h-6 w-20 rounded-lg" />
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-28 rounded-xl" />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 md:p-16 border border-slate-100 text-center shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No jobs found</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                    We couldn't find any positions matching your search. Try adjusting your filters or search for something else.
                  </p>
                  <Button variant="outline" onClick={clearAllFilters} className="rounded-full px-8 py-3 !border-slate-200 !text-slate-600 hover:!border-slate-300 hover:!bg-slate-50 font-bold">
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => onNavigate('job-details', job.id)}
                      className={`bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_-6px_rgba(59,130,246,0.15)] hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden ${viewMode === 'list' ? 'flex items-center gap-6' : 'flex flex-col h-full'}`}
                    >
                      {/* Decorative Background Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/50 to-transparent rounded-bl-[100px] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                      {/* Saved Button (Heart) */}
                      <button
                        onClick={(e) => handleToggleSave(e, job.id)}
                        disabled={isTogglingSave === job.id}
                        className={`absolute top-6 right-6 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${savedJobIds.includes(job.id)
                          ? 'bg-pink-50 text-pink-500 hover:bg-pink-100'
                          : 'bg-white/80 text-slate-400 hover:text-pink-500 hover:bg-pink-50 border border-transparent hover:border-pink-200'
                          } ${isTogglingSave === job.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={savedJobIds.includes(job.id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`w-5 h-5 ${savedJobIds.includes(job.id) ? 'animate-heartbeat' : ''}`}
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </button>

                      {viewMode === 'list' ? (
                        // LIST VIEW LAYOUT
                        <>
                          <button
                            onClick={(e) => handleToggleSave(e, job.id)}
                            disabled={isTogglingSave === job.id}
                            className={`absolute top-6 right-6 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${savedJobIds.includes(job.id)
                              ? 'bg-pink-50 text-pink-500 hover:bg-pink-100'
                              : 'bg-white/80 text-slate-400 hover:text-pink-500 hover:bg-pink-50 border border-transparent hover:border-pink-200'
                              } ${isTogglingSave === job.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill={savedJobIds.includes(job.id) ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`w-5 h-5 ${savedJobIds.includes(job.id) ? 'animate-heartbeat' : ''}`}
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </button>
                          <div className="flex-shrink-0 relative z-10 font-bold text-slate-700">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 font-bold text-2xl flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-shadow">
                              <div className="absolute inset-0 bg-slate-50/50"></div>
                              {typeof job.company.logo === 'string' && job.company.logo.length > 2
                                ? <img src={job.company.logo} alt="" className="w-full h-full object-cover relative z-10" />
                                : <span className="relative z-10">{job.company.name.charAt(0)}</span>}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 relative z-10">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold !text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                              <div className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 text-[10px] font-bold border border-slate-200 whitespace-nowrap hidden sm:block">
                                {job.job_type}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-2">
                              <span className="text-slate-800">{job.company.name}</span>
                              <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.salary_min > 0 && (
                                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100 flex items-center gap-1 shadow-sm">
                                  <DollarSign className="w-3 h-3" />
                                  ₹{(job.salary_min / 100000).toFixed(1)}L - {job.salary_max ? (job.salary_max / 100000).toFixed(1) + 'L' : 'Negotiable'}
                                </span>
                              )}
                              {(job.category ? [job.category] : []).map((tag, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-[11px] font-semibold border border-slate-100 shadow-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex-shrink-0 relative z-10 flex flex-col items-end gap-3 ml-4">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5" /> {job.posted_date}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('job-details', job.id);
                              }}
                              className="rounded-xl px-6 py-2 bg-slate-900 text-white shadow-md hover:bg-black hover:scale-105 transition-all font-bold text-sm z-20 relative cursor-pointer whitespace-nowrap"
                            >
                              View Details
                            </button>
                          </div>
                        </>
                      ) : (
                        // GRID VIEW LAYOUT (Original)
                        <>
                          <div className="relative z-10 flex-1">
                            <div className="flex items-start justify-between mb-5">
                              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 font-bold text-2xl flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-shadow">
                                <div className="absolute inset-0 bg-slate-50/50"></div>
                                {typeof job.company.logo === 'string' && job.company.logo.length > 2
                                  ? <img src={job.company.logo} alt="" className="w-full h-full object-cover relative z-10" />
                                  : <span className="relative z-10">{job.company.name.charAt(0)}</span>}
                              </div>
                              {/* Job Type Pill */}
                              <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors mr-8">
                                {job.job_type}
                              </div>
                            </div>

                            <div className="mb-4">
                              <h3 className="text-xl font-bold !text-slate-900 leading-tight group-hover:text-blue-600 transition-colors mb-1.5 line-clamp-1">{job.title}</h3>
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                <span className="text-slate-800">{job.company.name}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {job.salary_min > 0 && (
                                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                                  <DollarSign className="w-3.5 h-3.5" />
                                  ₹{(job.salary_min / 100000).toFixed(1)}L - {job.salary_max ? (job.salary_max / 100000).toFixed(1) + 'L' : 'Negotiable'}
                                </span>
                              )}
                              {(job.category ? [job.category] : []).map((tag, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-100 shadow-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                              {job.description}
                            </p>
                          </div>

                          <div className="relative z-10 pt-5 border-t border-slate-50/80 flex items-center justify-between mt-auto">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> Posted {job.posted_date}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('job-details', job.id);
                              }}
                              className="rounded-xl px-6 py-2.5 bg-slate-900 text-white shadow-md hover:bg-black hover:scale-105 transition-all font-bold text-sm z-20 relative cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )
              }
            </div>
          </div>
          <div className="flex justify-center mt-8">
            {hasMore && !browseJobsLoading && (
              <Button onClick={handleLoadMore} variant="outline" className="px-8 py-3 rounded-xl border-slate-200 hover:bg-slate-50 font-bold text-slate-600">
                Load More Jobs
              </Button>
            )}
            {browseJobsLoading && browseJobs.length > 0 && (
              <div className="text-slate-400 font-medium">Loading more...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerBrowseJobs;
