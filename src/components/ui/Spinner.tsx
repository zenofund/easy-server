import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'gray';
}

export function Spinner({ 
  size = 'md', 
  variant = 'primary', 
  className, 
  ...props 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const variantClasses = {
    primary: 'border-[#005C32] border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-gray-600',
  };

  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function LoadingOverlay({ 
  message = 'Loading...',
  className 
}: { 
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center transition-all duration-300",
      className
    )}>
      <Spinner size="xl" className="mb-4" />
      {message && (
        <div className="text-[#005C32] font-medium animate-pulse" style={{ fontFamily: 'Lexend' }}>
          {message}
        </div>
      )}
    </div>
  );
}
