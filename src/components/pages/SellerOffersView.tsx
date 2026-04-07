import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatAmount, cleanAmount, formatID } from '../../lib/formatters';
import { TableSkeleton } from '../ui/SkeletonLoader';
import api from '../../lib/api';
import { toast } from 'sonner';
import { LoadingOverlay, Spinner } from '../ui/Spinner';

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

interface Offer {
  id: string;
  buyerName: string;
  amount: string;
  carDetails: string;
  status: string;
}

type OfferActionType = 'accept' | 'counter' | 'decline';

interface OfferActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: OfferActionType;
  initialAmount: string;
  onProceed: (amount: string) => void;
  isSubmitting?: boolean;
}

const OfferActionModal = ({ isOpen, onClose, type, initialAmount, onProceed, isSubmitting = false }: OfferActionModalProps) => {
  const [amount, setAmount] = useState(initialAmount);

  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialAmount]);

  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'accept':
        return {
          title: 'Accept Offer',
          description: 'By accepting this offer, you agree that the terms meet your expectations, and the buyer will be notified to proceed with payment.',
          buttonText: 'Proceed',
          buttonColor: '#005C32',
          isReadOnly: true
        };
      case 'counter':
        return {
          title: 'Counter Offer',
          description: 'Make a counteroffer if the current terms don’t meet your expectations. The buyer will review and respond to your proposed price.',
          buttonText: 'Proceed',
          buttonColor: '#005C32',
          isReadOnly: false
        };
      case 'decline':
        return {
          title: 'Decline Offer',
          description: 'Are you sure you want to decline this offer? This action will notify the buyer and cannot be undone.',
          buttonText: 'Decline',
          buttonColor: '#F8B4A6',
          isReadOnly: true
        };
    }
  };

  const content = getContent();

  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)'
        }} 
      />

      {/* Modal Content */}
      <div style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '540px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Back Button */}
        <button 
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: '#999999',
            fontSize: '16px',
            fontFamily: 'Lexend'
          }}
        >
          <ChevronLeftIcon /> Back
        </button>

        {/* Title & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            margin: 0, 
            color: '#000000',
            fontFamily: 'Lexend'
          }}>
            {content.title}
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: '#999999', 
            lineHeight: '1.5',
            margin: 0,
            fontFamily: 'Lexend'
          }}>
            {content.description}
          </p>
        </div>

        {/* Price Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ 
            fontSize: '12px', 
            fontWeight: 500, 
            color: '#000000',
            fontFamily: 'Lexend'
          }}>
            Price
          </label>
          <input 
            type="text" 
            value={formatAmount(amount)}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              setAmount(val);
            }}
            readOnly={content.isReadOnly}
            placeholder="₦0"
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: content.isReadOnly ? '#F5F5F5' : '#FFFFFF',
              border: content.isReadOnly ? 'none' : '1px solid #E2E8F9',
              borderRadius: '12px',
              fontSize: '14px',
              color: content.isReadOnly ? '#999999' : '#333333',
              outline: 'none',
              fontFamily: 'Lexend'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <button 
            onClick={() => onProceed(amount)}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: content.buttonColor,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Lexend',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            className="active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" variant="white" />
                <span>Processing...</span>
              </>
            ) : content.buttonText}
          </button>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: '#F8B4A6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Lexend',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            className="active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export function SellerOffersView() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: OfferActionType;
    amount: string;
    offerId: string;
  }>({
    isOpen: false,
    type: 'accept',
    amount: '',
    offerId: ''
  });
  const itemsPerPage = 10;

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/offers/seller?page=${currentPage}&limit=${itemsPerPage}`);
      if (response.data) {
        setOffers(response.data.offers || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.total || 0);
      }
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load offers');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentPage]);

  const handleActionClick = (type: OfferActionType, amount: string, offerId: string) => {
    setModalConfig({
      isOpen: true,
      type,
      amount,
      offerId
    });
  };

  const handleProceed = async (amount: string) => {
    try {
      setIsSubmitting(true);
      const { type, offerId } = modalConfig;
      let response;

      if (type === 'accept') {
        response = await api.post(`/offers/${offerId}/accept`);
        toast.success('Offer accepted successfully');
      } else if (type === 'counter') {
        response = await api.post(`/offers/${offerId}/counter`, { amount: cleanAmount(amount) });
        toast.success('Counter offer sent successfully');
      } else if (type === 'decline') {
        response = await api.post(`/offers/${offerId}/reject`);
        toast.success('Offer declined');
      }

      setModalConfig(prev => ({ ...prev, isOpen: false }));
      fetchOffers(); // Refresh the list
    } catch (error: any) {
      console.error(`Error performing ${modalConfig.type} action:`, error);
      toast.error(error.response?.data?.error || `Failed to ${modalConfig.type} offer`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOffers = searchQuery.trim() 
    ? offers.filter(offer => 
        offer.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.carDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : offers;

  // Since we are doing server-side pagination, we don't slice here
  const paginatedOffers = filteredOffers;

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '10px' }}>
        <h2 style={{ fontFamily: 'Lexend', fontWeight: 'bold', fontSize: '24px', color: '#000000', whiteSpace: 'nowrap' }}>
          Offers
        </h2>
      </div>

      {/* Sub Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'Lexend', fontWeight: 'bold', fontSize: '20px', color: '#000000' }}>
          Offers({totalItems})
        </h3>
        <div style={{ position: 'relative', width: '350px' }}>
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 56px',
              border: '1px solid #E2E8F9',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Lexend'
            }}
          />
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none' }}>
            <SearchIcon />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <>
            <table style={{ width: '100%', minWidth: '800px', whiteSpace: 'nowrap', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                  {['Offer ID', 'Buyer Name', 'Offer Amount', 'Car Details', 'Status', ''].map((header) => (
                    <th key={header} style={{ textAlign: 'left', padding: '10px 8px', fontSize: '14px', fontWeight: 500, color: '#666666', fontFamily: 'Lexend' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedOffers.length > 0 ? (
                  paginatedOffers.map((offer) => (
                    <tr key={offer.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '16px 8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend' }}>
                        {formatID(offer.id)}
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 500, color: '#000000', fontFamily: 'Lexend' }}>
                        {offer.buyerName}
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 500, color: '#000000', fontFamily: 'Lexend' }}>
                        ₦{formatAmount(offer.amount)}
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend' }}>
                        {offer.carDetails}
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: 500,
                          backgroundColor: 
                            offer.status === 'PENDING' ? '#FFF9E6' :
                            offer.status === 'ACCEPTED' ? '#E6F2EB' :
                            offer.status === 'REJECTED' ? '#FEECEB' :
                            offer.status === 'COUNTERED' ? '#EBF3FE' : '#F4F4F4',
                          color:
                            offer.status === 'PENDING' ? '#B28400' :
                            offer.status === 'ACCEPTED' ? '#005C32' :
                            offer.status === 'REJECTED' ? '#D32F2F' :
                            offer.status === 'COUNTERED' ? '#1976D2' : '#666666',
                        }}>
                          {offer.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        {offer.status === 'PENDING' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button 
                              onClick={() => handleActionClick('accept', offer.amount, offer.id)}
                              style={{
                                padding: '8px 24px',
                                backgroundColor: '#005C32',
                                color: '#FFFFFF',
                                fontSize: '14px',
                                fontWeight: 500,
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'Lexend',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                              }}
                              className="active:scale-[0.98]"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleActionClick('counter', offer.amount, offer.id)}
                              style={{
                                padding: '8px 24px',
                                backgroundColor: '#FFFFFF',
                                color: '#000000',
                                fontSize: '14px',
                                fontWeight: 500,
                                borderRadius: '8px',
                                border: '1px solid #E2E8F9',
                                cursor: 'pointer',
                                fontFamily: 'Lexend',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                              }}
                              className="active:scale-[0.98]"
                            >
                              Counter
                            </button>
                            <button 
                              onClick={() => handleActionClick('decline', offer.amount, offer.id)}
                              style={{
                                padding: '8px 24px',
                                backgroundColor: '#F8B4A6',
                                color: '#FFFFFF',
                                fontSize: '14px',
                                fontWeight: 500,
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'Lexend',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                              }}
                              className="active:scale-[0.98]"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#666666', fontFamily: 'Lexend' }}>
                      No offers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F9',
                    borderRadius: '8px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  <ArrowLeftIcon />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: currentPage === page ? '#005C32' : '#FFFFFF',
                      color: currentPage === page ? '#FFFFFF' : '#000000',
                      border: '1px solid #E2E8F9',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Lexend'
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F9',
                    borderRadius: '8px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  <ArrowRightIcon />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <OfferActionModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        initialAmount={modalConfig.amount}
        onProceed={handleProceed}
        isSubmitting={isSubmitting}
      />
    </>     );
  }
