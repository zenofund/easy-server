import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import api from '../../lib/api';
import { toast } from 'sonner';
import { formatAmount, formatID } from '../../lib/formatters';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Spinner } from '../ui/Spinner';

// Icons
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005C32" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

type OfferActionType = 'accept' | 'counter' | 'decline';

interface OfferActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: OfferActionType;
  initialAmount: string;
  onProceed: (amount: string) => void;
  isLoading?: boolean;
}

const OfferActionModal = ({ isOpen, onClose, type, initialAmount, onProceed, isLoading }: OfferActionModalProps) => {
  const [amount, setAmount] = useState(initialAmount);

  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount, isOpen]);

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

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '540px',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#666666'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 style={{
          fontFamily: 'Lexend',
          fontSize: '24px',
          fontWeight: 600,
          color: '#000000',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {content.title}
        </h2>

        <p style={{
          fontFamily: 'Lexend',
          fontSize: '16px',
          color: '#666666',
          lineHeight: '1.6',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          {content.description}
        </p>

        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'Lexend',
            fontSize: '14px',
            fontWeight: 500,
            color: '#333333',
            marginBottom: '12px'
          }}>
            {type === 'counter' ? 'Counter Offer Amount' : 'Offer Amount'}
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'Lexend',
              fontSize: '16px',
              color: '#333333',
              fontWeight: 500
            }}>
              ₦
            </span>
            <input
              type="text"
              value={formatAmount(amount)}
              readOnly={content.isReadOnly}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                setAmount(val);
              }}
              style={{
                width: '100%',
                padding: '16px 16px 16px 40px',
                border: '1px solid #E2E8F9',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'Lexend',
                outline: 'none',
                backgroundColor: content.isReadOnly ? '#F9FAFB' : '#FFFFFF',
                color: '#333333',
                fontWeight: 600
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F9',
              backgroundColor: '#FFFFFF',
              color: '#333333',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'Lexend',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onProceed(amount)}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: content.buttonColor,
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'Lexend',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
            className="hover:opacity-90 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" variant="white" />
                <span>Processing...</span>
              </>
            ) : content.buttonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

interface SellerCarDetailViewProps {
  car: any;
  user: any;
  onBack: () => void;
  onEdit?: (car: any) => void;
  onDelete?: (carId: string) => void;
}

