import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Briefcase, Heart, Filter, X, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  category: string;
  salary_min: number;
  salary_max: number;
  company: { name: string; isVerified?: boolean };
  posted_date: string;
}

interface JobsPageProps {
  onNavigate: (page: string, jobId?: string) => void;
}

export function JobsPage({ onNavigate }: JobsPageProps) {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  const loadJobs = async () => {
    setLoading(true);
    const dummyJobs: Job[] = [
      {
        id: '1',
        title: 'Software Engineer',
        description: 'Develop web applications using modern technologies. Experience with React and Node.js required.',
        location: 'Bangalore',
        job_type: 'Full-time',
        category: 'Technology',
        salary_min: 1200000,
        salary_max: 2000000,
        company: { name: 'TechCorp Solutions' },
        posted_date: '2 days ago'
      },
      {
        id: '2',
        title: 'Product Manager',
        description: 'Lead product development from concept to launch. Work with engineering and design teams.',
        location: 'Remote',
        job_type: 'Full-time',
        category: 'Management',
        salary_min: 1800000,
        salary_max: 3000000,
        company: { name: 'Product Labs' },
        posted_date: '1 week ago'
      },
      {
        id: '3',
        title: 'Data Analyst',
        description: 'Analyze business data and provide insights. SQL and Python experience required.',
        location: 'Hyderabad',
        job_type: 'Full-time',
        category: 'Data',
        salary_min: 800000,
        salary_max: 1500000,
        company: { name: 'Data Systems' },
        posted_date: '3 days ago'
      },
      {
        id: '4',
        title: 'Frontend Developer',
        description: 'Build user interfaces with React and TypeScript. Work in an agile environment.',
        location: 'Chennai',
        job_type: 'Contract',
        category: 'Technology',
        salary_min: 1000000,
        salary_max: 1800000,
        company: { name: 'Design Hub' },
        posted_date: 'Yesterday'
      },
      {
        id: '5',
        title: 'Marketing Specialist',
        description: 'Develop and execute marketing campaigns. Digital marketing experience preferred.',
        location: 'Mumbai',
        job_type: 'Full-time',
        category: 'Marketing',
        salary_min: 600000,
        salary_max: 1200000,
        company: { name: 'Growth Marketing' },
        posted_date: '4 days ago'
      },
      {
        id: '6',
        title: 'DevOps Engineer',
        description: 'Manage cloud infrastructure and CI/CD pipelines. AWS and Docker experience required.',
        location: 'Remote',
        job_type: 'Full-time',
        category: 'Technology',
        salary_min: 1500000,
        salary_max: 2500000,
        company: { name: 'Cloud Systems' },
        posted_date: '5 days ago'
      }
    ];
    setJobs(dummyJobs);
    setLoading(false);
  };

  const loadSavedJobs = useCallback(async () => {
    if (!profile) return;
    setSavedJobIds(new Set(['1', '4']));
  }, [profile]);

  useEffect(() => {
    loadJobs();
    if (profile) {
      loadSavedJobs();
    }
  }, [profile, loadSavedJobs]);

  const handleSaveJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) {
      onNavigate('role-select');
      return;
    }
    if (savedJobIds.has(jobId)) {
      setSavedJobIds(prev => { const next = new Set(prev); next.delete(jobId); return next; });
    } else {
      setSavedJobIds(prev => new Set(prev).add(jobId));
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.company?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesCategory = category === 'all' || job.category === category;
    const matchesJobType = jobType === 'all' || job.job_type === jobType;

    return matchesSearch && matchesLocation && matchesCategory && matchesJobType;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Management', label: 'Management' },
    { value: 'Data', label: 'Data' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' }
  ];

  const jobTypes = [
    { value: 'all', label: 'All Job Types' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Remote', label: 'Remote' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Next Job</h1>
          <p className="text-lg text-gray-600 mb-8">Browse {jobs.length}+ opportunities from top companies</p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-3 border-t md:border-t-0 md:border-l border-gray-200">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Location or remote" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <Button 
                onClick={loadJobs}
                className="bg-blue-600 hover:bg-blue-700 border-0"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} md:flex items-center gap-4`}>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {(searchQuery || location || category !== 'all' || jobType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLocation('');
                  setCategory('all');
                  setJobType('all');
                }}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="text-center py-16 border border-gray-200">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setLocation('');
                setCategory('all');
                setJobType('all');
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Clear filters
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                hover 
                className="border border-gray-200 hover:border-blue-300 transition-colors p-6"
                onClick={() => onNavigate('job-details', job.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-xl flex-shrink-0">
                      {job.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <p className="text-gray-700 font-medium">{job.company?.name}</p>
                            {job.company?.isVerified && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Verified Employer
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => handleSaveJob(job.id, e)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Heart className={`h-6 w-6 ${savedJobIds.has(job.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.job_type}
                        </span>
                        <span className="text-gray-500">{job.posted_date}</span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Annual salary</div>
                        </div>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('job-details', job.id);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}