import React from 'react';
import * as PhosphorIcons from 'phosphor-react';

type IconProps = {
  // Icon name from phosphor-react
  name: keyof typeof PhosphorIcons;
  // Size in pixels (default: 24) or as string (e.g., 'small', 'medium', 'large')
  size?: number | string;
  // Color (default: currentColor)
  color?: string;
  // Weight (default: regular)
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  // Additional CSS classes
  className?: string;
};

/**
 * Map string sizes to pixel values
 */
const sizeMap: Record<string, number> = {
  small: 16,
  medium: 24,
  large: 32,
  xlarge: 48
};

/**
 * Icon component wrapper around phosphor-react icons
 * Fixes SVG sizing issues and provides consistent API
 */
export const Icon = ({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  weight = 'regular', 
  className = '' 
}: IconProps) => {
  // Get the icon component from phosphor-react
  const IconComponent = PhosphorIcons[name] as React.ComponentType<{
    size?: number | string;
    color?: string;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    className?: string;
  }>;

  // If the icon doesn't exist, render a fallback
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in phosphor-react`);
    return <span className={`inline-block ${className}`}>□</span>;
  }

  // Convert string sizes to pixel values
  let pixelSize = size;
  if (typeof size === 'string') {
    pixelSize = sizeMap[size.toLowerCase()] || 24;
  }

  // Render the icon with proper props
  return (
    <IconComponent
      size={pixelSize}
      color={color}
      weight={weight}
      className={className}
    />
  );
}; 