const formatShortPrice = (amount: number) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K`;
  }
  return formatAmount(amount);
};

const formatNaira = (amount: number | string) => {
  return `₦${formatAmount(amount)}`;
};

export function SellerCarDetailView({ car, user, onBack, onEdit, onDelete }: SellerCarDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'offers'>('overview');
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: OfferActionType;
    offer: any;
  }>({
    isOpen: false,
    type: 'accept',
    offer: null
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'offers') {
      fetchOffers();
    }
  }, [activeTab]);

  const fetchOffers = async () => {
    setIsLoadingOffers(true);
    try {
      const response = await api.get(`/offers/car/${car.id}`);
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to fetch offers');
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const handleActionClick = (type: OfferActionType, offer: any) => {
    setModalConfig({
      isOpen: true,
      type,
      offer
    });
  };

  const handleModalProceed = async (amount: string) => {
    const { type, offer } = modalConfig;
    if (!offer) return;

    setIsSubmittingAction(true);
    try {
      if (type === 'accept') {
        await api.patch(`/offers/${offer.id}/status`, { status: 'ACCEPTED' });
        toast.success('Offer accepted successfully');
      } else if (type === 'counter') {
        await api.post(`/offers/${offer.id}/counter`, { amount });
        toast.success('Counter offer sent successfully');
      } else if (type === 'decline') {
        await api.patch(`/offers/${offer.id}/status`, { status: 'REJECTED' });
        toast.success('Offer declined successfully');
      }
      
      setModalConfig(prev => ({ ...prev, isOpen: false }));
      fetchOffers();
    } catch (error: any) {
      console.error(`Error ${type}ing offer:`, error);
      toast.error(error.response?.data?.message || `Failed to ${type} offer`);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const features = typeof car.features === 'string' ? JSON.parse(car.features) : (car.features || []);
  const images = typeof car.images === 'string' ? JSON.parse(car.images) : (car.images || []);

  const detailInfo = [
    { label: 'Car Details', value: `${car.make} ${car.model} , ${car.year}` },
    { label: "Seller's Name", value: user.sellerProfile?.companyName || `${user.firstName} ${user.lastName}` },
    { label: 'Amount', value: formatNaira(Number(car.price)) },
    { label: 'Upload Date', value: new Date(car.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
    { label: 'Offers', value: car._count?.offers || 0 },
    { label: 'Views', value: car.views || 0 },
    { label: 'Listing Status', value: car.status === 'AVAILABLE' ? 'Active' : (car.status === 'DELETION_PENDING' ? 'Deletion Pending' : car.status), isStatus: true },
  ];

  const overviewItems = [
    { label: 'Car Type', value: car.bodyType || 'Sedan' },
    { label: 'Mileage', value: car.mileage || '0' },
    { label: 'Fuel Type', value: car.fuelType || 'Petrol' },
    { label: 'Year', value: car.year },
    { label: 'Transmission', value: car.transmission || 'Manual' },
    { label: 'Drive Type', value: car.driveType || 'Rear-Wheel Drive' },
    { label: 'Condition', value: car.condition || 'Used' },
    { label: 'Doors', value: car.doors ? `${car.doors} Doors` : '4 Doors' },
    { label: 'Color', value: car.color || 'Black' },
    { label: 'VIN', value: car.vin || 'FD333****' },
  ];

  return (
    <>
      {/* Header with Back Button */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Lexend', fontWeight: 'bold', fontSize: '24px', color: '#000000' }}>
            My Listings
          </h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => onEdit && onEdit(car)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#005C32',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Lexend'
              }}
            >
              Edit Listing
            </button>
            <button 
              onClick={() => onDelete && onDelete(car.id)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#F8B4A6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Lexend'
              }}
            >
              Delete Listing
            </button>
          </div>
        </div>
        <button 
          onClick={onBack}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#999999',
            fontFamily: 'Lexend',
            fontSize: '18px',
            padding: '0',
            marginBottom: '24px'
          }}
        >
          <BackIcon /> Back
        </button>
        <h3 style={{ fontFamily: 'Lexend', fontWeight: 'bold', fontSize: '28px', color: '#000000', marginBottom: '32px' }}>
          {car.make} {car.model} , {car.year}
        </h3>

        {/* Info Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(130px, 1fr))' : 'repeat(7, 1fr)', 
          gap: '24px 16px', 
          borderBottom: '1px solid #F0F0F0', 
          paddingBottom: '32px' 
        }}>
          {detailInfo.map((info, idx) => (
            <div key={idx}>
              <div style={{ 
                fontFamily: 'Lexend', 
                fontSize: '14px', 
                color: '#999999', 
                marginBottom: '8px',
                whiteSpace: isMobile ? 'normal' : 'nowrap'
              }}>
                {info.label}
              </div>
              {info.isStatus ? (
                <div style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  backgroundColor: '#E6F2EB', 
                  color: '#005C32', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  fontFamily: 'Lexend',
                  whiteSpace: 'nowrap'
                }}>
                  {info.value}
                </div>
              ) : (
                <div style={{ 
                  fontFamily: 'Lexend', 
                  fontSize: isMobile ? '14px' : '16px', 
                  fontWeight: 'bold', 
                  color: '#000000',
                  whiteSpace: isMobile ? 'normal' : 'nowrap'
                }}>
                  {info.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #F0F0F0', marginBottom: '24px' }}>
        {[
          { id: 'overview', label: 'Car Overview' },
          { id: 'offers', label: 'Offers' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              paddingBottom: '12px',
              paddingLeft: '4px',
              paddingRight: '4px',
              fontFamily: 'Lexend',
              fontWeight: 500,
              fontSize: '14px',
              color: activeTab === tab.id ? '#005C32' : '#999999',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#005C32' }} />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: isMobile ? '32px' : '64px' }}>
          {/* Left Column */}
          <div>
            <h4 style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Car Overview</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr 1fr', 
              gap: isMobile ? '16px' : '24px 48px', 
              marginBottom: '48px' 
            }}>
              {overviewItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', whiteSpace: 'nowrap' }}>{item.label}</span>
                  <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666', fontWeight: 500, whiteSpace: isMobile ? 'normal' : 'nowrap' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <h4 style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Features</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(4, 1fr)', 
              gap: isMobile ? '24px 16px' : '24px' 
            }}>
              {['Interior', 'Safety', 'Exterior', 'Comfort & Convenience'].map((cat) => (
                <div key={cat}>
                  <h5 style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', color: '#000000', whiteSpace: 'nowrap' }}>{cat}</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {features.filter((f: string) => f.toLowerCase().includes(cat.toLowerCase()) || !f.includes(':')).slice(0, 6).map((f: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>
                          <CheckIcon />
                        </div>
                        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#000000', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>{f.includes(':') ? f.split(':')[1].trim() : f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ marginTop: isMobile ? '32px' : '0' }}>
            <h4 style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Description</h4>
            <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', lineHeight: '1.6', marginBottom: '32px' }}>
              {car.description || "No description provided."}
            </p>

            <h4 style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Photos</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {images.map((img: string, idx: number) => (
                <a 
                  key={idx} 
                  href={img} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontFamily: 'Lexend', 
                    fontSize: '16px', 
                    color: '#005C32', 
                    textDecoration: 'underline',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  View Image {idx + 1}
                </a>
              ))}
              {images.length === 0 && <span style={{ color: '#999999' }}>No photos uploaded.</span>}
            </div>
          </div>
        </div>
      ) : (
        /* Offers Tab */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 'bold' }}>
              Offers({offers.length})
            </h4>
            <div style={{ position: 'relative', width: '350px' }}>
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 50px',
                  border: '1px solid #E2E8F9',
                  borderRadius: '12px',
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

          {isLoadingOffers ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Spinner size="lg" />
              <p style={{ fontFamily: 'Lexend', color: '#999999' }}>Loading offers...</p>
            </div>
          ) : offers.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F0F0F0', textAlign: 'left' }}>
                      <th style={{ padding: '16px', fontFamily: 'Lexend', fontSize: '14px', color: '#999999', fontWeight: 500 }}>Offer ID</th>
                      <th style={{ padding: '16px', fontFamily: 'Lexend', fontSize: '14px', color: '#999999', fontWeight: 500 }}>Buyer Name</th>
                      <th style={{ padding: '16px', fontFamily: 'Lexend', fontSize: '14px', color: '#999999', fontWeight: 500 }}>Offer Amount</th>
                      <th style={{ padding: '16px', fontFamily: 'Lexend', fontSize: '14px', color: '#999999', fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '16px', fontFamily: 'Lexend', fontSize: '14px', color: '#999999', fontWeight: 500, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers
                      .filter(offer => 
                        `${offer.buyer.firstName} ${offer.buyer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        offer.id.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((offer) => (
                        <tr key={offer.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                          <td style={{ padding: '16px', fontFamily: 'Lexend', fontSize: '14px', color: '#333333' }}>
                            {formatID(offer.id)}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                backgroundColor: '#F0F9F4', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '14px', 
                                fontWeight: 600,
                                color: '#005C32',
                                fontFamily: 'Lexend'
                              }}>
                                {offer.buyer.firstName.charAt(0)}{offer.buyer.lastName.charAt(0)}
                              </div>
                              <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#333333', fontWeight: 500 }}>
                                {offer.buyer.firstName} {offer.buyer.lastName}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '16px', fontFamily: 'Lexend', fontSize: '14px', fontWeight: 600, color: '#333333' }}>
                            ₦{formatAmount(offer.amount)}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ 
                              padding: '6px 12px', 
                              borderRadius: '20px', 
                              fontSize: '12px', 
                              fontWeight: 500,
                              fontFamily: 'Lexend',
                              backgroundColor: offer.status === 'ACCEPTED' ? '#E6F2EB' : (offer.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7'),
                              color: offer.status === 'ACCEPTED' ? '#005C32' : (offer.status === 'REJECTED' ? '#991B1B' : '#92400E')
                            }}>
                              {offer.status.charAt(0) + offer.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            {offer.status === 'PENDING' ? (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button 
                                  onClick={() => handleActionClick('accept', offer)}
                                  style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: '#005C32', 
                                    color: '#FFFFFF', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer', 
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    fontFamily: 'Lexend'
                                  }}
                                >
                                  Accept Offer
                                </button>
                                <button 
                                  onClick={() => handleActionClick('counter', offer)}
                                  style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: '#FFFFFF', 
                                    color: '#005C32', 
                                    border: '1px solid #005C32', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer', 
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    fontFamily: 'Lexend'
                                  }}
                                >
                                  Counter Offer
                                </button>
                                <button 
                                  onClick={() => handleActionClick('decline', offer)}
                                  style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: '#F8B4A6', 
                                    color: '#FFFFFF', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer', 
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    fontFamily: 'Lexend'
                                  }}
                                >
                                  Decline Offer
                                </button>
                              </div>
                            ) : (
                              <div style={{ textAlign: 'center', fontFamily: 'Lexend', fontSize: '13px', color: '#999999' }}>
                                No actions available
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {offers.length > itemsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #E2E8F9',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      color: currentPage === 1 ? '#CCCCCC' : '#333333'
                    }}
                  >
                    Previous
                  </button>
                  {[...Array(Math.ceil(offers.length / itemsPerPage))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F9',
                        backgroundColor: currentPage === i + 1 ? '#005C32' : '#FFFFFF',
                        color: currentPage === i + 1 ? '#FFFFFF' : '#333333',
                        cursor: 'pointer',
                        fontFamily: 'Lexend',
                        fontWeight: 500
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(offers.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(offers.length / itemsPerPage)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #E2E8F9',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      cursor: currentPage === Math.ceil(offers.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                      color: currentPage === Math.ceil(offers.length / itemsPerPage) ? '#CCCCCC' : '#333333'
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
              <p style={{ fontFamily: 'Lexend', color: '#999999', fontSize: '16px' }}>No offers received for this listing yet.</p>
            </div>
          )}
        </div>
      )}

      <OfferActionModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        type={modalConfig.type}
        initialAmount={modalConfig.offer?.amount?.toString() || '0'}
        onProceed={handleModalProceed}
        isLoading={isSubmittingAction}
      />
    </>
  );
}
