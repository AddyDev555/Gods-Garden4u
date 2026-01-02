import React, { forwardRef } from 'react';
import { cn } from '../../../utils/helpers';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  className,
  inputClassName,
  leftIcon,
  rightIcon,
  fullWidth = true,
  size = 'md',
  ...props
}, ref) => {
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const inputClasses = cn(
    'w-full rounded-lg border bg-white text-neutral-900 placeholder-neutral-400',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2',
    sizes[size],
    error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    inputClassName
  );

  const wrapperClasses = cn(
    fullWidth && 'w-full',
    className
  );

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={cn(
          'mt-1.5 text-sm',
          error ? 'text-error-500' : 'text-neutral-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea variant
export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className,
  rows = 4,
  ...props
}, ref) => {
  const textareaClasses = cn(
    'w-full px-4 py-3 rounded-lg border bg-white text-neutral-900 placeholder-neutral-400',
    'transition-all duration-200 resize-none',
    'focus:outline-none focus:ring-2',
    error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        className={textareaClasses}
        {...props}
      />

      {(error || helperText) && (
        <p className={cn(
          'mt-1.5 text-sm',
          error ? 'text-error-500' : 'text-neutral-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select variant
export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  className,
  ...props
}, ref) => {
  const selectClasses = cn(
    'w-full px-4 py-3 rounded-lg border bg-white text-neutral-900',
    'transition-all duration-200 appearance-none cursor-pointer',
    'focus:outline-none focus:ring-2',
    error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed',
    'pr-10', // Space for arrow
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select ref={ref} className={selectClasses} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {(error || helperText) && (
        <p className={cn(
          'mt-1.5 text-sm',
          error ? 'text-error-500' : 'text-neutral-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Checkbox
export const Checkbox = forwardRef(({
  label,
  error,
  className,
  ...props
}, ref) => {
  return (
    <label className={cn('flex items-start gap-3 cursor-pointer', className)}>
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'w-5 h-5 rounded border-neutral-300 text-primary-500',
          'focus:ring-primary-500 focus:ring-offset-0',
          'cursor-pointer transition-colors',
          error && 'border-error-500'
        )}
        {...props}
      />
      {label && (
        <span className={cn(
          'text-sm text-neutral-700',
          error && 'text-error-500'
        )}>
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Input;
