import React from 'react';
import { cn } from '../../../utils/helpers';

// Base Skeleton component
const Skeleton = ({ className, variant = 'rectangular', width, height, ...props }) => {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded',
  };

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200',
        'bg-[length:200%_100%] animate-shimmer',
        variants[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = ({ className }) => (
  <div className={cn('bg-white rounded-2xl overflow-hidden shadow-soft', className)}>
    {/* Image */}
    <Skeleton className="aspect-product w-full" />

    {/* Content */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <Skeleton className="h-5 w-3/4" />

      {/* Price */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-14" />
      </div>

      {/* Rating */}
      <Skeleton className="h-4 w-24" />

      {/* Button */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8, columns = 4 }) => (
  <div className={cn(
    'grid gap-6',
    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  )}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// Product Detail Skeleton
export const ProductDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
    {/* Image Gallery */}
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-20 rounded-lg" />
        ))}
      </div>
    </div>

    {/* Details */}
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-48" />

      {/* Title */}
      <Skeleton className="h-8 w-3/4" />

      {/* Rating */}
      <Skeleton className="h-5 w-32" />

      {/* Price */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>

      {/* Size options */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-16" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-16 h-10 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-32 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  </div>
);

// Cart Item Skeleton
export const CartItemSkeleton = () => (
  <div className="flex gap-4 p-4 bg-white rounded-xl">
    <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
);

// Blog Card Skeleton
export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
    <Skeleton className="aspect-video w-full" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

// Category Card Skeleton
export const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

// Text Line Skeleton
export const TextSkeleton = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

// Avatar Skeleton
export const AvatarSkeleton = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return <Skeleton variant="circular" className={sizes[size]} />;
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4" />
      </td>
    ))}
  </tr>
);

export default Skeleton;
