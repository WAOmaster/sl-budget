'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('input', error && 'input-error', className)}
          {...props}
        />
        {hint && !error && <p className="input-hint">{hint}</p>}
        {error && <p className="input-error-message">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Currency Input with Rs. prefix
export interface CurrencyInputProps extends Omit<InputProps, 'type'> {
  value?: number;
  onValueChange?: (value: number) => void;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, label, value, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9.]/g, '');
      const numValue = parseFloat(rawValue) || 0;
      onValueChange?.(numValue);
    };

    return (
      <div className="w-full">
        {label && <label className="input-label">{label}</label>}
        <div className="input-amount-wrapper">
          <span className="input-amount-prefix">Rs.</span>
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            className={cn('input input-amount', className)}
            value={value?.toFixed(2) || '0.00'}
            onChange={handleChange}
            {...props}
          />
        </div>
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { Input, CurrencyInput };
