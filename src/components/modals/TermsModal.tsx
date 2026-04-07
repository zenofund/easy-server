import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        onClick={onClose}
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-[22px] border border-[#E2E8F9] z-10 w-full max-w-[742px] flex flex-col"
        style={{
          height: '80vh',
          filter: 'drop-shadow(10px 10px 50px rgba(0, 98, 255, 0.03))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-lexend font-semibold text-xl text-gray-900">Terms & Conditions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 font-lexend text-gray-600 text-sm leading-relaxed space-y-4">
          <p><strong>1. Introduction</strong><br/>Welcome to Huce Autos. By using our platform, you agree to these terms.</p>
          
          <p><strong>2. User Accounts</strong><br/>You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use our services.</p>
          
          <p><strong>3. Buying and Selling</strong><br/>Huce Autos facilitates connections between buyers and sellers. We do not own the vehicles listed unless explicitly stated. All transactions are final once completed.</p>
          
          <p><strong>4. Inspections</strong><br/>Inspection reports provided are based on visual assessments at the time of inspection. They do not guarantee the future performance of the vehicle.</p>
          
          <p><strong>5. Payments</strong><br/>Payments processed through our platform are secured. Huce Autos charges a service fee for transactions.</p>
          
          <p><strong>6. Content</strong><br/>Users retain rights to content they upload but grant Huce Autos a license to use, display, and distribute such content.</p>
          
          <p><strong>7. Termination</strong><br/>We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
          
          <p><strong>8. Limitation of Liability</strong><br/>Huce Autos is not liable for indirect, incidental, or consequential damages arising from the use of our service.</p>
          
          <p><strong>9. Changes to Terms</strong><br/>We may modify these terms at any time. Continued use of the platform constitutes acceptance of the new terms.</p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 rounded-lg font-lexend text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-green-800 text-white rounded-lg font-lexend font-medium hover:bg-green-700 transition-colors"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
