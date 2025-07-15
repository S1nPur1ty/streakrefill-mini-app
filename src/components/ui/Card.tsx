import { ReactNode } from 'react';
import { components, createStyleClass } from '../../lib/styleGuide';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'highlight' | 'interactive' | 'small';
  className?: string;
  onClick?: () => void;
}

export const Card = ({
  children,
  variant = 'default',
  className = '',
  onClick
}: CardProps) => {
  const cardStyle = components.card[variant];
  
  return (
    <div 
      className={createStyleClass(cardStyle, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const CardTitle = ({
  children,
  icon,
  className = ''
}: CardTitleProps) => {
  return (
    <h2 className={createStyleClass('text-xl font-semibold text-white mb-4 flex items-center gap-2', className)}>
      {icon}
      {children}
    </h2>
  );
};

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  sublabel?: string;
  iconColor?: string;
  valueColor?: string;
}

export const StatCard = ({
  icon,
  value,
  label,
  sublabel,
  iconColor = 'text-primary',
  valueColor = 'text-primary'
}: StatCardProps) => {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className={`w-12 h-12 ${iconColor}/20 rounded-full flex items-center justify-center mb-2`}>
          {icon}
        </div>
        <div className={`text-3xl font-bold ${valueColor} mb-1`}>{value}</div>
        <div className="text-gray-300 font-medium">{label}</div>
        {sublabel && <div className="text-xs text-gray-500 mt-1">{sublabel}</div>}
      </div>
    </Card>
  );
};

export default Card; 