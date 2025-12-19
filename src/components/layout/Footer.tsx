import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { CardNav } from '../ui/CardNav'; // Assuming CardNav handles links, or we use simple links

export function Footer() {
    return (
        <footer className="bg-slate-900 pt-16 pb-8 text-slate-400">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white text-xl font-bold">
                            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">H</span>
                            HireInMinutes
                        </div>
                        <p className="text-sm leading-relaxed">
                            We connect students, recruiters, and colleges to bridge the gap between fresh talent and great opportunities.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Find Jobs</a></li>
                            <li><button onClick={() => window.location.href = '/pricing'} className="hover:text-blue-500 transition-colors">Pricing Plans</button></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Find Candidates</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">College Partners</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Skill Passport</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Resources</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Success Stories</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-3 items-start">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>123 Tech Park, Innovation Street, Bangalore, India 560100</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>support@hireinminutes.com</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} HireInMinutes. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
