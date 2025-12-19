import React, { useState, useEffect } from 'react';
import { GraduationCap, Users, Shield, CheckCircle, Zap, Globe, ArrowLeft, User, Sparkles } from 'lucide-react';

interface CollegeAuthLayoutProps {
    children: React.ReactNode;
    onNavigate: (page: string) => void;
}

export function CollegeAuthLayout({ children, onNavigate }: CollegeAuthLayoutProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const benefits = [
        { icon: Users, text: 'Connect students with top employers' },
        { icon: Shield, text: 'Verified placement tracking' },
        { icon: Zap, text: 'Streamlined campus recruitment' },
        { icon: Globe, text: 'Access to global opportunities' },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-slate-50 relative selection:bg-blue-100">

            {/* Background Ambience (Fixed & Static) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-blue-100 to-blue-200 blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-purple-100 to-pink-100 blur-[100px] opacity-60"></div>
                <div className="absolute top-[30%] left-[60%] w-[20vw] h-[20vw] rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 blur-[80px] opacity-50"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center p-4 pt-12 pb-12 md:p-8 md:pt-16">

                {/* Navigation / Return */}
                <div className="w-full max-w-6xl mb-6 flex justify-start">
                    <button
                        onClick={() => onNavigate('landing')}
                        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 hover:bg-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </button>
                </div>

                {/* Main Split Card */}
                <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row min-h-[600px] max-w-6xl w-full transition-all duration-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

                    {/* Left Side: Image Panel */}
                    <div className="md:w-5/12 relative overflow-hidden h-64 md:h-auto group bg-slate-900">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)` }}>
                        </div>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent md:bg-gradient-to-r md:from-slate-900/80 md:to-transparent"></div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center text-white relative z-10">
                            <div className="inline-flex items-center px-3 py-1 mb-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-full w-fit">
                                <Sparkles className="h-3 w-3 text-blue-300 mr-2" />
                                <span className="text-xs font-bold tracking-widest uppercase text-blue-100">Academic Partnership</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                Join the Network.
                            </h1>
                            <p className="text-slate-300 text-lg mb-8 max-w-sm">
                                Register your institution to connect students with top-tier opportunities and streamline campus placements.
                            </p>

                            <div className="hidden md:block space-y-4">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-3 text-slate-300">
                                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                                                <Icon className="h-4 w-4 text-blue-200" />
                                            </div>
                                            <span className="text-sm font-medium">{benefit.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form Panel */}
                    <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto max-h-[80vh] md:max-h-none">
                        <div className="w-full max-w-md mx-auto">

                            {/* Mobile Header */}
                            <div className="md:hidden mb-8 text-center">
                                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 rounded-xl shadow-lg shadow-slate-200">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    College Registration
                                </h1>
                            </div>

                            {/* Desktop Header Icon */}
                            <div className="hidden md:flex justify-center mb-8">
                                <div className="w-14 h-14 bg-slate-50 text-slate-900 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100">
                                    <GraduationCap className="h-7 w-7" />
                                </div>
                            </div>

                            {children}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
