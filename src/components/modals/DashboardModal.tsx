import React from 'react';
import { Modal } from "../ui/Modal";
import { cn } from "../ui/utils";

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  width?: string;
}

export function DashboardModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = "max-w-[742px]",
  width,
}: DashboardModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      className={className}
      maxWidth={maxWidth}
      padding="p-4"
    >
      <div style={width ? { width, maxWidth: '100%' } : undefined}>
        {children}
      </div>
    </Modal>
  );
}
