import { X, Lock, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adsApi } from '../../services/api';

interface Ad {
    _id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    image?: string;
    ctaText?: string;
    ctaUrl?: string; // Kept for backward compatibility
    linkUrl?: string;
    displayDuration?: number;
    unskippableDuration?: number;
    placement?: string;
    frequency?: number;
}

interface AdBannerProps {
    position?: 'top' | 'sidebar' | 'inline' | 'home-banner' | 'jobs-page';
    className?: string;
    onClose?: () => void;
}

export function AdBanner({ position = 'inline', className = '', onClose }: AdBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [canClose, setCanClose] = useState(true);
    const [timeToClose, setTimeToClose] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const fetchAd = async () => {
            try {
                const response = await adsApi.getActiveAds(position);
                if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                    // Pick a random ad from the active list
                    const randomAd = response.data[Math.floor(Math.random() * response.data.length)] as Ad;
                    setAd(randomAd);
                    setIsVisible(true);

                    // Track impression
                    if (randomAd._id) {
                        adsApi.trackImpression(randomAd._id).catch(err =>
                            console.error('Failed to track ad impression:', err)
                        );
                    }

                    // Handle Unskippable Duration
                    if (randomAd.unskippableDuration && randomAd.unskippableDuration > 0) {
                        setCanClose(false);
                        setTimeToClose(randomAd.unskippableDuration);
                    } else {
                        setCanClose(true);
                        setTimeToClose(0);
                    }

                    // Handle Display Duration (Auto-close)
                    if (randomAd.displayDuration && randomAd.displayDuration > 0) {
                        timer = setTimeout(() => {
                            setIsVisible(false);
                            onClose?.();
                            // If frequency is set, restart the cycle
                            if (randomAd.frequency && randomAd.frequency > 0) {
                                scheduleReappearance(randomAd.frequency);
                            }
                        }, randomAd.displayDuration * 1000);
                    }
                } else {
                    // No ads found, hide banner
                    setIsVisible(false);
                }
            } catch (error) {
                console.error("Failed to fetch ads", error);
                setIsVisible(false);
            } finally {
                setLoading(false);
            }
        };

        const scheduleReappearance = (seconds: number) => {
            // Clear any existing display timer
            if (timer) clearTimeout(timer);

            setTimeout(() => {
                setRefreshTrigger(prev => prev + 1);
            }, seconds * 1000);
        };

        fetchAd();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [position, refreshTrigger]);

    // Timer for unskippable duration
    useEffect(() => {
        if (!canClose && timeToClose > 0) {
            const timer = setInterval(() => {
                setTimeToClose((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanClose(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [canClose, timeToClose]);


    if (!isVisible || loading || !ad) return null;

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canClose) return;
        setIsVisible(false);
        onClose?.();

        // If frequency is set, show again later
        if (ad?.frequency && ad.frequency > 0) {
            setTimeout(() => {
                setRefreshTrigger(prev => prev + 1);
            }, ad.frequency * 1000);
        }
    };

    const handleAdClick = () => {
        // Track click
        if (ad._id) {
            adsApi.trackClick(ad._id).catch(err =>
                console.error('Failed to track ad click:', err)
            );
        }

        if (ad.linkUrl || ad.ctaUrl) {
            window.open(ad.linkUrl || ad.ctaUrl, '_blank');
        }
    };

    const displayedImage = ad.imageUrl || ad.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80'; // Fallback
    const displayedCta = ad.ctaText || 'Learn More';

    if (position === 'sidebar') {
        return (
            <div className={`relative w-full overflow-hidden rounded-2xl shadow-lg border border-slate-200 group ${className} animate-fade-in`}>
                <div className={`absolute top-2 right-2 z-10 transition-opacity ${canClose ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                    <button
                        onClick={handleClose}
                        disabled={!canClose}
                        className={`p-1 rounded-full backdrop-blur-sm transition-colors ${!canClose ? 'bg-black/40 text-white/50 cursor-not-allowed' : 'bg-black/20 text-white hover:bg-black/40'}`}
                    >
                        {canClose ? <X size={14} /> : <span className="text-[10px] font-bold px-1">{timeToClose}s</span>}
                    </button>
                </div>
                <div onClick={handleAdClick} className="cursor-pointer">
                    <img src={displayedImage} alt={ad.title} className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-700" />
                    <div className="p-4 bg-white relative">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Sponsored</span>
                        <h4 className="font-bold text-slate-900 mb-1 line-clamp-1">{ad.title}</h4>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{ad.description || "Check out this opportunity!"}</p>
                        <button className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-1">
                            {displayedCta} <ExternalLink size={12} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default Inline/Top Banner
    return (
        <div className={`relative w-full bg-slate-900 rounded-xl shadow-lg overflow-hidden text-white flex items-center justify-between p-4 md:p-6 mb-6 ${className} animate-fade-in`}>
            <div className="absolute inset-0">
                <img src={displayedImage} alt="Background" className="w-full h-full object-cover opacity-20 blur-sm scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
            </div>

            <div className={`absolute top-0 right-0 p-2 z-20`}>
                <button
                    onClick={handleClose}
                    disabled={!canClose}
                    className={`p-1.5 rounded-full backdrop-blur-sm transition-all flex items-center justify-center ${!canClose ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                >
                    {canClose ? <X size={16} /> : (
                        <div className="flex items-center gap-1 px-1">
                            <Lock size={10} />
                            <span className="text-[10px] font-bold">{timeToClose}</span>
                        </div>
                    )}
                </button>
            </div>

            <div className="flex items-center gap-4 md:gap-6 relative z-10 cursor-pointer flex-1" onClick={handleAdClick}>
                <div className="hidden md:block w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm shadow-inner overflow-hidden shrink-0 border border-white/10 group-hover:border-white/20 transition-colors">
                    <img src={displayedImage} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 shadow-sm">AD</span>
                        <h3 className="font-bold text-base md:text-lg leading-tight line-clamp-1">{ad.title}</h3>
                    </div>
                    {ad.description && <p className="text-sm text-slate-300 line-clamp-1 max-w-xl">{ad.description}</p>}
                </div>
            </div>

            <div className="relative z-10 ml-4 hidden sm:block">
                <button
                    onClick={handleAdClick}
                    className="px-5 py-2.5 rounded-lg bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-indigo-50 hover:scale-105 transition-all text-nowrap flex items-center gap-2"
                >
                    {displayedCta}
                    <ExternalLink size={14} className="opacity-50" />
                </button>
            </div>
        </div>
    );
}
