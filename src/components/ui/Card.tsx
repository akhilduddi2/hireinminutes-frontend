import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div
      className={`bg-white border border-slate-200 p-6 transition-all duration-300 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
