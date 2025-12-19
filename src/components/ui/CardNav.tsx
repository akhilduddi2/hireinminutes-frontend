import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  items: CardNavItem[];
  onNavigate: (page: string) => void;
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  logoColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  items,
  onNavigate,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  logoColor = '#0f172a'
}) => {
  const { user, profile, signOut } = useAuth();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lastScrollY = useRef(0);

  // Scroll Hide Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling Down -> Hide
        if (!isExpanded) setIsVisible(false); // Only hide if menu NOT expanded
      } else {
        // Scrolling Up -> Show
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded]);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('landing');
    } catch (error) {
      console.error('Logout error:', error);
      onNavigate('landing');
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    // Extract page name from href (e.g., "/jobs" -> "jobs")
    const page = href.startsWith('/') ? href.slice(1) : href;
    onNavigate(page || 'landing');

    // Close mobile menu if open
    if (isHamburgerOpen) {
      toggleMenu();
    }
  };

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
    if (contentEl) {
      // Temporarily make it visible/auto to measure
      const wasVisible = contentEl.style.visibility;
      const wasPointerEvents = contentEl.style.pointerEvents;
      const wasPosition = contentEl.style.position;
      const wasHeight = contentEl.style.height;

      contentEl.style.visibility = 'visible';
      contentEl.style.pointerEvents = 'auto';
      contentEl.style.position = 'static'; // Important to measure flow height
      contentEl.style.height = 'auto';

      // Force reflow
      // console.log(contentEl.offsetHeight);

      const topBar = 60;
      const padding = 16;
      const contentHeight = contentEl.scrollHeight;

      // Restore props
      contentEl.style.visibility = wasVisible;
      contentEl.style.pointerEvents = wasPointerEvents;
      contentEl.style.position = wasPosition;
      contentEl.style.height = wasHeight;

      // On Desktop, if it's row-based, we want the max height of the row + top bar
      // But contentEl.scrollHeight with position:static should give us the height of the flex container properly wrapped or not.
      // If it is a single row, scrollHeight ~ height of tallest card.
      return topBar + contentHeight + (window.innerWidth < 768 ? padding : 0); // Padding logic might differ
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[95%] max-w-[1000px] z-[99] top-4 md:top-6 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'} ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden will-change-[height] backdrop-blur-md`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-4 pr-2 z-[2]">

          {/* Hamburger (Mobile: Left, Desktop: Left/Start) */}
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-1 md:order-none w-10`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div
              className={`hamburger-line w-[24px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
                } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[24px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
                } group-hover:opacity-75`}
            />
          </div>

          {/* Logo (Mobile: Center/Left sibling, Desktop: Absolute Center) */}
          <div
            className="logo-container flex items-center justify-center md:justify-start gap-2 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-2 md:order-none cursor-pointer flex-1 md:flex-none"
            onClick={() => onNavigate('landing')}
            style={{ color: logoColor }}
          >
            <Briefcase className="h-6 w-6" strokeWidth={2.5} style={{ color: logoColor }} />
            <span className="text-lg font-bold tracking-tight" style={{ color: logoColor }}>hireinminutes</span>
          </div>

          {/* CTA / User Menu (Mobile: Right, Desktop: Right) */}
          <div className="order-3 md:order-none flex items-center w-10 justify-end md:w-auto">
            {!user ? (
              <button
                type="button"
                onClick={() => onNavigate('role-select')}
                className="card-nav-cta-button hidden md:inline-flex border-0 rounded-xl px-5 items-center h-[44px] font-semibold text-sm cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ backgroundColor: buttonBgColor || '#111', color: buttonTextColor || '#fff' }}
              >
                Get Started
              </button>
            ) : (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-sm font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
                  style={{ color: logoColor }}
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold border border-blue-200">
                    {profile?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline">{profile?.fullName?.split(' ')[0] || 'User'}</span>
                </button>
                {/* User Menu Dropdown omitted for brevity in search replacement, ensuring only wrapper changes */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold truncate text-slate-900">{profile?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate(profile?.role === 'employer' ? 'recruiter-dashboard' : 'job-seeker-dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      Settings
                    </button>
                    <div className="h-px bg-slate-50 my-1"></div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
            } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[20px] rounded-xl min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%] transition-transform hover:scale-[0.99]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-medium tracking-tight text-[18px] md:text-[20px] opacity-90">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-3">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-2 no-underline cursor-pointer transition-all duration-300 hover:opacity-100 opacity-70 group"
                    href={lnk.href}
                    onClick={(e) => handleLinkClick(e, lnk.href)}
                    aria-label={lnk.ariaLabel}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <span className="text-[15px] font-medium">{lnk.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
