import {
    Shield, GraduationCap, Briefcase, CheckCircle,
    TrendingUp, Users
} from 'lucide-react';
import { Button } from './ui/Button';

export function FeaturesBento({ onNavigate }: { onNavigate: (page: string) => void }) {
    return (
        <section className="min-h-screen flex flex-col justify-center py-12 md:py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 leading-tight">
                        A Smarter Way to <span className="text-blue-600">Hire & Get Hired</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        We combine real skills, verified assessments, and meaningful opportunities into one platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[minmax(180px,auto)]">

                    {/* Skill Passport - Large Card */}
                    <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl">
                        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 pointer-events-none">
                            <Shield size={200} className="md:w-[300px] md:h-[300px]" />
                        </div>
                        <div className="p-6 md:p-8 h-full flex flex-col relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                                    <Shield size={24} className="md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900">Skill Passport</h3>
                            </div>
                            <p className="text-base md:text-lg text-slate-600 mb-8 max-w-lg">
                                Your new digital hiring identity. Showcase verified skills, earned badges, and project portfolios.
                                Share it anywhere to stand out from the crowd.
                            </p>
                            <div className="mt-auto flex gap-4">
                                <Button onClick={() => onNavigate('profile')} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full w-full md:w-auto justify-center">
                                    Create Your Passport
                                </Button>
                            </div>

                            {/* Visual Representation - Hidden on mobile, shown on md+ */}
                            <div className="hidden md:block absolute bottom-8 right-8 w-80 bg-slate-900 rounded-2xl p-4 shadow-2xl rotate-[-5deg] group-hover:rotate-0 transition-all duration-500 border border-slate-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                    <div>
                                        <div className="h-2 w-24 bg-slate-700 rounded-full mb-1"></div>
                                        <div className="h-2 w-16 bg-slate-800 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-slate-800 rounded-full"></div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full"></div>
                                    <div className="h-2 w-2/3 bg-slate-800 rounded-full"></div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <div className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs text-center border border-green-500/30">Verified</div>
                                    <div className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs text-center border border-blue-500/30">Top 5%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* For Students - Vertical Card */}
                    <div className="md:row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
                        <div className="p-6 md:p-8 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <GraduationCap size={24} className="md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold">For Students</h3>
                            </div>
                            <ul className="space-y-4 md:space-y-6">
                                {[
                                    'Build verified Skill Passport',
                                    'Take skill assessments',
                                    'Direct internship access',
                                    'Earn badges & rewards'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 p-0.5 rounded-full bg-blue-500 border border-blue-400">
                                            <CheckCircle size={14} className="text-white" />
                                        </div>
                                        <span className="text-blue-50 font-medium text-base md:text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto pt-8">
                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="text-2xl md:text-3xl font-bold mb-1">500+</div>
                                    <div className="text-xs md:text-sm text-blue-200">New internships added this week</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* For Recruiters - Wide Card */}
                    <div className="md:col-span-3 relative group overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl">
                        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                                        <Briefcase size={24} className="md:w-7 md:h-7" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">For Recruiters</h3>
                                </div>
                                <p className="text-base md:text-lg text-slate-600 mb-6">
                                    Skip the noise. Hire pre-vetted candidates with verified skills.
                                    Reduce your time-to-hire by 60% with our automated screening.
                                </p>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {['Verified Candidates', 'Instant Hiring', 'Premium Talent'].map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 text-xs md:text-sm font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="relative mt-6 md:mt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <TrendingUp className="text-green-500 mb-2 w-5 h-5 md:w-6 md:h-6" />
                                        <div className="text-xl md:text-2xl font-bold text-slate-900">60%</div>
                                        <div className="text-xs text-slate-500">Faster Hiring</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <Users className="text-blue-500 mb-2 w-5 h-5 md:w-6 md:h-6" />
                                        <div className="text-xl md:text-2xl font-bold text-slate-900">10k+</div>
                                        <div className="text-xs text-slate-500">Active Talent</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
