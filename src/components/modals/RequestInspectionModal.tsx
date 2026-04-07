import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import api from '../../lib/api';
import { Spinner } from '../ui/Spinner';

interface RequestInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId?: string;
}

export function RequestInspectionModal({ isOpen, onClose, carId }: RequestInspectionModalProps) {
  const [selectedInspection, setSelectedInspection] = useState<'basic' | 'comprehensive'>('comprehensive');
  const [pickDate, setPickDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!carId) {
      toast.error('Car information is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/inspections', {
        carId,
        preferredDate: pickDate,
        notes: `Type: ${selectedInspection}, Time: ${timeFrom} - ${timeTo}`
      });
      toast.success('Inspection request submitted successfully!');
      onClose();
      // Only refresh if we're on the dashboard or detail page
      if (window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/car/')) {
        window.location.reload();
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to submit inspection request';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Container */}
        <div className="flex flex-col items-center p-6 sm:p-8 md:p-10" style={{ gap: '32px' }}>
          {/* Sub Container */}
          <div className="flex flex-col items-start w-full" style={{ gap: '24px' }}>
            {/* Back Button */}
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-all active:scale-[0.98]"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '27px',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  transform: 'rotate(90deg)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5.33333 10.6667L8 8L10.6667 5.33333"
                    stroke="#999999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="rotate(90 8 8)"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: '18px',
                  lineHeight: '150%',
                  letterSpacing: '-0.02em',
                  color: '#999999',
                }}
              >
                Back
              </span>
            </button>

            {/* Title & Description */}
            <div className="flex flex-col items-start w-full" style={{ gap: '7px' }}>
              <h2
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: '30px',
                  color: '#060606',
                  width: '100%',
                }}
              >
                Car Inspection
              </h2>
              <p
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 300,
                  fontSize: '15px',
                  lineHeight: '19px',
                  color: '#999999',
                  width: '100%',
                }}
              >
                Inspect your car without hassle just sit and let professional inspect your dream car
              </p>
            </div>

            {/* Form Container */}
            <div className="flex flex-col items-start w-full" style={{ gap: '19px' }}>
              {/* Inspection Options Container */}
              <div className="flex flex-col items-start w-full" style={{ gap: '8px' }}>
                {/* Basic Inspection Option */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-0" style={{ minHeight: '74px' }}>
                  <div className="flex flex-row items-start gap-[13px] flex-1">
                    <button
                      type="button"
                      onClick={() => setSelectedInspection('basic')}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: selectedInspection === 'basic' ? '#005C32' : 'transparent',
                        border: selectedInspection === 'basic' ? 'none' : '1.15px solid #005C32',
                        padding: selectedInspection === 'basic' ? '3px' : '0',
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '3px',
                      }}
                    >
                      {selectedInspection === 'basic' && (
                        <div
                          style={{
                            width: '11px',
                            height: '11px',
                            border: '0.71px solid #FFFFFF',
                            borderRadius: '50%',
                          }}
                        />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '13px',
                          lineHeight: '18px',
                          color: '#060606',
                          margin: 0,
                        }}
                      >
                        <strong style={{ fontSize: '13px' }}>Basic Inspection:</strong> Covers essential checks like tires, brakes, and engine.
                        <br />
                        <span
                          style={{
                            fontFamily: 'Lexend',
                            fontWeight: 300,
                            fontSize: '11px',
                            lineHeight: '16px',
                            color: '#999999',
                          }}
                        >
                          Price is relative to the location of the car
                        </span>
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '4.52px 9.05px 4.52px 6.03px',
                      height: '28.05px',
                      background: 'rgba(0, 92, 50, 0.1)',
                      borderRadius: '7.54px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '13px',
                        lineHeight: '145%',
                        letterSpacing: '-0.005em',
                        color: '#005C32',
                      }}
                    >
                      N 5,000
                    </span>
                  </div>
                </div>

                {/* Comprehensive Inspection Option */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-0" style={{ minHeight: '74px', marginTop: '20px' }}>
                  <div className="flex flex-row items-start gap-[13px] flex-1">
                    <button
                      type="button"
                      onClick={() => setSelectedInspection('comprehensive')}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: selectedInspection === 'comprehensive' ? '#005C32' : 'transparent',
                        border: selectedInspection === 'comprehensive' ? 'none' : '1.15px solid #005C32',
                        padding: selectedInspection === 'comprehensive' ? '3px' : '0',
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '3px',
                      }}
                    >
                      {selectedInspection === 'comprehensive' && (
                        <div
                          style={{
                            width: '11px',
                            height: '11px',
                            border: '0.71px solid #FFFFFF',
                            borderRadius: '50%',
                          }}
                        />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '13px',
                          lineHeight: '18px',
                          color: '#060606',
                          margin: 0,
                        }}
                      >
                        <strong style={{ fontSize: '13px' }}>Comprehensive Inspection:</strong> Includes detailed checks for engine, suspension, transmission, and more.
                        <br />
                        <span
                          style={{
                            fontFamily: 'Lexend',
                            fontWeight: 300,
                            fontSize: '11px',
                            lineHeight: '16px',
                            color: '#999999',
                          }}
                        >
                          Price is relative to the location of the car
                        </span>
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '4.52px 9.05px 4.52px 6.03px',
                      height: '28.05px',
                      background: 'rgba(0, 92, 50, 0.1)',
                      borderRadius: '7.54px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '13px',
                        lineHeight: '145%',
                        letterSpacing: '-0.005em',
                        color: '#005C32',
                      }}
                    >
                      N 5,000
                    </span>
                  </div>
                </div>
              </div>

              {/* Pick Date Field */}
              <div className="flex flex-col items-start w-full" style={{ gap: '8px' }}>
                <label
                  htmlFor="pick-date"
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 400,
                    fontSize: '12.58px',
                    lineHeight: '24px',
                    color: '#060606',
                    width: '100%',
                  }}
                >
                  Pick Date
                </label>
                <input
                  id="pick-date"
                  type="date"
                  value={pickDate}
                  onChange={(e) => setPickDate(e.target.value)}
                  className="w-full outline-none focus:border-[#005C32] transition-colors"
                  style={{
                    height: '60px',
                    padding: '20px',
                    border: '1px solid #E2E8F9',
                    borderRadius: '6px',
                    fontFamily: 'Lexend',
                    fontWeight: 200,
                    fontSize: '12.68px',
                    lineHeight: '20px',
                    color: '#999999',
                  }}
                />
              </div>

              {/* Time Fields Row */}
              <div className="flex flex-col sm:flex-row items-start w-full gap-[19px]">
                {/* Time From */}
                <div className="flex flex-col items-start w-full sm:flex-1" style={{ gap: '8px' }}>
                  <label
                    htmlFor="time-from"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '12.58px',
                      lineHeight: '24px',
                      color: '#060606',
                      width: '100%',
                    }}
                  >
                    Time (From)
                  </label>
                  <input
                    id="time-from"
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="w-full outline-none focus:border-[#005C32] transition-colors"
                    style={{
                      height: '60px',
                      padding: '20px',
                      border: '1px solid #E2E8F9',
                      borderRadius: '6px',
                      fontFamily: 'Lexend',
                      fontWeight: 200,
                      fontSize: '12.68px',
                      lineHeight: '20px',
                      color: '#999999',
                    }}
                  />
                </div>

                {/* Time To */}
                <div className="flex flex-col items-start w-full sm:flex-1" style={{ gap: '8px' }}>
                  <label
                    htmlFor="time-to"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '12.58px',
                      lineHeight: '24px',
                      color: '#060606',
                      width: '100%',
                    }}
                  >
                    Time (To)
                  </label>
                  <input
                    id="time-to"
                    type="time"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    className="w-full outline-none focus:border-[#005C32] transition-colors"
                    style={{
                      height: '60px',
                      padding: '20px',
                      border: '1px solid #E2E8F9',
                      borderRadius: '6px',
                      fontFamily: 'Lexend',
                      fontWeight: 200,
                      fontSize: '12.68px',
                      lineHeight: '20px',
                      color: '#999999',
                    }}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex flex-row items-start gap-[8px] w-full">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="cursor-pointer"
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid #E2E8F9',
                    borderRadius: '3px',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer"
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 300,
                    fontSize: '10px',
                    lineHeight: '24px',
                    color: '#060606',
                    flex: 1,
                  }}
                >
                  By proceeding with the inspection, you acknowledge that the inspection report is a visual assessment of the vehicle's condition at the time of inspection. Huce Autos is not liable for any issues discovered after the transaction. Inspection fees are non-refundable.
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center hover:opacity-90 transition-all active:scale-[0.98] mt-auto w-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              height: '52px',
              background: '#005C32',
              borderRadius: '10px',
              border: 'none',
              gap: '12px'
            }}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" variant="white" />
                <span
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 500,
                    fontSize: '15px',
                    lineHeight: '28px',
                    color: '#FFFFFF',
                  }}
                >
                  Submitting Request...
                </span>
              </>
            ) : (
              <span
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 500,
                  fontSize: '15px',
                  lineHeight: '28px',
                  color: '#FFFFFF',
                }}
              >
                Proceed
              </span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}