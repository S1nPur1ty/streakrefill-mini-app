import { ReactNode, useEffect } from 'react';
import { X } from 'phosphor-react';

// CSS Animation keyframes for the modal
const scaleInAnimation = `
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out forwards;
}
`;

// Body scroll control functions
const disableBodyScroll = () => {
  const body = document.body;
  const scrollY = window.scrollY;
  
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.width = '100%';
  body.style.overflow = 'hidden';
};

const enableBodyScroll = () => {
  const body = document.body;
  const scrollY = body.style.top;
  
  body.style.position = '';
  body.style.top = '';
  body.style.width = '';
  body.style.overflow = '';
  
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
  animateIn?: boolean;
  headerExtra?: ReactNode;
  footer?: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = 'max-w-2xl',
  animateIn = true,
  headerExtra,
  footer
}: ModalProps) => {
  // Inject animation styles on component mount
  useEffect(() => {
    if (animateIn) {
      const styleEl = document.createElement('style');
      styleEl.textContent = scaleInAnimation;
      document.head.appendChild(styleEl);
      
      return () => {
        document.head.removeChild(styleEl);
      };
    }
  }, [animateIn]);

  // Control body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
    
    return () => {
      // Re-enable body scroll when component unmounts
      enableBodyScroll();
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close modal on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80"
      onClick={handleBackdropClick}
    >
      <div className={`bg-gray-900 rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-hidden border border-gray-700 ${animateIn ? 'animate-scale-in' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between py-3 px-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {icon}
            {typeof title === 'string' ? (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            ) : (
              title
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerExtra}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] text-left">
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div className="py-3 px-4 border-t border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}; 