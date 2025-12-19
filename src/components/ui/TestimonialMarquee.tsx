

interface Testimonial {
    name: string;
    role: string;
    company: string;
    story: string;
    avatar: string;
    badges: string[];
}

interface TestimonialMarqueeProps {
    title?: string;
    description?: string;
    items: Testimonial[];
    speed?: 'normal' | 'slow' | 'fast';
}

export function TestimonialMarquee({
    title,
    description,
    items,
    speed = 'normal'
}: TestimonialMarqueeProps) {

    const getDuration = () => {
        switch (speed) {
            case 'fast': return '10s';
            case 'slow': return '25s';
            default: return '18s';
        }
    };

    // We duplicate the items to create the seamless loop effect
    // Minimum 2 sets, but if items are few, maybe more? 
    // For simplicity, we'll just do 2 sets which is standard for 50% translation.
    const marqueeItems = [...items, ...items];

    return (
        <div className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
                <div className="text-center">
                    {title && (
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="relative w-full">
                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {/* Marquee Container */}
                <div
                    className="flex gap-6 animate-scroll hover:[animation-play-state:paused]"
                    style={{ animationDuration: getDuration() }}
                >
                    {marqueeItems.map((story, index) => (
                        <div
                            key={`${story.name}-${index}`}
                            className="flex-shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 p-6 rounded-xl hover:border-slate-300 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                    {story.avatar}
                                </div>
                                <div className="leading-tight">
                                    <h3 className="font-semibold text-slate-900">{story.name}</h3>
                                    <p className="text-sm text-slate-500">@{story.company.toLowerCase().replace(/\s/g, '')}</p>
                                </div>
                            </div>
                            <p className="text-slate-700 text-[15px] leading-normal selection:bg-blue-100">
                                "{story.story}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
