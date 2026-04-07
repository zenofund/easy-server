import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Spinner } from '../ui/Spinner';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseDetails?: {
    vehicleName: string;
    id: string;
  };
}

export function FeedbackModal({ isOpen, onClose, purchaseDetails }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, you would send this to your backend
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Feedback submitted:', {
      purchaseId: purchaseDetails?.id,
      rating,
      feedback
    });
    
    setIsSubmitting(false);
    toast.success('Thank you for your feedback!');
    onClose();
    setRating(0);
    setFeedback('');
  };

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
        className="relative bg-white rounded-[22px] border border-[#E2E8F9] z-10 w-full max-w-[742px]"
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          filter: 'drop-shadow(10px 10px 50px rgba(0, 98, 255, 0.03))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-8 gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="font-lexend font-medium text-2xl text-gray-900">
              How was your experience?
            </h2>
            <p className="font-lexend font-light text-gray-500">
              Your feedback helps us improve. Rate your purchase of the <span className="font-medium text-gray-900">{purchaseDetails?.vehicleName || 'Vehicle'}</span>.
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill={(hoveredRating || rating) >= star ? '#FFD700' : 'none'}
                  stroke={(hoveredRating || rating) >= star ? '#FFD700' : '#D1D5DB'}
                  strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
          </div>

          {/* Feedback Textarea */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-lexend">
              Additional Comments (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you liked or what we can improve..."
              className="w-full p-4 border border-gray-200 rounded-lg h-32 resize-none focus:outline-none focus:border-green-800 font-lexend font-light"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 border border-gray-200 rounded-lg font-lexend font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-green-800 text-white rounded-lg font-lexend font-medium hover:bg-green-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" variant="white" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
