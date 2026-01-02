import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/helpers';

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-soft hover:shadow-medium focus-visible:ring-primary-500',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 focus-visible:ring-secondary-500',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 focus-visible:ring-accent-500',
  outline: 'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
  white: 'bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 shadow-soft hover:shadow-medium focus-visible:ring-neutral-400',
  danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-600 focus-visible:ring-error-500',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-md',
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-2.5 text-base rounded-lg',
  lg: 'px-8 py-3 text-lg rounded-xl',
  xl: 'px-10 py-4 text-xl rounded-xl',
};

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  as = 'button',
  animate = true,
  ...props
}, ref) => {
  const Component = animate ? motion.button : as;

  const buttonClasses = cn(
    // Base styles
    'inline-flex items-center justify-center font-medium',
    'transition-all duration-300 ease-premium',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    // Variant
    variants[variant],
    // Size
    sizes[size],
    // Full width
    fullWidth && 'w-full',
    // Custom classes
    className
  );

  const motionProps = animate ? {
    whileHover: disabled || loading ? {} : { scale: 1.02 },
    whileTap: disabled || loading ? {} : { scale: 0.98 },
    transition: { duration: 0.2 },
  } : {};

  const content = (
    <>
      {loading && (
        <svg
          className={cn(
            'animate-spin h-4 w-4',
            children && 'mr-2'
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className={cn('flex-shrink-0', children && 'mr-2')}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={cn('flex-shrink-0', children && 'ml-2')}>{icon}</span>
      )}
    </>
  );

  return (
    <Component
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...motionProps}
      {...props}
    >
      {content}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
