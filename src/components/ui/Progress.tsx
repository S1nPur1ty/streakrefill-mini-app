import { ReactNode } from 'react';
import { createStyleClass } from '../../lib/styleGuide';

interface ProgressProps {
  value: number;
  max: number;
  label?: string;
  showValues?: boolean;
  height?: 'xs' | 'sm' | 'md';
  variant?: 'primary' | 'gradient';
  className?: string;
  labelClassName?: string;
}

export const Progress = ({
  value,
  max,
  label,
  showValues = false,
  height = 'sm',
  variant = 'primary',
  className = '',
  labelClassName = ''
}: ProgressProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const heightClass = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3'
  }[height];
  
  const barClass = variant === 'primary' 
    ? 'bg-primary' 
    : 'bg-gradient-to-r from-yellow-400 to-orange-500';
  
  return (
    <div className={className}>
      {(label || showValues) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className={createStyleClass('text-gray-300 text-sm', labelClassName)}>
              {label}
            </span>
          )}
          {showValues && (
            <span className="text-gray-300 font-semibold text-sm">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      
      <div className={`${heightClass} bg-gray-700 rounded-full overflow-hidden`}>
        <div 
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface MilestoneProgressProps {
  currentValue: number;
  milestones: number[];
  className?: string;
  renderMilestone?: (value: number, isActive: boolean, isComplete: boolean) => ReactNode;
}

export const MilestoneProgress = ({
  currentValue,
  milestones,
  className = '',
  renderMilestone
}: MilestoneProgressProps) => {
  // Sort milestones to ensure proper order
  const sortedMilestones = [...milestones].sort((a, b) => a - b);
  const max = sortedMilestones[sortedMilestones.length - 1];
  const percentage = Math.min(100, Math.max(0, (currentValue / max) * 100));
  
  return (
    <div className={className}>
      <div className="relative h-2 bg-gray-700 rounded-full mb-2">
        <div 
          className="h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
        
        {sortedMilestones.map((milestone, index) => {
          const position = (milestone / max) * 100;
          const isComplete = currentValue >= milestone;
          const isActive = currentValue < milestone && (index === 0 || currentValue >= sortedMilestones[index - 1]);
          
          return (
            <div 
              key={milestone}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${position}%` }}
            >
              {renderMilestone ? (
                renderMilestone(milestone, isActive, isComplete)
              ) : (
                <div className={`w-4 h-4 -ml-2 rounded-full ${
                  isComplete ? 'bg-primary' : isActive ? 'bg-yellow-500' : 'bg-gray-600'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress; 