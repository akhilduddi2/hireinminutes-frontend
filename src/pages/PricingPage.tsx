import { Footer } from '../components/layout/Footer';
import { Check, Zap, Star, Crown, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getApiUrl } from '../config/api';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
    const { user } = useAuth();
    const [collegeDiscount, setCollegeDiscount] = useState(false);

    useEffect(() => {
        if (user && user.college) {
            setCollegeDiscount(true);
        } else {
            setCollegeDiscount(false);
        }
    }, [user]);

    const plans = [
        {
            name: 'Starter',
            originalPrice: '₹299',
            price: collegeDiscount ? '₹239' : '₹299', // 20% discount
            period: '/month',
            description: 'Perfect for getting started with your job search.',
            icon: Zap,
            color: 'bg-blue-500',
            features: [
                'Unlimited Job Applications',
                'Basic Profile Visibility',
                'Email Alerts',
                'Standard Support'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Skill Pro',
            originalPrice: '₹399',
            price: collegeDiscount ? '₹319' : '₹399', // 20% discount
            period: '/month',
            description: 'Validate your skills and stand out.',
            icon: Star,
            color: 'bg-indigo-500',
            features: [
                'Everything in Starter',
                '1 Verified Skill Test',
                'Skill Badge on Profile',
                'Priority Application Status'
            ],
            cta: 'Upgrade to Pro',
            popular: true
        },
        {
            name: 'Career Boost',
            originalPrice: '₹499',
            price: collegeDiscount ? '₹399' : '₹499', // 20% discount
            period: '/month',
            description: 'Get interview ready with AI mentorship.',
            icon: Shield,
            color: 'bg-purple-500',
            features: [
                'Everything in Skill Pro',
                '1 AI Mock Interview',
                'Detailed Feedback Report',
                'Interview Readiness Score'
            ],
            cta: 'Boost Career',
            popular: false
        },
        {
            name: 'Legendary',
            originalPrice: '₹999',
            price: collegeDiscount ? '₹799' : '₹999', // 20% discount
            period: '/month',
            description: 'Maximum visibility and direct recruiter reach.',
            icon: Crown,
            color: 'bg-amber-500',
            features: [
                'Everything in Career Boost',
                '2 Verified Skill Tests',
                '2 AI Mock Interviews',
                'Direct Recruiter Messaging',
                'Top of Candidate List'
            ],
            cta: 'Go Legendary',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="h-20"></div>

            <main className="pt-8 pb-20">
                <div className="container mx-auto px-4 max-w-7xl">

                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">Premium Plans</h2>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Future Career</span>
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed mb-4">
                            Unlock the tools you need to get hired faster. From verified skill badges to AI interview practice, we have a plan for every stage of your journey.
                        </p>
                        {collegeDiscount && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                                <p className="text-green-800 font-semibold text-center">
                                    🎓 Your college is our partner, so enjoy 20% discount on all premium plans!
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative bg-white rounded-3xl p-8 shadow-xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${plan.popular ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200'}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-2xl ${plan.color} bg-opacity-10 flex items-center justify-center mb-6`}>
                                    <plan.icon className={`w-6 h-6 ${plan.color.replace('bg-', 'text-')}`} />
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        {collegeDiscount && plan.originalPrice !== plan.price ? (
                                            <>
                                                <span className="text-2xl font-bold text-slate-500 line-through">{plan.originalPrice}</span>
                                                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                                            </>
                                        ) : (
                                            <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                                        )}
                                        <span className="text-slate-500 font-medium">{plan.period}</span>
                                    </div>
                                    <p className="text-slate-500 text-sm mt-3 leading-relaxed">{plan.description}</p>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                            <Check className={`w-5 h-5 ${plan.color.replace('bg-', 'text-')} shrink-0`} />
                                            <span className="leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => onNavigate('auth', undefined, 'job_seeker', undefined, undefined, undefined, undefined, 'signup')}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 ${plan.popular
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add-on Pricing */}
                    <div className="mt-20 max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                        <div className="bg-slate-900 p-8 text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Need a Retry?</h3>
                            <p className="text-slate-400">Low score? No worries. Purchase single attempts securely.</p>
                        </div>
                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            <div className="p-8 text-center hover:bg-slate-50 transition-colors group">
                                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">₹108</div>
                                <div className="font-bold text-slate-700 mb-4">Skill Test Retry</div>
                                <p className="text-sm text-slate-500 mb-6">Retake any programming or domain skill test to improve your score.</p>
                                <button className="px-6 py-2 rounded-lg border-2 border-slate-900 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-colors">Buy Attempt</button>
                            </div>
                            <div className="p-8 text-center hover:bg-slate-50 transition-colors group">
                                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">₹108</div>
                                <div className="font-bold text-slate-700 mb-4">Interview Retry</div>
                                <p className="text-sm text-slate-500 mb-6">Book another session with our AI Mentor for a fresh evaluation.</p>
                                <button className="px-6 py-2 rounded-lg border-2 border-slate-900 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-colors">Buy Session</button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
