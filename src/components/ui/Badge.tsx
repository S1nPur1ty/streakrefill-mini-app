import { ReactNode } from 'react';
import { createStyleClass } from '../../lib/styleGuide';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon
}: BadgeProps) => {
  const variantClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-gray-700 text-gray-300',
    success: 'bg-green-500/10 text-green-500',
    warning: 'bg-yellow-500/10 text-yellow-500',
    error: 'bg-red-500/10 text-red-500',
    info: 'bg-blue-500/10 text-blue-500'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1'
  };
  
  return (
    <span className={createStyleClass(
      'inline-flex items-center font-medium rounded-full',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {leftIcon && <span className="mr-1 -ml-0.5">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1 -mr-0.5">{rightIcon}</span>}
    </span>
  );
};

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'failed' | 'locked';
  size?: BadgeSize;
  className?: string;
}

export const StatusBadge = ({
  status,
  size = 'md',
  className = ''
}: StatusBadgeProps) => {
  const statusConfig = {
    active: { variant: 'primary' as BadgeVariant, label: 'Active' },
    pending: { variant: 'warning' as BadgeVariant, label: 'Pending' },
    completed: { variant: 'success' as BadgeVariant, label: 'Completed' },
    failed: { variant: 'error' as BadgeVariant, label: 'Failed' },
    locked: { variant: 'secondary' as BadgeVariant, label: 'Locked' }
  };
  
  const { variant, label } = statusConfig[status];
  
  return (
    <Badge
      variant={variant}
      size={size}
      className={className}
    >
      {label}
    </Badge>
  );
};

export default Badge; 