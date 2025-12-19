import { ChevronDown, ChevronUp, MessageCircle, Shield, Award, Users, Briefcase } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

interface FaqPageProps {
  onNavigate: (page: string) => void;
}

export function FaqPage({ onNavigate }: FaqPageProps) {
  const { profile } = useAuth();
  const [openItems, setOpenItems] = useState<number[]>([0, 1]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'candidates' | 'recruiters' | 'verification' | 'ads'>('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
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

  const faqs = {
    all: [
      {
        question: 'What makes V Hire Today different from other job portals?',
        answer: 'V Hire Today focuses on instant hiring with verified candidates. Every skill is validated through practical assessments, and recruiters get access to pre-vetted talent. Our platform also includes smart job matching, application tracking, and a gamified experience for candidates.',
        icon: Award
      },
      {
        question: 'Is V Hire Today free to use?',
        answer: 'Yes! Candidates can create profiles, get verified, and apply for jobs completely free. Recruiters can post jobs and browse candidate profiles for free, with premium features available for enhanced visibility and advanced tools. Our revenue comes from ads, verification services, and premium recruiter features.',
        icon: Shield
      }
    ],
    candidates: [
      {
        question: 'How does the skill verification process work?',
        answer: 'After creating your profile, you can apply for verification. You\'ll need to: 1) Submit your details and documents, 2) Complete skill assessments relevant to your field, 3) Pass background checks, 4) Receive your verified badge. Verified candidates get 3x more interviews and priority in recruiter searches.',
        icon: Award
      },
      {
        question: 'What are XP points and badges?',
        answer: 'XP (Experience Points) are earned by completing profile sections, applying for jobs, getting verified, and referring friends. Badges like "Verified", "Top 10% in React", and "Quick Responder" showcase your achievements to recruiters and improve your visibility on the platform.',
        icon: Award
      },
      {
        question: 'How does the smart job matching work?',
        answer: 'Our AI analyzes your skills, experience, location preferences, and career goals to match you with relevant jobs. The algorithm learns from your application behavior and continuously improves recommendations. You\'ll see match scores (e.g., 95% match) on job suggestions.',
        icon: Briefcase
      },
      {
        question: 'Can I track my application status?',
        answer: 'Yes! Our application tracker shows real-time status for each job: Applied → Viewed by Recruiter → Shortlisted → Interview Scheduled → Hired. You\'ll get notifications at each stage, and the progress bar helps you understand where you stand.',
        icon: Users
      }
    ],
    recruiters: [
      {
        question: 'How do I get approved as a recruiter?',
        answer: 'After signing up as a recruiter, submit your company details and verification documents. Our admin team reviews applications within 24-48 hours. Once approved, you\'ll get access to post jobs, view candidate profiles, and use all recruiter tools.',
        icon: Shield
      },
      {
        question: 'How does the 90-day satisfaction guarantee work?',
        answer: 'If a candidate you hired through our platform leaves within 90 days, we provide a full replacement or credit for your next hire. This applies to all verified candidates and ensures you get quality hires that stick.',
        icon: Shield
      },
      {
        question: 'Can I save candidates for future positions?',
        answer: 'Yes! Use the "Save to Talent Pool" feature to bookmark candidates. You can create custom talent pools for different roles or departments and reach out to saved candidates when new positions open up.',
        icon: Users
      },
      {
        question: 'Do you provide job templates?',
        answer: 'Absolutely! We offer templates like "Junior MERN Developer", "Data Analyst Intern", "Senior Product Manager" etc. You can customize these templates to create job postings in minutes instead of writing from scratch.',
        icon: Briefcase
      }
    ],
    verification: [
      {
        question: 'Why should I get verified as a candidate?',
        answer: 'Verified candidates get 3x more interview calls, appear higher in recruiter searches, earn exclusive badges, and have access to premium job opportunities. Verification proves your skills are genuine and helps you stand out.',
        icon: Award
      },
      {
        question: 'What skills can be verified?',
        answer: 'We verify technical skills (React, Node.js, Python, etc.), soft skills, language proficiency, and professional certifications. Each verification includes practical assessments and/or document validation.',
        icon: Award
      },
      {
        question: 'How long does verification take?',
        answer: 'Most verifications are completed within 3-5 business days. Technical skill assessments are typically instant or take a few hours, while document verification and background checks may take 1-2 business days.',
        icon: Shield
      },
      {
        question: 'Is there a cost for verification?',
        answer: 'Basic verification is free for all users. Premium verification with advanced assessments and certificates is available at ₹499. Some employers also sponsor verification for candidates they\'re interested in.',
        icon: Shield
      }
    ],
    ads: [
      {
        question: 'How do ads work on the platform?',
        answer: 'Ads are shown on application success pages, dashboards, and job listings. We maintain a frequency cap (max 1 ad per application, 5 per day) to avoid spamming. Ads follow our native design system and blend seamlessly with the UI.',
        icon: Shield
      },
      {
        question: 'Can I advertise my courses/services on V Hire Today?',
        answer: 'Yes! We welcome advertisers for courses, certification programs, resume services, and career-related products. Contact our ads team to create campaigns targeting specific skills, locations, or candidate types.',
        icon: Briefcase
      },
      {
        question: 'How are ads targeted?',
        answer: 'Ads can be targeted by: 1) User type (candidate/recruiter), 2) Skills/interests, 3) Location, 4) Experience level, 5) Platform behavior. We ensure ads are relevant and non-intrusive.',
        icon: Users
      }
    ]
  };

  const categories = [
    { id: 'all', label: 'All Questions', count: faqs.all.length + faqs.candidates.length + faqs.recruiters.length + faqs.verification.length + faqs.ads.length },
    { id: 'candidates', label: 'For Candidates', count: faqs.candidates.length },
    { id: 'recruiters', label: 'For Recruiters', count: faqs.recruiters.length },
    { id: 'verification', label: 'Verification', count: faqs.verification.length },
    { id: 'ads', label: 'Ads & Promotions', count: faqs.ads.length }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getCurrentFaqs = () => {
    if (activeCategory === 'all') {
      return [...faqs.all, ...faqs.candidates, ...faqs.recruiters, ...faqs.verification, ...faqs.ads];
    }
    return faqs[activeCategory];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32 pb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6">
              <MessageCircle className="h-4 w-4 text-blue-300 mr-2" />
              <span className="text-sm font-medium text-blue-200">Help Center</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Frequently Asked Questions
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-2">
                Get Instant Answers
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
              Find answers to common questions about V Hire Today - India's instant hiring platform
            </p>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* FAQ Content */}
      <div
        ref={(el) => sectionRefs.current[0] = el}
        className="relative -mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Card className="bg-white border-2 border-slate-100 rounded-2xl shadow-xl p-8">
          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {category.label}
                  <span className="ml-2 text-sm opacity-80">
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {getCurrentFaqs().map((faq, index) => {
              const Icon = faq.icon;
              return (
                <Card
                  key={index}
                  className={`overflow-hidden border-2 border-slate-100 hover:border-blue-200 transition-all duration-300 ${openItems.includes(index) ? 'shadow-lg' : ''
                    }`}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-lg font-semibold text-slate-900 text-left">{faq.question}</span>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      )}
                    </div>
                  </button>
                  {openItems.includes(index) && (
                    <div className="px-6 pb-5 animate-in">
                      <div className="pl-14">
                        <div className="prose prose-slate max-w-none">
                          <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Contact Section */}
      <div
        ref={(el) => sectionRefs.current[1] = el}
        className="py-20 bg-slate-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-2 border-slate-200 p-12 text-center">
            <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Still Have Doubts?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Our support team is here to help you with any questions
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
            >
              Contact Us
            </Button>
          </Card>
        </div>
      </div>

      {/* Footer */}
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
                <li><button onClick={() => onNavigate('for-candidates')} className="hover:text-white transition-colors">For Candidates</button></li>
                <li><button onClick={() => onNavigate('role-select')} className="hover:text-white transition-colors">Sign Up</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => onNavigate('for-recruiters')} className="hover:text-white transition-colors">For Recruiters</button></li>
                <li><button onClick={() => onNavigate('role-select')} className="hover:text-white transition-colors">Post a Job</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">FAQ</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => {
                  if (profile?.role === 'admin' || profile?.permissions?.isAdmin) {
                    onNavigate('admin');
                  } else {
                    onNavigate('admin/login');
                  }
                }} className="hover:text-white transition-colors">Admin Dashboard</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 hireinminutes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}