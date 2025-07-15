import { ReactNode } from 'react';
import { stylePresets, createStyleClass } from '../../lib/styleGuide';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ 
  children, 
  className = '' 
}: PageLayoutProps) => {
  return (
    <div className={createStyleClass(stylePresets.pageContainer, className)}>
      <div className={stylePresets.contentContainer}>
        {children}
      </div>
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  description?: string;
  rightElement?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  rightElement,
  className = ''
}: PageHeaderProps) => {
  return (
    <div className={createStyleClass(stylePresets.pageHeader, className)}>
      <div className="relative">
        {rightElement && (
          <div className="absolute right-0 top-0">
            {rightElement}
          </div>
        )}
        <h1 className={stylePresets.pageHeaderTitle}>{title}</h1>
        {description && (
          <p className={stylePresets.pageHeaderDescription}>{description}</p>
        )}
      </div>
    </div>
  );
};

interface SectionProps {
  children: ReactNode;
  title?: string;
  titleIcon?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const Section = ({
  children,
  title,
  titleIcon,
  className = '',
  contentClassName = ''
}: SectionProps) => {
  return (
    <div className={className}>
      {title && (
        <h2 className={stylePresets.cardTitle}>
          {titleIcon}
          {title}
        </h2>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 