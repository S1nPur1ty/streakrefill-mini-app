import { ReactNode } from 'react';
import { stylePresets, createStyleClass } from '../../lib/styleGuide';

interface ListItemProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
  footer?: ReactNode;
}

export const ListItem = ({
  icon,
  title,
  subtitle,
  rightContent,
  onClick,
  isActive = false,
  className = '',
  footer
}: ListItemProps) => {
  const baseClasses = isActive ? stylePresets.listItemActive : stylePresets.listItem;
  
  return (
    <div 
      className={createStyleClass(
        baseClasses,
        onClick ? 'cursor-pointer hover:bg-gray-700' : '',
        footer ? 'flex flex-col' : '',
        className
      )}
      onClick={onClick}
    >
      <div className={`${footer ? 'mb-2 w-full' : ''} flex items-center justify-between`}>
        <div className={stylePresets.listItemContent}>
          {icon}
          <div>
            <div className="text-white font-semibold">{title}</div>
            {subtitle && <div className="text-gray-400 text-sm">{subtitle}</div>}
          </div>
        </div>
        {rightContent && (
          <div>{rightContent}</div>
        )}
      </div>
      
      {footer && (
        <div className="w-full">
          {footer}
        </div>
      )}
    </div>
  );
};

interface ListGroupProps {
  children: ReactNode;
  title?: string;
  titleIcon?: ReactNode;
  className?: string;
}

export const ListGroup = ({
  children,
  title,
  titleIcon,
  className = ''
}: ListGroupProps) => {
  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          {titleIcon}
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default ListItem; 