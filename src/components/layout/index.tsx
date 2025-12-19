// Layout Components

import React from 'react';
import { Header } from '../Header';

interface PageLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
  showHeader?: boolean;
  className?: string;
}

// Main page layout with header
export function PageLayout({
  children,
  onNavigate,
  currentPage,
  showHeader = true,
  className = '',
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {showHeader && <Header onNavigate={onNavigate} currentPage={currentPage} />}
      <main className={`pt-16 ${className}`}>{children}</main>
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

// Dashboard layout with optional sidebar
export function DashboardLayout({
  children,
  sidebar,
  header,
  className = '',
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebar && (
        <aside className="w-64 bg-white border-r border-slate-200 fixed h-full">
          {sidebar}
        </aside>
      )}
      <div className={`flex-1 ${sidebar ? 'ml-64' : ''}`}>
        {header && (
          <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            {header}
          </header>
        )}
        <main className={`p-6 ${className}`}>{children}</main>
      </div>
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

// Reusable section component
export function Section({
  children,
  title,
  description,
  action,
  className = '',
}: SectionProps) {
  return (
    <section className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}>
      {(title || description || action) && (
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

// Container component for consistent max-widths
export function Container({ children, size = 'lg', className = '' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Responsive grid component
export function Grid({ children, cols = 3, gap = 'md', className = '' }: GridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
  className?: string;
}

// Flexible flex container
export function Flex({
  children,
  direction = 'row',
  align = 'center',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className = '',
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={`flex ${directionClasses[direction]} ${alignClasses[align]} ${justifyClasses[justify]} ${gapClasses[gap]} ${wrap ? 'flex-wrap' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Vertical spacer component
export function Spacer({ size = 'md' }: SpacerProps) {
  const sizeClasses = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12',
  };

  return <div className={sizeClasses[size]} />;
}

interface DividerProps {
  className?: string;
}

// Horizontal divider
export function Divider({ className = '' }: DividerProps) {
  return <hr className={`border-t border-slate-200 my-6 ${className}`} />;
}

// Loading skeleton component
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded ${className}`}
    />
  );
}

// Empty state component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto w-12 h-12 text-slate-400 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      {description && <p className="text-slate-500 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-slate-200 border-t-blue-600`}
      />
    </div>
  );
}

// Full page loading state
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default {
  PageLayout,
  DashboardLayout,
  Section,
  Container,
  Grid,
  Flex,
  Spacer,
  Divider,
  Skeleton,
  EmptyState,
  LoadingSpinner,
  PageLoading,
};
