import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Briefcase, Building2,
  Rocket, GraduationCap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Testimonials } from '../components/Testimonials';
import { FeaturesBento } from '../components/FeaturesBento';
import { AboutSection } from '../components/AboutSection';

interface LandingPageProps {
  onNavigate: (page: string, jobId?: string, role?: 'job_seeker' | 'employer', courseId?: string, successMessage?: string, profileSlug?: string, dashboardSection?: string, authMode?: 'signin' | 'signup') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { profile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  // --- Restored Data ---




  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">

      {/* Hero Section */}
      <div className={`relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2 opacity-60"
          >
            <source src="/KODERSPARK.mp4" type="video/mp4" />
          </video>
          {/* Dark Tint Overlay */}
          <div className="absolute inset-0 bg-slate-900/60"></div>
          {/* Gradient Overlay for Fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-white tracking-wide">Hire in Minutes</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
              Where Skills <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Meet Opportunity
              </span>
            </h1>

            <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-xl drop-shadow-md">
              We transform the hiring process into an elegant, skill-first experience. Elevate your career or company with our verified talent ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
              <Button
                onClick={() => onNavigate('role-select')}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all hover:scale-105 flex items-center justify-center group"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold rounded-full transition-all hover:scale-105 flex items-center justify-center"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FeaturesBento onNavigate={onNavigate} />


      {/* Ecosystem Opportunities */}
      <section className="min-h-screen flex flex-col justify-center py-16 md:py-32 bg-slate-950 relative overflow-hidden">
        {/* Background Gradients & Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 top-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[128px]"></div>
        <div className="absolute right-0 bottom-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[128px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-blue-400 font-semibold tracking-wider text-sm mb-4 uppercase">
                <span className="w-8 h-[2px] bg-blue-500"></span>
                <span>Our Ecosystem</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                One Platform. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">Endless Possibilities.</span>
              </h2>
            </div>
            <p className="text-slate-400 max-w-md text-base md:text-lg leading-relaxed">
              connects talent, recruiters, and educational institutions in a unified, skill-centric hiring experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Internships Card */}
            <div ref={addToRefs} className="group relative bg-slate-900 border border-white/5 p-6 md:p-8 rounded-[2rem] hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400 mb-6 md:mb-8 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-300">
                  <Rocket size={24} className="md:w-[26px] md:h-[26px]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">Internships</h3>
                <p className="text-slate-400 leading-relaxed mb-6 md:mb-8 md:min-h-[6rem]">
                  Launch your career by working directly with founders on real-world projects. Earn stipends and gain verified experience.
                </p>
                <div className="pt-6 md:pt-8 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-slate-500 group-hover:text-blue-400 transition-colors">Start your journey</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 group-hover:rotate-[-45deg]">
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
              <button onClick={() => onNavigate('internships')} className="absolute inset-0 z-20 cursor-pointer text-transparent">View Internships</button>
            </div>

            {/* Recruiters Card */}
            <div ref={addToRefs} className="group relative bg-slate-900 border border-white/5 p-6 md:p-8 rounded-[2rem] hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 overflow-hidden flex flex-col delay-100">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-purple-400 mb-6 md:mb-8 group-hover:bg-purple-500/10 group-hover:scale-110 transition-all duration-300">
                  <Building2 size={24} className="md:w-[26px] md:h-[26px]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">Recruiters</h3>
                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 md:min-h-[6rem]">
                  <li className="flex items-center text-slate-400 text-sm md:text-base">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 flex-shrink-0"></span>
                    Post unlimited jobs
                  </li>
                  <li className="flex items-center text-slate-400 text-sm md:text-base">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 flex-shrink-0"></span>
                    Access verified talent pool
                  </li>
                  <li className="flex items-center text-slate-400 text-sm md:text-base">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 flex-shrink-0"></span>
                    AI-powered matching
                  </li>
                </ul>
                <div className="pt-6 md:pt-8 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-slate-500 group-hover:text-purple-400 transition-colors">Hire top talent</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-300 group-hover:rotate-[-45deg]">
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
              <button onClick={() => onNavigate('role-select')} className="absolute inset-0 z-20 cursor-pointer text-transparent">Post a Job</button>
            </div>

            {/* Colleges Card */}
            <div ref={addToRefs} className="group relative bg-slate-900 border border-white/5 p-6 md:p-8 rounded-[2rem] hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/20 overflow-hidden flex flex-col delay-200">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 md:mb-8 group-hover:bg-indigo-500/10 group-hover:scale-110 transition-all duration-300">
                  <GraduationCap size={24} className="md:w-[26px] md:h-[26px]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">Universities</h3>
                <p className="text-slate-400 leading-relaxed mb-4 md:mb-6 md:min-h-[3rem]">
                  Real-time placement analytics and student performance tracking dashboard.
                </p>
                <div className="mb-4 bg-slate-800/50 rounded-lg p-3 border border-white/5">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Ecosystem Impact</span>
                    <span className="text-indigo-400">92/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-indigo-500 rounded-full"></div>
                  </div>
                </div>
                <div className="pt-6 md:pt-8 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-slate-500 group-hover:text-indigo-400 transition-colors">Partner with us</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300 group-hover:rotate-[-45deg]">
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
              <button onClick={() => onNavigate('college')} className="absolute inset-0 z-20 cursor-pointer text-transparent">Partner</button>
            </div>

          </div>
        </div>
      </section>

      <AboutSection onNavigate={onNavigate} />

      {/* RESTORED: User Reviews Section */}
      <Testimonials />



      {/* RESTORED: Detailed Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6" />
                <span className="text-lg font-bold">hireinminutes</span>
              </div>
              <p className="text-slate-400">Bridging the gap between talent and opportunity through verified skills.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => onNavigate('jobs')} className="hover:text-white transition-colors">Browse Jobs</button></li>
                <li><button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors">View Courses</button></li>
                <li><button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">Build Profile</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => onNavigate('role-select')} className="hover:text-white transition-colors">Post a Job</button></li>
                <li><button onClick={() => onNavigate('candidates')} className="hover:text-white transition-colors">Browse Talent</button></li>
                <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => onNavigate('college')} className="hover:text-white transition-colors">College Dashboard</button></li>
                <li><button onClick={() => onNavigate('college/register')} className="hover:text-white transition-colors">College Register</button></li>
                <li><button onClick={() => {
                  if (profile?.role === 'admin') {
                    onNavigate('admin');
                  } else {
                    onNavigate('admin/login');
                  }
                }} className="hover:text-white transition-colors">Admin Dashboard</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} hireinminutes. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Styles for animations */}
      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }
      `}</style>

    </div>
  );
}