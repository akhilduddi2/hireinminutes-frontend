import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  blurIntensity?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className,
  borderRadius = '16px',
  blurIntensity = 'md',
  draggable = false,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const blurValues = {
    sm: 'blur(10px)',
    md: 'blur(20px)',
    lg: 'blur(30px)',
  };

  useEffect(() => {
    if (!draggable) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggable]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      dragStart.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden border border-black/20',
        draggable && 'cursor-move',
        className
      )}
      style={{
        borderRadius,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: `${blurValues[blurIntensity]} saturate(180%)`,
        WebkitBackdropFilter: `${blurValues[blurIntensity]} saturate(180%)`,
        boxShadow: `
          0 8px 32px 0 rgba(0, 0, 0, 0.6),
          inset 0 0 0 1px rgba(255, 255, 255, 0.15),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
          inset 0 -1px 0 0 rgba(0, 0, 0, 0.25)
        `,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transform: draggable ? `translate(${position.x}px, ${position.y}px)` : undefined,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Glass reflection - top light */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit]"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Glass refraction effect */}
      <div
        className="absolute inset-0 rounded-[inherit] opacity-50"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.08) 0%, transparent 50%), ' +
            'radial-gradient(circle at 80% 70%, rgba(0, 0, 0, 0.05) 0%, transparent 50%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Animated shimmer - glass shine */}
      <div
        className="absolute inset-0 rounded-[inherit] opacity-30"
        style={{
          background:
            'linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 4s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10">{children}</div>

      <style>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  );
};
