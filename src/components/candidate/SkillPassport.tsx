import { useRef, useState } from 'react';
import { Shield, Download, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import html2canvas from 'html2canvas';

export function SkillPassport() {
    const { profile } = useAuth();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Default/Fallback values if no score yet
    const passport = (profile as any)?.skillPassport || {};
    const hasScore = passport.score > 0;

    const getSkillColor = (index: number) => {
        const colors = [
            'from-cyan-400 to-blue-500 shadow-cyan-500/50',
            'from-purple-400 to-pink-500 shadow-purple-500/50',
            'from-emerald-400 to-teal-500 shadow-emerald-500/50',
            'from-amber-400 to-orange-500 shadow-amber-500/50',
        ];
        return colors[index % colors.length];
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setIsDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2, // Higher quality
                useCORS: true, // Allow loading cross-origin images (like profile pic)
                logging: false,
            });

            const link = document.createElement('a');
            link.download = `SkillPassport-${passport.badgeId || 'Card'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to download passport:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="relative group">
            {/* Download Action Button - Only visible on hover of the container, acts as overlay control */}
            <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white transition-all shadow-lg"
                    title="Download Passport Image"
                >
                    {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    {isDownloading ? 'Saving...' : 'Save Card'}
                </button>
            </div>

            <div
                ref={cardRef}
                className="relative w-full aspect-[1.586/1] md:aspect-auto md:h-full min-h-[260px] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/50"
            >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#2e1065,transparent)]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                {/* Hexagonal/Grid Mesh Background */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}>
                </div>

                {/* Glowing Orbs */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 rounded-full blur-[50px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/20 rounded-full blur-[50px] pointer-events-none"></div>

                {/* Content Container */}
                <div className="relative z-10 h-full p-5 flex flex-col justify-between">

                    {/* Top Section: Header & Score */}
                    <div className="flex justify-between items-start">
                        {/* Identity Section */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg bg-slate-800">
                                {profile?.profilePicture ? (
                                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-400">
                                        {profile?.fullName?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-0.5">Passport ID</div>
                                <div className="text-white font-bold tracking-tight leading-none text-base shadow-black drop-shadow-md">
                                    {profile?.fullName || 'Job Seeker'}
                                </div>
                                <div className="text-[10px] font-mono text-purple-400 mt-1 tracking-wider">
                                    {passport.badgeId || 'UNVERIFIED'}
                                </div>
                            </div>
                        </div>

                        {/* Graphical Score Circle */}
                        <div className="relative flex items-center justify-center">
                            <svg className="w-20 h-20 -rotate-90">
                                <circle cx="40" cy="40" r="36" className="stroke-slate-700/50" strokeWidth="6" fill="transparent" />
                                <circle
                                    cx="40" cy="40" r="36"
                                    className="stroke-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray="226.2" // 2 * pi * 36
                                    strokeDashoffset={226.2 - (226.2 * (passport.score || 0)) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <span className="text-xl font-bold leading-none">{passport.score || 0}</span>
                                <span className="text-[9px] uppercase text-slate-400 font-bold mt-0.5">Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Chip & Hologram */}
                    <div className="flex items-center justify-between py-2 opacity-80">
                        <div className="flex items-center gap-2">
                            {/* EMV Chip Graphic */}
                            <div className="w-12 h-9 rounded bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border border-yellow-300 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[1px] bg-yellow-700/20 mix-blend-overlay border border-yellow-900/10 rounded"></div>
                            </div>
                            <Shield className="w-6 h-6 text-slate-500/50" />
                        </div>
                        <div className="text-right">
                            <div className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-1">Status</div>
                            <div className={`text-xs font-bold px-2 py-0.5 rounded border ${hasScore ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
                                {hasScore ? 'VERIFIED' : 'PENDING'}
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Graphical Skills Section */}
                    <div className="relative mt-2">
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2">
                            <div className="w-1 h-3 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                            Verified Capabilities
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {passport.verifiedSkills && passport.verifiedSkills.length > 0 ? (
                                passport.verifiedSkills.slice(0, 4).map((skill: string, idx: number) => (
                                    <div key={idx} className="relative">
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${getSkillColor(idx)} rounded-lg opacity-30 blur`}></div>
                                        <div className="relative flex items-center gap-2 bg-slate-900/90 border border-white/5 rounded-lg px-3 py-2">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getSkillColor(idx)}`}></div>
                                            <span className="text-xs font-bold text-white tracking-wide truncate">{skill}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-2 text-xs text-slate-500 italic border border-dashed border-slate-700 rounded-lg">
                                    Pending skills verification...
                                </div>
                            )}
                            {/* More counts if any */}
                            {(passport.verifiedSkills?.length || 0) > 4 && (
                                <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full border border-slate-600 shadow-lg z-20">
                                    +{(passport.verifiedSkills?.length || 0) - 4} More
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Static Holographic Line (Removed Animation) */}
                <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.3)] opacity-50 pointer-events-none"></div>
            </div>
        </div>
    );
}
