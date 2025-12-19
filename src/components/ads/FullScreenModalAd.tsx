import { X, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adsApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Ad {
    _id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    image?: string;
    ctaText?: string;
    ctaUrl?: string;
    linkUrl?: string;
    modalDelay?: number;
    modalCloseBehavior?: 'closeable' | 'auto-close' | 'both';
    modalAutoCloseDelay?: number;
    frequency?: number;
    unskippableDuration?: number;
}

export function FullScreenModalAd() {
    const { profile } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [canClose, setCanClose] = useState(true);
    const [timeToClose, setTimeToClose] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [unskippableTimeLeft, setUnskippableTimeLeft] = useState(0);
    const [isUnskippable, setIsUnskippable] = useState(false);

    // Don't show ads to admin or recruiter users
    const shouldShowAds = !profile || (profile.role !== 'admin' && profile.role !== 'employer');

    useEffect(() => {
        // Don't fetch ads for admin or recruiter users
        if (!shouldShowAds) {
            setLoading(false);
            return;
        }

        let displayTimer: ReturnType<typeof setTimeout>;
        let autoCloseTimer: ReturnType<typeof setTimeout>;

        const fetchAd = async () => {
            try {
                const response = await adsApi.getActiveAds('fullscreen-modal');
                if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                    // Pick a random ad from the active list
                    const randomAd = response.data[Math.floor(Math.random() * response.data.length)] as Ad;
                    setAd(randomAd);

                    // Handle Display Delay
                    const delay = (randomAd.modalDelay ?? 0) * 1000;
                    displayTimer = setTimeout(() => {
                        setIsVisible(true);

                        // Track impression
                        if (randomAd._id) {
                            adsApi.trackImpression(randomAd._id).catch(err =>
                                console.error('Failed to track ad impression:', err)
                            );
                        }

                        // Handle Unskippable Duration
                        const unskippableDuration = randomAd.unskippableDuration ?? 0;
                        if (unskippableDuration > 0) {
                            setIsUnskippable(true);
                            setUnskippableTimeLeft(unskippableDuration);
                            setCanClose(false);

                            // After unskippable period, allow closing
                            setTimeout(() => {
                                setIsUnskippable(false);
                                setCanClose(true);
                            }, unskippableDuration * 1000);
                        }

                        // Handle Close Behavior
                        const closeBehavior = randomAd.modalCloseBehavior || 'closeable';

                        if (closeBehavior === 'closeable') {
                            // canClose already set based on unskippable duration
                            if (unskippableDuration === 0) {
                                setCanClose(true);
                            }
                        } else if (closeBehavior === 'auto-close') {
                            const autoCloseDelay = randomAd.modalAutoCloseDelay ?? 10;
                            setTimeToClose(autoCloseDelay);

                            // Set timer to auto-close
                            autoCloseTimer = setTimeout(() => {
                                setIsVisible(false);
                                // If frequency is set, show again later
                                if (randomAd.frequency && randomAd.frequency > 0) {
                                    setTimeout(() => {
                                        setRefreshTrigger(prev => prev + 1);
                                    }, randomAd.frequency * 1000);
                                }
                            }, autoCloseDelay * 1000);
                        } else if (closeBehavior === 'both') {
                            const autoCloseDelay = randomAd.modalAutoCloseDelay ?? 10;
                            setTimeToClose(autoCloseDelay);

                            // Set timer to auto-close
                            autoCloseTimer = setTimeout(() => {
                                setIsVisible(false);
                                // If frequency is set, show again later
                                if (randomAd.frequency && randomAd.frequency > 0) {
                                    setTimeout(() => {
                                        setRefreshTrigger(prev => prev + 1);
                                    }, randomAd.frequency * 1000);
                                }
                            }, autoCloseDelay * 1000);
                        }
                    }, delay);
                } else {
                    setIsVisible(false);
                }
            } catch (error) {
                console.error("Failed to fetch full-screen modal ads", error);
                setIsVisible(false);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();

        return () => {
            if (displayTimer) clearTimeout(displayTimer);
            if (autoCloseTimer) clearTimeout(autoCloseTimer);
        };
    }, [refreshTrigger, shouldShowAds]);

    // Countdown timer for auto-close
    useEffect(() => {
        if (isVisible && timeToClose > 0) {
            const timer = setInterval(() => {
                setTimeToClose((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isVisible, timeToClose]);

    // Countdown timer for unskippable duration
    useEffect(() => {
        if (isVisible && isUnskippable && unskippableTimeLeft > 0) {
            const timer = setInterval(() => {
                setUnskippableTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isVisible, isUnskippable, unskippableTimeLeft]);

    const handleClose = () => {
        setIsVisible(false);

        // If frequency is set, show again later
        if (ad?.frequency && ad.frequency > 0) {
            setTimeout(() => {
                setRefreshTrigger(prev => prev + 1);
            }, ad.frequency * 1000);
        }
    };

    const handleAdClick = () => {
        // Track click
        if (ad?._id) {
            adsApi.trackClick(ad._id).catch(err =>
                console.error('Failed to track ad click:', err)
            );
        }

        if (ad?.linkUrl || ad?.ctaUrl) {
            window.open(ad.linkUrl || ad.ctaUrl, '_blank');
        }
    };

    if (!isVisible || loading || !ad) return null;

    const displayedImage = ad.imageUrl || ad.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80';
    const displayedCta = ad.ctaText || 'Learn More';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
            {/* Close Button (if closeable and not in unskippable period) */}
            {canClose && !isUnskippable && (
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 group"
                    aria-label="Close ad"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            {/* Unskippable countdown indicator */}
            {isUnskippable && unskippableTimeLeft > 0 && (
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10 px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-sm font-bold flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wait {unskippableTimeLeft}s
                </div>
            )}

            {/* Auto-close countdown indicator */}
            {!isUnskippable && timeToClose > 0 && (
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-bold">
                    {canClose ? 'Auto-closing in' : 'Closing in'} {timeToClose}s
                </div>
            )}

            {/* Modal Content */}
            <div
                className="relative max-w-4xl w-full mx-4 md:mx-8 bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transform transition-all cursor-pointer group/modal"
                onClick={handleAdClick}
            >
                {/* Sponsored Badge */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
                    Sponsored
                </div>

                {/* Image */}
                <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                    <img
                        src={displayedImage}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover/modal:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 lg:p-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-3 md:mb-4 leading-tight">
                        {ad.title}
                    </h2>
                    {ad.description && (
                        <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 leading-relaxed max-w-2xl">
                            {ad.description}
                        </p>
                    )}

                    {/* CTA Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAdClick();
                        }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        {displayedCta}
                        <ExternalLink size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
