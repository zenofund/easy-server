import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import { cn } from './utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  padding?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = 'max-w-[742px]',
  padding = 'p-6',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4" 
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        onClick={onClose}
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      
      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-[22px] border border-[#E2E8F9] z-10 w-full overflow-hidden shadow-2xl flex flex-col",
          maxWidth,
          className
        )}
        style={{
          maxHeight: '90vh',
          filter: 'drop-shadow(10px 10px 50px rgba(0, 98, 255, 0.03))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[#E2E8F9] shrink-0">
            <h3 className="font-lexend text-xl font-medium text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
        
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-20"
          >
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}

        <div className={cn("relative overflow-y-auto custom-scrollbar", padding)}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
