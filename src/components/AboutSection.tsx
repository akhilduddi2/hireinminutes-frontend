import React from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './ui/Button';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Animation Components
const SPRING_TRANSITION_CONFIG = {
    type: "spring",
    stiffness: 100,
    damping: 16,
    mass: 0.75,
    restDelta: 0.005,
};

const filterVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: "blur(10px)",
    },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
    },
};

const areaClasses = [
    "col-start-2 col-end-3 row-start-1 row-end-3", // .div1
    "col-start-1 col-end-2 row-start-2 row-end-4", // .div2
    "col-start-1 col-end-2 row-start-4 row-end-6", // .div3
    "col-start-2 col-end-3 row-start-3 row-end-5", // .div4
];

const ContainerStagger = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    ({ transition, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                whileInView={"visible"}
                viewport={{ once: true }}
                transition={{
                    staggerChildren: transition?.staggerChildren ?? 0.2,
                    delayChildren: transition?.delayChildren ?? 0.2,
                    duration: 0.3,
                    ...transition as any,
                }}
                {...props}
            />
        );
    }
);
ContainerStagger.displayName = "ContainerStagger";

const ContainerAnimated = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    ({ transition, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                variants={filterVariants}
                transition={{
                    ...SPRING_TRANSITION_CONFIG,
                    duration: 0.3,
                    ...transition as any,
                }}
                {...props}
            />
        );
    }
);
ContainerAnimated.displayName = "ContainerAnimated";

const GalleryGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "grid grid-cols-2 gap-4 grid-rows-[50px_150px_50px_150px_50px]",
                    className
                )}
                {...props}
            />
        );
    }
);
GalleryGrid.displayName = "GalleryGrid";

interface GalleryGridCellProps extends HTMLMotionProps<"div"> {
    index: number;
}

const GalleryGridCell = React.forwardRef<HTMLDivElement, GalleryGridCellProps>(
    ({ className, transition, index, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.3,
                    delay: index * 0.2,
                    delayChildren: transition?.delayChildren ?? 0.2,
                }}
                className={cn(`relative overflow-hidden rounded-xl shadow-xl ${areaClasses[index]}`, className)}
                {...props}
            />
        );
    }
);
GalleryGridCell.displayName = "GalleryGridCell";

// Main Component
const IMAGES = [
    "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2338&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
];

export function AboutSection({ onNavigate }: { onNavigate: (page: string) => void }) {
    return (
        <section className="min-h-screen flex flex-col justify-center py-12 md:py-24 bg-white overflow-hidden">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:gap-16 px-4 md:grid-cols-2 lg:px-8">
                <ContainerStagger className="order-2 md:order-1">
                    <ContainerAnimated className="mb-4 block text-sm font-bold text-blue-600 uppercase tracking-wider">
                        Who We Are
                    </ContainerAnimated>
                    <ContainerAnimated className="text-3xl font-bold text-slate-900 md:text-5xl mb-4 md:mb-6 leading-tight">
                        Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Future of Hiring</span>
                    </ContainerAnimated>
                    <ContainerAnimated className="my-4 text-base md:text-lg text-slate-600 md:my-6 leading-relaxed">
                        We are building a next-generation hiring ecosystem focused on skills, transparency, and real opportunities.
                        The platform brings together students, recruiters, founders, and colleges into one integrated space.
                    </ContainerAnimated>
                    <ContainerAnimated className="mb-8 text-base md:text-lg text-slate-600 leading-relaxed">
                        Traditional job portals focus on resumes. We focus on proving skills through verifyable assessments,
                        AI-powered mock interviews, and a digital Skill Passport that stands out.
                    </ContainerAnimated>
                    <ContainerAnimated className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => onNavigate('register')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 md:py-6 rounded-full text-base md:text-lg shadow-lg hover:shadow-blue-500/25 justify-center">
                            Join Now
                        </Button>
                        <Button onClick={() => onNavigate('about')} variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 md:py-6 rounded-full text-base md:text-lg justify-center">
                            Learn More
                        </Button>
                    </ContainerAnimated>
                </ContainerStagger>

                <GalleryGrid className="order-1 md:order-2 h-[450px] md:h-[600px]">
                    {IMAGES.map((imageUrl, index) => (
                        <GalleryGridCell index={index} key={index}>
                            <img
                                className="size-full object-cover object-center transition-transform duration-500 hover:scale-110"
                                width="100%"
                                height="100%"
                                src={imageUrl}
                                alt="About Us Gallery"
                            />
                        </GalleryGridCell>
                    ))}
                </GalleryGrid>
            </div>
        </section>
    );
}
