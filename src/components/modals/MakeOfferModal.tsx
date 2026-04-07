import { X, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import api from '../../lib/api';
import { Spinner } from '../ui/Spinner';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId?: string;
  carName?: string;
  currentPrice?: string;
  initialValue?: string;
  mode?: 'offer' | 'payment' | 'confirm' | 'feedback' | 'receipt';
  walletBalance?: string;
  receiptData?: {
    invoiceNo: string;
    seller: { name: string; phone: string; email: string };
    middleman: { name: string; phone: string; email: string };
    buyer: { name: string; phone: string; email: string };
    car: {
      name: string;
      image: string;
      vin: string;
      mileage: string;
      condition: string;
      purchaseDate: string;
    };
    summation: {
      subTotal: string;
      discount: string;
      total: string;
    };
  };
  onProceed?: (paymentMethod?: 'wallet' | 'online') => void;
  onSubmitFeedback?: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
}

export function MakeOfferModal({ 
  isOpen, 
  onClose, 
  carId,
  carName = 'Toyota Camry 2024', 
  currentPrice = 'N49,000.00', 
  initialValue,
  mode = 'offer',
  walletBalance = 'N34,000.00',
  receiptData,
  onProceed,
  onSubmitFeedback,
  isSubmitting: externalIsSubmitting
}: MakeOfferModalProps) {
  const [offerPrice, setOfferPrice] = useState(initialValue || currentPrice);
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'online'>('wallet');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setOfferPrice(initialValue || currentPrice);
    }
  }, [isOpen, initialValue, currentPrice]);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${receiptData?.invoiceNo || 'download'}.pdf`);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  useEffect(() => {
    if (mode === 'payment') {
      setOfferPrice(currentPrice);
    }
  }, [mode, currentPrice]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'offer') {
      if (!carId) {
        toast.error('Car information is missing');
        return;
      }

      setInternalIsSubmitting(true);
      try {
        await api.post('/offers', {
          carId,
          amount: offerPrice
        });
        toast.success('Offer submitted successfully!');
        onClose();
        // Optional: refresh page or state
        window.location.reload();
      } catch (error: any) {
        const message = error.response?.data?.error || 'Failed to submit offer';
        toast.error(message);
      } finally {
        setInternalIsSubmitting(false);
      }
    } else {
      // Handle other modes if necessary
      onClose();
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
        <div
          className="flex flex-col items-center p-6 sm:p-8 md:p-10"
          style={{
            gap: '32px',
          }}
        >
          {/* Sub Container */}
          <div
            className="flex flex-col items-start w-full"
            style={{
              gap: '24px',
            }}
          >
            {/* Back Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-[7px] hover:opacity-70 transition-all active:scale-[0.98]"
              style={{
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
            <div
              className="flex flex-col items-start w-full"
              style={{
                gap: '7px',
              }}
            >
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
                {mode === 'receipt' ? 'Car Purchase Receipt' : mode === 'offer' ? 'Make an Offer' : mode === 'payment' ? 'Make Payment' : mode === 'feedback' ? 'We Value Your Feedback!' : `Confirm Purchase of ${carName}`}
              </h2>
              {mode === 'receipt' && receiptData && (
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
                  Invoice No:- {receiptData.invoiceNo}
                </p>
              )}
              {mode !== 'receipt' && (
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
                  {mode === 'offer' 
                    ? 'Negotiate the price of your dream car directly with the seller - simple, secure, and hassle-free.'
                    : mode === 'payment'
                    ? 'Note: This payment is going to be kept in an escrow until car is received'
                    : mode === 'feedback'
                    ? 'Share your feedback on your recent car purchase to help us improve and ensure an even smoother experience for others.'
                    : "You're about to confirm the purchase of this car. Once confirmed, the payment will be released to the seller, and the car will be marked as sold."}
                </p>
              )}
            </div>

            {/* Price Input Field */}
            {mode !== 'receipt' ? (
              <form onSubmit={handleSubmit} className="flex flex-col w-full" style={{ gap: '24px' }}>
                {mode !== 'confirm' && mode !== 'feedback' && (
                  <div className="flex flex-col w-full" style={{ gap: '8px' }}>
                    <label
                      htmlFor="offer-price"
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '12.58px',
                        lineHeight: '24px',
                        color: '#060606',
                        width: '100%',
                      }}
                    >
                      Amount
                    </label>
                    <input
                      id="offer-price"
                      type="text"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Enter Price"
                      disabled={mode === 'payment'}
                      className="w-full border border-[#E2E8F9] rounded-[6px] outline-none focus:border-[#005C32] transition-colors"
                      style={{
                        padding: '20px',
                        height: '60px',
                        fontFamily: 'Lexend',
                        fontWeight: 200,
                        fontSize: '12.68px',
                        lineHeight: '20px',
                        color: '#999999',
                        backgroundColor: mode === 'payment' ? '#F9FAFB' : 'white'
                      }}
                    />
                  </div>
                )}

                {mode === 'payment' && (
                  <>
                    <div className="flex flex-col w-full" style={{ gap: '8px' }}>
                      <label
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '12.58px',
                          lineHeight: '24px',
                          color: '#060606',
                          width: '100%',
                        }}
                      >
                        Car Make
                      </label>
                      <input
                        type="text"
                        value={carName}
                        disabled
                        className="w-full border border-[#E2E8F9] rounded-[6px] outline-none"
                        style={{
                          padding: '20px',
                          height: '60px',
                          fontFamily: 'Lexend',
                          fontWeight: 200,
                          fontSize: '12.68px',
                          lineHeight: '20px',
                          color: '#999999',
                          backgroundColor: '#F9FAFB'
                        }}
                      />
                    </div>

                    <div className="flex flex-col w-full" style={{ gap: '16px' }}>
                      <label
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '12.58px',
                          lineHeight: '24px',
                          color: '#060606',
                          width: '100%',
                        }}
                      >
                        Payment Method
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('wallet')}
                          className="flex-1 flex items-center justify-center transition-all active:scale-[0.98]"
                          style={{
                            height: '52px',
                            background: paymentMethod === 'wallet' ? 'rgba(0, 92, 50, 0.1)' : 'white',
                            border: `1px solid ${paymentMethod === 'wallet' ? '#005C32' : '#E2E8F9'}`,
                            borderRadius: '8px',
                            fontFamily: 'Lexend',
                            fontSize: '14px',
                            color: paymentMethod === 'wallet' ? '#005C32' : '#999999'
                          }}
                        >
                          Wallet({walletBalance})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('online')}
                          className="flex-1 flex items-center justify-center transition-all active:scale-[0.98]"
                          style={{
                            height: '52px',
                            background: paymentMethod === 'online' ? 'rgba(0, 92, 50, 0.1)' : 'white',
                            border: `1px solid ${paymentMethod === 'online' ? '#005C32' : '#E2E8F9'}`,
                            borderRadius: '8px',
                            fontFamily: 'Lexend',
                            fontSize: '14px',
                            color: paymentMethod === 'online' ? '#005C32' : '#999999'
                          }}
                        >
                          Online Payment
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {mode === 'feedback' && (
                  <div className="flex flex-col w-full" style={{ gap: '32px' }}>
                    {/* Rating Selection */}
                    <div className="flex flex-col w-full" style={{ gap: '12px' }}>
                      <div className="flex justify-between items-center w-full">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className="flex items-center justify-center transition-all active:scale-[0.98]"
                          style={{
                            width: '74px',
                            height: '42px',
                            background: rating === num ? 'rgba(0, 92, 50, 0.1)' : 'white',
                            border: `1px solid ${rating === num ? '#005C32' : '#E2E8F9'}`,
                            borderRadius: '8px',
                            fontFamily: 'Lexend',
                            fontSize: '18px',
                            fontWeight: 500,
                            color: rating === num ? '#005C32' : '#999999'
                          }}
                        >
                            {num}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between w-full">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Very Dissatisfied</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Very Satisfied</span>
                      </div>
                    </div>

                    {/* Feedback Textarea */}
                    <div className="flex flex-col w-full" style={{ gap: '8px' }}>
                      <label
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 500,
                          fontSize: '14px',
                          color: '#060606',
                        }}
                      >
                        Tell Us About Your Experience
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Type Here"
                        className="w-full border border-[#E2E8F9] rounded-[8px] outline-none focus:border-[#005C32] transition-colors resize-none"
                        style={{
                          padding: '20px',
                          height: '140px',
                          fontFamily: 'Lexend',
                          fontWeight: 300,
                          fontSize: '14px',
                          color: '#060606',
                        }}
                      />
                    </div>
                  </div>
                )}
              </form>
            ) : (
              receiptData && (
                <div ref={receiptRef} className="flex flex-col w-full bg-white p-2" style={{ gap: '24px' }}>
                  {/* Green Banner */}
                  <div 
                    className="w-full flex items-center justify-center"
                    style={{
                      height: '44px',
                      background: '#005C32',
                      borderRadius: '4px',
                    }}
                  >
                    <span style={{ fontFamily: 'Lexend', fontSize: '16px', fontWeight: 500, color: '#FFFFFF' }}>
                      Thank you for your purchase!
                    </span>
                  </div>

                  {/* Grid: Seller & Middleman */}
                  <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="flex flex-col gap-2">
                      <h3 style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 600, color: '#060606' }}>Seller Details</h3>
                      <div className="flex flex-col gap-1">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', fontWeight: 500, color: '#060606' }}>{receiptData.seller.name}</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#060606' }}>{receiptData.seller.phone}</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#060606' }}>{receiptData.seller.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <h3 style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 600, color: '#060606' }}>Middleman Details</h3>
                      <div className="flex flex-col gap-1">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', fontWeight: 500, color: '#060606' }}>{receiptData.middleman.name}</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#060606' }}>{receiptData.middleman.phone}</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#060606' }}>{receiptData.middleman.email}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed #E2E8F9', width: '100%' }} />

                  {/* Buyer Details */}
                  <div className="flex flex-col gap-2 w-full">
                    <h3 style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 600, color: '#060606' }}>Buyer Details</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Customer Name</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', fontWeight: 500, color: '#060606' }}>{receiptData.buyer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Customer Number</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', fontWeight: 500, color: '#060606' }}>{receiptData.buyer.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Email Address</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', fontWeight: 500, color: '#060606' }}>{receiptData.buyer.email}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed #E2E8F9', width: '100%' }} />

                  {/* Car Details */}
                  <div className="flex flex-col gap-4 w-full">
                    <h3 style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 600, color: '#060606' }}>Car Details</h3>
                    <div className="flex gap-4">
                      <img 
                        src={receiptData.car.image} 
                        alt={receiptData.car.name} 
                        style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
                      />
                      <div className="flex flex-col justify-center">
                        <span style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 600, color: '#060606' }}>{receiptData.car.name}</span>
                        <div className="flex gap-2 flex-wrap">
                          <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>VIN: {receiptData.car.vin}</span>
                          <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Mileage: {receiptData.car.mileage}</span>
                          <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Condition: {receiptData.car.condition}</span>
                        </div>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Purchase Date: {receiptData.car.purchaseDate}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed #E2E8F9', width: '100%' }} />

                  {/* Summation */}
                  <div className="flex flex-col gap-2 w-full">
                    <h3 style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 600, color: '#060606' }}>Summation</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Sub Total</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', fontWeight: 500, color: '#060606' }}>{receiptData.summation.subTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Discount</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', fontWeight: 500, color: '#060606' }}>{receiptData.summation.discount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>Total</span>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', fontWeight: 600, color: '#060606' }}>{receiptData.summation.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={isSubmitting}
            onClick={() => {
              if (mode === 'offer') {
                handleSubmit({ preventDefault: () => {} } as any);
              } else if (mode === 'feedback') {
                onSubmitFeedback?.(rating, comment);
              } else if (mode === 'receipt') {
                handleDownloadPDF();
              } else {
                onProceed?.(mode === 'payment' ? paymentMethod : undefined);
              }
            }}
            className="flex items-center justify-center hover:opacity-90 transition-all active:scale-[0.98] mt-auto w-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              height: '52px',
              background: '#005C32',
              borderRadius: '10px',
              padding: '12px 28px',
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
                  Submitting...
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 500,
                    fontSize: '15px',
                    lineHeight: '28px',
                    color: '#FFFFFF',
                  }}
                >
                  {mode === 'offer' ? 'Submit offer' : mode === 'payment' ? 'Proceed' : mode === 'feedback' ? 'Proceed' : mode === 'receipt' ? 'Download PDF' : 'Confirm Purchase'}
                </span>
                {mode === 'receipt' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15L12 3M12 15L8 11M12 15L16 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L2.62122 19.4849C2.84649 20.3859 3.65471 21 4.58405 21H19.4159C20.3453 21 21.1535 20.3859 21.3788 19.4849L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </>
            )}
          </button>

          {mode === 'receipt' && (
            <p 
              className="text-center"
              style={{ 
                fontFamily: 'Lexend', 
                fontSize: '12px', 
                color: '#060606',
                marginTop: '-16px'
              }}
            >
              Have any concerns? Send us an email <br />
              via <a href="mailto:support@huceautos.com" style={{ color: '#005C32', fontWeight: 600, textDecoration: 'underline' }}>support@huceautos.com</a>
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}