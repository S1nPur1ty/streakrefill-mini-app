import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem'
}) => {
  const baseClasses = 'animate-pulse bg-gray-700/50 rounded';
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Spinner page skeleton
export const SpinnerSkeleton: React.FC = () => (
  <div className="flex-1 p-4">
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header skeleton */}
      <div className="text-center space-y-2">
        <SkeletonLoader height="2rem" width="200px" className="mx-auto" />
        <SkeletonLoader height="1rem" width="300px" className="mx-auto" />
      </div>

      {/* Tickets counter skeleton */}
      <div className="flex justify-center">
        <SkeletonLoader height="2rem" width="120px" className="rounded-full" />
      </div>

      {/* Wheel skeleton */}
      <div className="flex justify-center">
        <SkeletonLoader 
          variant="circular" 
          width="300px" 
          height="300px" 
          className="mx-auto"
        />
      </div>
    </div>
  </div>
);

export default React.memo(SkeletonLoader);