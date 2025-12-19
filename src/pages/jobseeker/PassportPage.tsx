// import Link from 'react-router-dom';
import { Footer } from '../../components/layout/Footer';
import { SkillPassport } from '../../components/candidate/SkillPassport';
import { Briefcase, Eye, TrendingUp, Lock, Share2, CheckCircle2 } from 'lucide-react';

export function PassportPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navbar is handled by App.tsx CardNav */}
            <div className="h-20"></div>


            <main className="pt-8 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">

                    <div className="flex flex-col md:flex-row gap-12 items-start">

                        {/* Left: Passport Visualization */}
                        <div className="w-full md:w-5/12 sticky top-32">
                            <div className="mb-6 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">Skill Passport</h1>
                                <p className="text-slate-500">Your specific, verifiable hiring identity.</p>
                            </div>

                            <SkillPassport />

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:-translate-y-1 transition-transform">
                                    <Share2 className="w-4 h-4" /> Share Publicly
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                                    <Eye className="w-4 h-4" /> View Public Link
                                </button>
                            </div>
                        </div>

                        {/* Right: Detailed Analytics */}
                        <div className="w-full md:w-7/12 space-y-8">

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Profile Views', value: '1,240', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { label: 'Applications', value: '42', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
                                    { label: 'Skill Growth', value: '+12%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Verification Status */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">Verification Status</h3>
                                    <button className="text-blue-600 text-sm font-bold hover:underline">View Details</button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: 'Email Verified', status: 'Verified', date: 'Oct 12, 2024' },
                                        { label: 'Phone Verified', status: 'Verified', date: 'Oct 12, 2024' },
                                        { label: 'Skill Tests Passed', status: '3/4 Passed', date: 'Nov 01, 2024' },
                                        { label: 'Interview Badge', status: 'Pending', date: '-', action: 'Book Interview' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <span className="font-semibold text-slate-700">{item.label}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-slate-400 hidden sm:block">{item.date}</span>
                                                {item.action ? (
                                                    <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-lg shadow-slate-900/20">{item.action}</button>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-bold border border-green-100 flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Locked Features (Monetization Teaser) */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                <div className="relative z-10 flex items-start gap-6">
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                                        <Lock className="w-8 h-8 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Unlock Premium Insights</h3>
                                        <p className="text-slate-300 text-sm mb-6 leading-relaxed max-w-md">
                                            See exactly which companies viewed your profile, get AI-powered resume improvements, and access salary insights for your role.
                                        </p>
                                        <button className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20">
                                            Upgrade to Pro - ₹499/mo
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
