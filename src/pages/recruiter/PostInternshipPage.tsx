import { useState } from 'react';
import { Rocket, Lightbulb, IndianRupee, Clock, ArrowRight, Target } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

export function PostInternshipPage({ onNavigate }: { onNavigate?: any }) {
    const [formData, setFormData] = useState({
        title: '',
        ideaPitch: '',
        stipendRange: '',
        duration: '3 Months',
        skills: '',
        equity: false
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="h-20"></div>

            <main className="pt-8 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">

                    {/* Header for Founders */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-200">
                            <Rocket className="w-4 h-4" /> Founder & Startup Track
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Dream Team</span></h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Hire ambitious student interns who want to build real products. Perfect for MVPs, prototypes, and early-stage scaling.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                        {/* Progress Bar Mock */}
                        <div className="h-2 w-full bg-slate-100">
                            <div className="h-full w-1/3 bg-purple-600 rounded-r-full"></div>
                        </div>

                        <div className="p-8 md:p-12">

                            <form className="space-y-8">

                                {/* Section 1: The Idea */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                            <Lightbulb className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">What are you building?</h3>
                                    </div>

                                    <div className="grid gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Project / Internship Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium"
                                                placeholder="e.g. Build MVP for Fintech App"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">The Pitch (Why should they join?)</label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium resize-none"
                                                placeholder="Describe your vision, the problem you're solving, and what the intern will learn..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Section 2: The Offer */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">The Offer</h3>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Stipend</label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                <select className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none appearance-none font-medium bg-white">
                                                    <option>₹2,000 - ₹5,000</option>
                                                    <option>₹5,000 - ₹10,000</option>
                                                    <option>₹10,000 - ₹20,000</option>
                                                    <option>Unpaid (Equity Only)</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                <select className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none appearance-none font-medium bg-white">
                                                    <option>1 Month</option>
                                                    <option>2 Months</option>
                                                    <option>3 Months</option>
                                                    <option>6 Months</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                                        <div>
                                            <div className="font-bold text-purple-900 text-sm">Offer Equity / PPO?</div>
                                            <div className="text-xs text-purple-700">Check this if you plan to offer stock options or a full-time role after the internship.</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="pt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20">
                                        Next Step: Skill Requirements <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}
