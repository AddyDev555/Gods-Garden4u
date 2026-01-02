import React from 'react';
import { cn } from '../../../utils/helpers';

const variants = {
  bestseller: 'bg-gradient-to-r from-accent-400 to-accent-500 text-white',
  new: 'bg-primary-500 text-white',
  limited: 'bg-error-500 text-white',
  organic: 'bg-primary-100 text-primary-700 border border-primary-200',
  premium: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white border border-amber-300',
  sale: 'bg-error-500 text-white',
  outOfStock: 'bg-neutral-400 text-white',
  inStock: 'bg-success-500 text-white',
  default: 'bg-neutral-100 text-neutral-700',
};

const sizes = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  icon,
  ...props
}) => {
  const badgeClasses = cn(
    'inline-flex items-center font-medium rounded-full',
    variants[variant],
    sizes[size],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {icon && <span className="mr-1 flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

// Pre-configured badges
export const BestSellerBadge = ({ size = 'sm', ...props }) => (
  <Badge variant="bestseller" size={size} {...props}>
    Best Seller
  </Badge>
);

export const NewBadge = ({ size = 'sm', ...props }) => (
  <Badge variant="new" size={size} {...props}>
    New
  </Badge>
);

export const LimitedBadge = ({ size = 'sm', ...props }) => (
  <Badge variant="limited" size={size} {...props}>
    Limited
  </Badge>
);

export const OrganicBadge = ({ size = 'sm', ...props }) => (
  <Badge variant="organic" size={size} {...props}>
    100% Organic
  </Badge>
);

export const PremiumBadge = ({ size = 'sm', ...props }) => (
  <Badge variant="premium" size={size} {...props}>
    Premium
  </Badge>
);

export const SaleBadge = ({ discount, size = 'sm', ...props }) => (
  <Badge variant="sale" size={size} {...props}>
    {discount ? `${discount}% OFF` : 'Sale'}
  </Badge>
);

export const StockBadge = ({ inStock = true, size = 'sm', ...props }) => (
  <Badge variant={inStock ? 'inStock' : 'outOfStock'} size={size} {...props}>
    {inStock ? 'In Stock' : 'Out of Stock'}
  </Badge>
);

export default Badge;
