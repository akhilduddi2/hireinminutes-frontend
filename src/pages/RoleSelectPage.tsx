import { useState, useEffect } from 'react';
import { ArrowRight, Briefcase, GraduationCap, User, CheckCircle2 } from 'lucide-react';

interface RoleSelectPageProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
}

type RoleType = 'candidate' | 'employer' | 'college';

export function RoleSelectPage({ onNavigate }: RoleSelectPageProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<RoleType>('candidate');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (tab: RoleType) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 200);
  };

  const handleNavigate = () => {
    if (activeTab === 'college') {
      onNavigate('college/login');
    } else {
      const roleId = activeTab === 'candidate' ? 'job_seeker' : 'employer';
      onNavigate('auth', undefined, roleId, undefined, undefined, undefined, undefined, 'signin');
    }
  };

  const roles = {
    candidate: {
      title: 'Job Seeker',
      subtitle: 'Find Your Dream Role',
      description: 'Access premium job listings, verified skill assessments, and direct career paths.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80', // Developer coding
      icon: User,
      color: 'text-blue-600',
      bgIcon: 'bg-blue-100',
      button: 'bg-slate-900 hover:bg-slate-800',
      features: ['Verified Companies', 'Skill Assessments', 'One-Click Apply']
    },
    employer: {
      title: 'Employer',
      subtitle: 'Hire Top Talent',
      description: 'Streamline your hiring process with AI-driven matching and verified candidates.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Modern meeting
      icon: Briefcase,
      color: 'text-purple-600',
      bgIcon: 'bg-purple-100',
      button: 'bg-slate-900 hover:bg-slate-800',
      features: ['AI Candidate Scoring', 'Automated Scheduling', 'Global Talent Pool']
    },
    college: {
      title: 'College',
      subtitle: 'Campus Placement',
      description: 'Connect your students with top-tier companies and track placement success.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Students group
      icon: GraduationCap,
      color: 'text-teal-600',
      bgIcon: 'bg-teal-100',
      button: 'bg-slate-900 hover:bg-slate-800',
      features: ['Corporate Connect', 'Student Tracking', 'Placement Analytics']
    }
  };

  const activeRole = roles[activeTab];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-slate-50 relative selection:bg-blue-100">

      {/* Background Ambience (Fixed & Static) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-blue-100 to-blue-200 blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-purple-100 to-pink-100 blur-[100px] opacity-60"></div>
        <div className="absolute top-[30%] left-[60%] w-[20vw] h-[20vw] rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 blur-[80px] opacity-50"></div>
      </div>

      {/* Main Content Container (Scrollable) */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4 pt-24 pb-12 md:p-8 md:pt-32">

        {/* Main Split Card */}
        <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row min-h-[550px] max-w-6xl w-full transition-all duration-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

          {/* Left Side: Image Panel */}
          <div className="md:w-5/12 relative overflow-hidden h-48 md:h-auto group">
            <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${isTransitioning ? 'scale-105' : 'scale-100'}`}
              style={{ backgroundImage: `url(${activeRole.image})` }}>
            </div>
            {/* Gradient Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 to-transparent md:hidden"></div>
            {/* Desktop Merging Effect (Fade to White) */}
            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-transparent via-white/10 to-white"></div>

            {/* Mobile Title Overlay (Hidden on Desktop) */}
            <div className="absolute bottom-4 left-4 md:hidden">
              <h3 className="text-xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">{activeRole.title}</h3>
            </div>
          </div>

          {/* Right Side: Content Panel */}
          <div className="md:w-7/12 p-6 md:p-10 flex flex-col justify-center bg-white relative">

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-8 w-full md:w-fit self-start border border-slate-200">
              {(['candidate', 'employer', 'college'] as RoleType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`
                    flex-1 md:flex-none px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 text-center whitespace-nowrap
                    ${activeTab === tab
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                  `}
                >
                  {tab === 'candidate' ? 'Job Seeker' : tab === 'employer' ? 'Employer' : 'College'}
                </button>
              ))}
            </div>

            {/* Dynamic Content */}
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>

              <div className="flex items-center mb-4">
                <div className={`p-1.5 rounded-lg ${activeRole.bgIcon} mr-2.5`}>
                  <activeRole.icon className={`w-4 h-4 ${activeRole.color}`} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${activeRole.color}`}>{activeRole.subtitle}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                {activeRole.title}
              </h2>

              <p className="text-slate-500 text-base leading-relaxed mb-6">
                {activeRole.description}
              </p>

              <div className="space-y-3 mb-8">
                {activeRole.features.map((feature, i) => (
                  <div key={i} className="flex items-center text-slate-600 font-medium text-sm">
                    <CheckCircle2 className={`w-4 h-4 mr-2.5 ${activeRole.color}`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNavigate}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-base shadow-lg transition-all duration-300 flex items-center justify-center group ${activeRole.button}`}
              >
                <span>Process to {activeTab === 'candidate' ? 'Profile' : 'Dashboard'}</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <div className="mt-6 text-center md:text-left">
                <button onClick={() => onNavigate('auth', undefined, 'job_seeker', undefined, undefined, undefined, undefined, 'signin')} className="text-slate-400 hover:text-slate-900 text-sm transition-colors font-medium">
                  Already have an account? <span className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900">Log in</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
