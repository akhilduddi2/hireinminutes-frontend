import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Shield,
  DollarSign,
  MessageCircle, ShieldCheck,
  Rocket, TrendingUp,
  CheckCircle, Zap,
  Target, Users, Briefcase
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TestimonialMarquee } from '../components/ui/TestimonialMarquee';
import { useAuth } from '../contexts/AuthContext';

interface ForCandidatesPageProps {
  onNavigate: (page: string) => void;
}

export function ForCandidatesPage({ onNavigate }: ForCandidatesPageProps) {
  const { profile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const candidateBenefits = [
    {
      icon: ShieldCheck,
      title: 'Verified Skill Badges',
      description: 'Get certified for your skills and stand out to employers with verified badges',
      color: 'text-emerald-400'
    },
    {
      icon: Zap,
      title: 'Instant Job Matching',
      description: 'Our AI matches you with relevant jobs instantly - no more endless searching',
      color: 'text-blue-400'
    },
    {
      icon: Target,
      title: 'Career Path Guidance',
      description: 'Personalized career recommendations based on your skills and goals',
      color: 'text-purple-400'
    },
    {
      icon: Users,
      title: 'Direct Employer Access',
      description: 'Connect directly with hiring managers and skip the middlemen',
      color: 'text-amber-400'
    },
    {
      icon: TrendingUp,
      title: '3x More Interviews',
      description: 'Verified candidates get 3x more interview calls on average',
      color: 'text-rose-400'
    },
    {
      icon: CheckCircle,
      title: 'Application Tracking',
      description: 'Track your applications from submitted to hired in real-time',
      color: 'text-indigo-400'
    }
  ];

  const successStories = [
    {
      name: 'Priya Sharma',
      role: 'React Developer',
      company: 'TechCorp',
      story: 'Got 3 interview calls within a week of getting verified. Landed a 40% higher salary than expected!',
      avatar: 'PS',
      badges: ['Verified React', 'Top 10%']
    },
    {
      name: 'Rahul Verma',
      role: 'Data Scientist',
      company: 'DataSystems',
      story: 'The skill verification helped me stand out. Recruiters contacted me instead of me applying!',
      avatar: 'RV',
      badges: ['Verified Python', 'ML Expert']
    },
    {
      name: 'Ananya Patel',
      role: 'Product Manager',
      company: 'StartupXYZ',
      story: 'Platform helped me transition from marketing to product management seamlessly.',
      avatar: 'AP',
      badges: ['Verified Product', 'Leadership']
    }
  ];

  const valuePropositions = [
    {
      title: 'Stop Getting Ghosted',
      description: 'Get real responses from verified employers who respect your time',
      icon: MessageCircle
    },
    {
      title: 'No More Resume Spam',
      description: 'Your contact info is only shared with companies you actually apply to',
      icon: Shield
    },
    {
      title: 'Salary Transparency',
      description: 'See real salary ranges before you apply - no more guessing games',
      icon: DollarSign
    },
    {
      title: 'Career Growth Focus',
      description: 'Jobs matched to your career path, not just immediate openings',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden font-sans text-slate-100">

      {/* Hero Section (Matched to LandingPage) */}
      <div className={`relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2 opacity-40"
          >
            <source src="/KODERSPARK.mp4" type="video/mp4" />
          </video>
          {/* Dark Tint Overlay */}
          <div className="absolute inset-0 bg-slate-900/70"></div>
          {/* Gradient Overlay for Fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-white tracking-wide">For Ambitious Talent</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
              Your Dream Job <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Is Waiting For You
              </span>
            </h1>

            <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl drop-shadow-md">
              Stop applying endlessly. Get matched with verified jobs that actually want your skills.
              Join thousands who found their perfect role through intelligent matching.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
              <Button
                onClick={() => onNavigate('role-select')}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-full transition-all hover:scale-105 flex items-center justify-center group"
              >
                Start Free Today
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => onNavigate('jobs')}
                className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold rounded-full transition-all hover:scale-105 flex items-center justify-center"
              >
                Browse Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div
        className="py-24 bg-white relative overflow-hidden"
      >
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Candidates Choose Us
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to land your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidateBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] hover:border-blue-200 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${benefit.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div
        className="py-24 bg-slate-50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Solving Real Job <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Search Problems</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                We built this platform to fix everything you hate about job hunting.
              </p>

              <div className="space-y-6">
                {valuePropositions.map((prop, index) => {
                  const Icon = prop.icon;
                  return (
                    <div key={index} className="flex items-start gap-5 p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{prop.title}</h3>
                        <p className="text-slate-600 text-sm">{prop.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Side */}
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
                <div className="space-y-4">
                  {/* Mock UI Elements */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={20} /></div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">Application Viewed</div>
                        <div className="text-xs text-slate-500">Just now</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><MessageCircle size={20} /></div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">Interview Invite Received</div>
                        <div className="text-xs text-slate-500">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Zap size={20} /></div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">Skills Verified</div>
                        <div className="text-xs text-slate-500">Yesterday</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <TestimonialMarquee
        title="Success Stories"
        description="Real candidates who transformed their careers with our platform"
        items={successStories}
        speed="slow"
      />

      {/* Final CTA */}
      <div
        className="py-24 bg-slate-50 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
            <Rocket className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Ready to Transform?</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Your Next Career Move <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Starts Here</span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of successful candidates who found better jobs, faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('role-select')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-lg px-8 py-6 rounded-full shadow-lg shadow-blue-500/20"
            >
              <span className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('demo')}
              className="border border-slate-200 text-slate-700 hover:bg-white bg-white px-8 py-6 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <span className="flex items-center">
                Book a Demo
                <MessageCircle className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>
          <p className="text-slate-500 mt-8 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Briefcase className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold tracking-tight">hireinminutes</span>
              </div>
              <p className="text-slate-400 leading-relaxed">Bridging the gap between talent and opportunity through verified skills.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">For Job Seekers</h4>
              <ul className="space-y-4 text-slate-400">
                <li><button onClick={() => onNavigate('jobs')} className="hover:text-blue-400 transition-colors">Browse Jobs</button></li>
                <li><button onClick={() => onNavigate('for-candidates')} className="hover:text-blue-400 transition-colors">For Candidates</button></li>
                <li><button onClick={() => onNavigate('role-select')} className="hover:text-blue-400 transition-colors">Sign Up</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">For Employers</h4>
              <ul className="space-y-4 text-slate-400">
                <li><button onClick={() => onNavigate('for-recruiters')} className="hover:text-blue-400 transition-colors">For Recruiters</button></li>
                <li><button onClick={() => onNavigate('role-select')} className="hover:text-blue-400 transition-colors">Post a Job</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-slate-400">
                <li><button onClick={() => onNavigate('faq')} className="hover:text-blue-400 transition-colors">FAQ</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors">Contact Us</button></li>
                <li><button onClick={() => onNavigate('landing')} className="hover:text-blue-400 transition-colors">Home</button></li>
                <li><button onClick={() => {
                  if (profile?.role === 'admin') {
                    onNavigate('admin');
                  } else {
                    onNavigate('admin/login');
                  }
                }} className="hover:text-blue-400 transition-colors">Admin Dashboard</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-slate-500">
            <p>&copy; 2025 hireinminutes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}