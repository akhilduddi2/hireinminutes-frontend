import { useState } from 'react';
import {
    Users, Building2, TrendingUp, Award, Calendar,
    ArrowUpRight, Download, Filter, Search, ChevronDown,
    PieChart, BarChart3, Activity
} from 'lucide-react';
import { Footer } from '../../components/layout/Footer';

// Mock Data for Charts/Stats
const stats = [
    { label: 'Total Placed', value: '842', change: '+12%', trend: 'up', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Avg. Package', value: '₹8.5 LPA', change: '+2.4L', trend: 'up', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Recruiters', value: '156', change: '+8', trend: 'up', icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Skill Qualified', value: '92%', change: '+5%', trend: 'up', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const recentDrives = [
    { company: 'TechCorp Solutions', role: 'SDE-1', package: '12-18 LPA', date: '2 Oct, 2024', status: 'Ongoing', applicants: 142 },
    { company: 'InnovateAI', role: 'ML Intern', package: '25k/mo', date: '5 Oct, 2024', status: 'Scheduled', applicants: 89 },
    { company: 'Global Systems', role: 'Analyst', package: '8-10 LPA', date: '28 Sep, 2024', status: 'Completed', applicants: 210 },
    { company: 'StartUp Hub', role: 'React Dev', package: '6-9 LPA', date: '25 Sep, 2024', status: 'Completed', applicants: 56 },
];

export function CollegeDashboard({ activeSection = 'overview', onNavigate }: { activeSection?: string, onNavigate: any }) {

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* Dashboard Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">College Portal</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Help</button>
                        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Placement Overview</h1>
                        <p className="text-slate-500">Track student performance and recruitment drives.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 text-sm">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 text-sm shadow-lg shadow-indigo-600/20">
                            <Calendar className="w-4 h-4" /> Schedule Drive
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} flex items-center gap-1`}>
                                    {stat.change} <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Chart Section (Mocked) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-slate-400" /> Department Performance
                            </h3>
                            <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500">
                                <option>This Year</option>
                                <option>Last Year</option>
                            </select>
                        </div>

                        {/* CSS Bar Chart Mock */}
                        <div className="h-64 flex items-end justify-between gap-4 px-2">
                            {[
                                { label: 'CSE', h: '85%' },
                                { label: 'ECE', h: '65%' },
                                { label: 'Mech', h: '45%' },
                                { label: 'Civil', h: '35%' },
                                { label: 'IT', h: '75%' },
                                { label: 'AI/ML', h: '92%' }
                            ].map((dept, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full bg-slate-100 rounded-t-lg relative h-full overflow-hidden">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-indigo-500 group-hover:bg-indigo-600 transition-all duration-500 rounded-t-lg"
                                            style={{ height: dept.h }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">{dept.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions / Notifications */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-slate-400" /> Recent Activity
                        </h3>
                        <div className="space-y-6">
                            {[
                                { text: 'TechCorp shortlisted 45 candidates', time: '2h ago', type: 'success' },
                                { text: 'New Drive Request from Infosys', time: '5h ago', type: 'info' },
                                { text: 'Placement Report generated', time: '1d ago', type: 'neutral' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 relative pl-4 border-l-2 border-slate-100">
                                    <div className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ${item.type === 'success' ? 'bg-green-500' : item.type === 'info' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 leading-tight mb-1">{item.text}</p>
                                        <span className="text-xs text-slate-400">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                            <h4 className="text-sm font-bold text-indigo-900 mb-1">Premium Partner Status</h4>
                            <p className="text-xs text-indigo-700 mb-3">Upgrade to verified partner to access detailed student skill passports.</p>
                            <button className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 w-full">Upgrade Now</button>
                        </div>
                    </div>

                </div>

                {/* Drives Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-slate-900">Recruitment Drives</h3>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Search companies..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-full sm:w-64" />
                            </div>
                            <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Company</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Package</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-right">Applicants</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentDrives.map((drive, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{drive.company}</td>
                                        <td className="px-6 py-4 text-slate-500">{drive.role}</td>
                                        <td className="px-6 py-4 text-slate-500 font-mono">{drive.package}</td>
                                        <td className="px-6 py-4 text-slate-500">{drive.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${drive.status === 'Ongoing' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    drive.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {drive.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900">{drive.applicants}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-100 text-center">
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All Drives</button>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
