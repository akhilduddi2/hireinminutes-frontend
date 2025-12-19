import React from 'react';
import { Briefcase } from 'lucide-react';

interface FooterProps {
    onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
    return (
        <footer className="bg-slate-950 text-white py-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
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
                                onNavigate('admin/login');
                            }} className="hover:text-blue-400 transition-colors">Admin Dashboard</button></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 text-center text-slate-500">
                    <p>&copy; 2025 hireinminutes. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
