'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant = 'default', showLabel, size = 'md', ...props }, ref) => {
    const percentage = Math.min(Math.round((value / max) * 100), 100);

    const variants = {
      default: 'progress-fill-default',
      success: 'progress-fill-success',
      warning: 'progress-fill-warning',
      danger: 'progress-fill-danger',
    };

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    // Auto-determine variant based on percentage if not specified
    const autoVariant = (): typeof variant => {
      if (percentage >= 90) return 'danger';
      if (percentage >= 70) return 'warning';
      return variant;
    };

    const finalVariant = variant === 'default' ? autoVariant() : variant;

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className={cn('progress-bar', sizes[size])}>
          <div
            className={cn('progress-fill', variants[finalVariant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between mt-1 text-xs text-stone-500">
            <span>{value.toLocaleString()}</span>
            <span>{percentage}%</span>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
