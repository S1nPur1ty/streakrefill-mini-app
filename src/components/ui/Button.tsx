import { ReactNode, ButtonHTMLAttributes } from 'react';
import { components, createStyleClass } from '../../lib/styleGuide';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isFullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  leftIcon,
  rightIcon,
  isFullWidth = false,
  isLoading = false,
  disabled,
  ...rest
}: ButtonProps) => {
  const buttonStyle = components.button[variant];
  const sizeStyle = components.button[size];
  
  return (
    <button
      className={createStyleClass(
        buttonStyle,
        sizeStyle,
        isFullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        'flex items-center justify-center gap-2',
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  isLoading?: boolean;
  ariaLabel: string;
}

export const IconButton = ({
  icon,
  variant = 'primary',
  size = 'medium',
  className = '',
  isLoading = false,
  disabled,
  ariaLabel,
  ...rest
}: IconButtonProps) => {
  const buttonStyle = components.button[variant];
  const sizeClass = size === 'small' 
    ? 'p-2' 
    : size === 'medium' 
      ? 'p-3' 
      : 'p-4';
  
  return (
    <button
      className={createStyleClass(
        buttonStyle,
        sizeClass,
        'rounded-full flex items-center justify-center',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      {...rest}
    >
      {isLoading ? (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        icon
      )}
    </button>
  );
};

export default Button; 