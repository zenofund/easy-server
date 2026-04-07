import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { toast } from 'sonner';
import api from '../../lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CurrencyInput } from '../ui/CurrencyInput';
import { formatAmount } from '../../lib/formatters';
import { Spinner } from '../ui/Spinner';
import { WalletPageSkeleton } from '../ui/SkeletonLoader';

const WithdrawIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#005C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17l10-10M7 7h10v10" />
  </svg>
);

const DepositIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#005C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <path d="M16 14h2" />
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const EmptyWalletIllustration = ({ isMobile }: { isMobile: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '40px 0' : '80px 0' }}>
    <div style={{ position: 'relative', width: isMobile ? '220px' : '280px', height: isMobile ? '160px' : '200px', marginBottom: '32px' }}>
      {/* Background Decorative Circle */}
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: isMobile ? '160px' : '200px', 
        height: isMobile ? '110px' : '140px', 
        backgroundColor: '#E6F2EB', 
        borderRadius: '50%', 
        opacity: 0.8 
      }} />
      
      {/* Wallet Illustration */}
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: isMobile ? '110px' : '140px', 
        height: isMobile ? '80px' : '100px', 
        backgroundColor: '#FFFFFF', 
        border: '2px solid #E2E8F9', 
        borderRadius: '16px', 
        zIndex: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          position: 'absolute', 
          right: '16px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          width: '14px', 
          height: '14px', 
          backgroundColor: '#E2E8F9', 
          borderRadius: '50%' 
        }} />
      </div>
      
      {/* Naira Coin */}
      <div style={{ 
        position: 'absolute', 
        top: isMobile ? '20px' : '30px', 
        left: isMobile ? '40px' : '50px', 
        width: isMobile ? '36px' : '44px', 
        height: isMobile ? '36px' : '44px', 
        backgroundColor: '#FFFFFF', 
        border: '2px solid #E2E8F9', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <span style={{ color: '#999999', fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold' }}>₦</span>
      </div>
      
      {/* Floating Plus Signs and Dots */}
      <div style={{ position: 'absolute', top: '20px', left: isMobile ? '100px' : '120px', color: '#E2E8F9', fontSize: '20px', zIndex: 1 }}>+</div>
      <div style={{ position: 'absolute', bottom: '40px', right: isMobile ? '40px' : '60px', color: '#E2E8F9', fontSize: '20px', zIndex: 1 }}>+</div>
      <div style={{ position: 'absolute', top: '40px', right: '80px', width: '6px', height: '6px', backgroundColor: '#E2E8F9', borderRadius: '50%', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: '60px', left: '70px', width: '6px', height: '6px', backgroundColor: '#E2E8F9', borderRadius: '50%', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: '100px', right: '40px', width: '4px', height: '4px', backgroundColor: '#E2E8F9', borderRadius: '50%', zIndex: 1 }} />
    </div>
    <h3 style={{ fontFamily: 'Lexend', fontSize: isMobile ? '18px' : '22px', fontWeight: 600, color: '#000000', marginBottom: '8px' }}>No Transaction</h3>
    <p style={{ fontFamily: 'Lexend', fontSize: isMobile ? '13px' : '14px', color: '#999999' }}>You have not performed any transaction</p>
  </div>
);

interface Transaction {
  id: string;
  description: string;
  sellerName: string;
  amount: string;
  buyerName: string;
  status: 'Paid' | 'In Escrow' | 'Refunded' | 'Deposit';
}

interface WalletViewProps {
  userType?: 'buyer' | 'seller';
  paymentInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    autopay: boolean;
  };
}

export function WalletView({ userType = 'seller', paymentInfo }: WalletViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | 'paystack' | 'deposit-selection'>('deposit');
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [wallet, setWallet] = useState<any>(null);
  const [revenueStats, setRevenueStats] = useState({ totalEarned: 0, pendingEarned: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWalletData();
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (showModal && modalType === 'withdraw' && paymentInfo) {
      setBank(paymentInfo.bankName || '');
      setAccountNumber(paymentInfo.accountNumber || '');
    }
  }, [showModal, modalType, paymentInfo]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wallet');
      if (response.data) {
        setWallet(response.data.wallet);
        // Map backend 'SUCCESS' status to UI expected status if needed
        const mappedTransactions = response.data.transactions.map((tx: any) => ({
          ...tx,
          status: tx.status === 'SUCCESS' ? 'Paid' : 
                  tx.status === 'PENDING' ? 'In Escrow' : 
                  tx.status === 'FAILED' ? 'Refunded' : tx.status
        }));
        setTransactions(mappedTransactions);
        if (response.data.revenueStats) {
          setRevenueStats(response.data.revenueStats);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast.error('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackDeposit = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    try {
      setSubmitting(true);
      const response = await api.post('/wallet/paystack/initialize', { 
        amount: parseFloat(amount) 
      });

      if (response.data?.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.data.authorization_url;
      } else {
        toast.error(response.data?.error || 'Failed to initialize Paystack');
      }
    } catch (error: any) {
      console.error('Paystack error:', error);
      toast.error(error.response?.data?.error || 'Failed to connect to Paystack');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (modalType === 'paystack') {
      handlePaystackDeposit();
      return;
    }
    try {
      setSubmitting(true);
      const endpoint = modalType === 'deposit' ? 'deposit' : 'withdrawal';
      
      if (modalType === 'withdraw' && (!bank || !accountNumber)) {
        toast.error('Please provide bank details for withdrawal');
        setSubmitting(false);
        return;
      }

      const response = await api.post(`/wallet/${endpoint}`, {
        amount: parseFloat(amount),
        description: modalType === 'deposit' ? 'Manual deposit' : `Withdrawal to ${bank} - ${accountNumber}`
      });

      if (response.data) {
        toast.success(response.data.message);
        setShowModal(false);
        setAmount('');
        setBank('');
        setAccountNumber('');
        fetchWalletData();
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'Paid': return '#22C55E';
      case 'In Escrow': return '#F59E0B';
      case 'Refunded': return '#EF4444';
      case 'Deposit': return '#005C32';
      default: return '#999999';
    }
  };

  if (loading) return <WalletPageSkeleton />;

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? '24px' : '32px'
      }}>
        <h2 style={{ 
          fontWeight: 'bold', 
          fontSize: isMobile ? '20px' : '24px', 
          color: '#000000', 
          margin: 0,
          fontFamily: 'Lexend'
        }}>
          Wallet
        </h2>
        {userType === 'buyer' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F9FAFB',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid #E2E8F9'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#005C32' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#666666', fontFamily: 'Lexend' }}>Buyer Account</span>
          </div>
        )}
      </div>

      {/* Balance Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gap: '24px', 
        marginBottom: isMobile ? '32px' : '48px', 
        alignItems: 'stretch' 
      }}>
        <div style={{ 
          gridColumn: isMobile ? 'auto' : 'span 2',
          backgroundColor: '#005C32',
          borderRadius: '24px',
          padding: isMobile ? '32px 24px' : '40px 32px',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: isMobile ? '160px' : '180px'
        }}>
          {/* Subtle Grid Pattern Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <span style={{ fontSize: '16px', opacity: 0.8, marginBottom: '12px', position: 'relative', fontFamily: 'Lexend' }}>
            Your Balance
          </span>
          <h3 style={{ 
            fontSize: isMobile ? '32px' : '48px', 
            fontWeight: 700, 
            margin: '0', 
            position: 'relative',
            fontFamily: 'Lexend'
          }}>
            ₦{wallet ? formatAmount(wallet.balance) : '0'}
          </h3>
          
          {userType === 'seller' && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '12px', 
              marginTop: '24px',
              position: 'relative' 
            }}>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                color: '#FFFFFF', 
                padding: '8px 16px', 
                borderRadius: '20px',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 500,
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontFamily: 'Lexend',
                flex: isMobile ? '1 1 calc(50% - 6px)' : 'none',
                minWidth: isMobile ? '130px' : 'auto',
                whiteSpace: 'nowrap'
              }}>
                Total Earns: ₦{formatAmount(revenueStats.totalEarned)}
              </div>
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                color: '#FFFFFF', 
                padding: '8px 16px', 
                borderRadius: '20px',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 500,
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontFamily: 'Lexend',
                flex: isMobile ? '1 1 calc(50% - 6px)' : 'none',
                minWidth: isMobile ? '130px' : 'auto',
                whiteSpace: 'nowrap'
              }}>
                Pending Earns: ₦{formatAmount(revenueStats.pendingEarned)}
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'row' : 'column', 
          gap: '12px',
          justifyContent: isMobile ? 'space-between' : 'flex-start',
        }}>
          <button 
            onClick={() => {
              setModalType('deposit-selection');
              setShowModal(true);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: '16px',
              border: '1.5px solid #005C32',
              borderRadius: '20px',
              background: '#FFFFFF',
              cursor: 'pointer',
              gap: '8px',
              height: isMobile ? '80px' : 'auto',
              fontFamily: 'Lexend'
            }}>
            <DepositIcon size={isMobile ? 20 : 24} />
            <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 500, color: '#005C32' }}>Deposit</span>
          </button>
          <button 
            onClick={() => {
              setModalType('withdraw');
              setShowModal(true);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: '16px',
              border: '1.5px solid #005C32',
              borderRadius: '20px',
              background: '#FFFFFF',
              cursor: 'pointer',
              gap: '8px',
              height: isMobile ? '80px' : 'auto',
              fontFamily: 'Lexend'
            }}>
            <WithdrawIcon size={isMobile ? 20 : 24} />
            <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 500, color: '#005C32' }}>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Transaction History Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center', 
          marginBottom: isMobile ? '24px' : '32px',
          gap: isMobile ? '20px' : '0'
        }}>
          <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 600, color: '#000000' }}>
            Transaction History
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px', 
            alignItems: isMobile ? 'stretch' : 'center' 
          }}>
            <div style={{ position: 'relative', width: isMobile ? '100%' : '300px' }}>
              <input 
                type="text" 
                placeholder="Search here..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: '1px solid #E2E8F9',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'Lexend'
                }}
              />
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                <SearchIcon />
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              width: isMobile ? '100%' : 'auto',
              flexDirection: 'row'
            }}>
              <button style={{
                flex: isMobile ? 1 : 'none',
                padding: isMobile ? '10px 16px' : '10px 24px',
                border: '1px solid #005C32',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#005C32',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'Lexend'
              }}>
                Generate All
              </button>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  style={{
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #E2E8F9',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB',
                    cursor: 'pointer'
                  }}
                >
                  <FilterIcon />
                </button>
                {showFilter && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    zIndex: 10,
                    minWidth: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} /> In Escrow
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} /> Paid
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} /> Refunded
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table / Empty State */}
        {transactions.length > 0 ? (
          <div style={{ 
            overflowX: 'auto',
            width: '100%',
            WebkitOverflowScrolling: 'touch',
            margin: '0 -16px', // Negative margin to bleed to edges on mobile
            padding: '0 16px'  // Padding to restore content position
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              minWidth: isMobile ? '900px' : 'auto' 
            }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #F0F0F0' }}>
                  {['ID', 'Description', userType === 'seller' ? 'Buyer Name' : 'Seller Name', 'Amount', 'Date', 'Status', ''].map((header) => (
                    <th key={header} style={{ 
                      padding: '16px 8px', 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#999999',
                      whiteSpace: 'nowrap',
                      fontFamily: 'Lexend'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={tx.id || index} style={{ borderBottom: index === transactions.length - 1 ? 'none' : '1px solid #F0F0F0' }}>
                    <td style={{ padding: '24px 8px', fontSize: '14px', color: '#666666', whiteSpace: 'nowrap', fontFamily: 'Lexend' }}>{tx.reference || (tx.id && tx.id.substring(0, 8)) || 'N/A'}</td>
                    <td style={{ padding: '24px 8px', fontSize: '14px', color: '#666666', whiteSpace: 'nowrap', fontFamily: 'Lexend' }}>{tx.description}</td>
                    <td style={{ padding: '24px 8px', fontSize: '14px', color: '#666666', whiteSpace: 'nowrap', fontFamily: 'Lexend' }}>{userType === 'seller' ? tx.buyerName : tx.sellerName}</td>
                    <td style={{ padding: '24px 8px', fontSize: '14px', color: '#666666', whiteSpace: 'nowrap', fontFamily: 'Lexend' }}>₦{formatAmount(tx.amount)}</td>
                    <td style={{ padding: '24px 8px', fontSize: '14px', color: '#666666', whiteSpace: 'nowrap', fontFamily: 'Lexend' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '24px 8px', whiteSpace: 'nowrap', fontFamily: 'Lexend' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666666' }}>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: getStatusColor(tx.status)
                        }} />
                        {tx.status}
                      </div>
                    </td>
                    <td style={{ padding: '24px 8px', textAlign: 'right', whiteSpace: 'nowrap', fontFamily: 'Lexend' }}>
                      <button style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#005C32', 
                        textDecoration: 'underline', 
                        fontSize: '14px', 
                        cursor: 'pointer',
                        opacity: 0.8,
                        fontFamily: 'Lexend'
                      }}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyWalletIllustration isMobile={isMobile} />
        )}
      </div>

      {/* Wallet Modal (Deposit/Withdraw) */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        maxWidth="max-w-[742px]"
        padding={isMobile ? "p-4" : "p-6"}
      >
        <button 
            onClick={() => {
              if (modalType === 'paystack' || modalType === 'deposit') {
                setModalType('deposit-selection');
              } else {
                setShowModal(false);
              }
            }}
            style={{
              background: 'none',
              border: 'none', 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '24px',
              fontSize: '16px', 
              fontWeight: 500,
              color: '#666666',
              fontFamily: 'Lexend'
            }}
          >
            <ChevronLeftIcon /> Back
          </button>

          <h3 style={{
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: 600,
            color: '#000000', 
            marginBottom: '8px',
            fontFamily: 'Lexend'
          }}>
            {modalType === 'deposit-selection' ? 'Deposit' : modalType === 'paystack' ? 'Paystack Deposit' : modalType === 'deposit' ? 'Manual Deposit' : 'Withdrawal Request'}
          </h3>
          <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#666666', marginBottom: '32px', fontFamily: 'Lexend' }}>
            {modalType === 'deposit-selection'
              ? 'Select your preferred deposit method to fund your wallet.'
              : modalType === 'paystack' 
                ? 'Enter amount to deposit via Paystack secure gateway.' 
                : modalType === 'deposit' 
                  ? 'Enter amount and transfer details for manual deposit.' 
                  : 'Enter withdrawal details.'}
          </p>

          {modalType === 'deposit-selection' ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px', 
              marginBottom: '24px' 
            }}>
              <button
                onClick={() => setModalType('paystack')}
                style={{
                  flex: 1,
                  height: '52px',
                  background: 'white',
                  border: '1px solid #E2E8F9',
                  borderRadius: '8px',
                  fontFamily: 'Lexend',
                  fontSize: '14px',
                  color: '#999999', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 92, 50, 0.05)';
                  e.currentTarget.style.borderColor = '#005C32';
                  e.currentTarget.style.color = '#005C32';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#E2E8F9';
                  e.currentTarget.style.color = '#999999';
                }}
              >
                Paystack
              </button>
              <button
                onClick={() => setModalType('deposit')}
                style={{
                  flex: 1,
                  height: '52px',
                  background: 'white', 
                  border: '1px solid #E2E8F9',
                  borderRadius: '8px',
                  fontFamily: 'Lexend',
                  fontSize: '14px', 
                  color: '#999999', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 92, 50, 0.05)';
                  e.currentTarget.style.borderColor = '#005C32';
                  e.currentTarget.style.color = '#005C32';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#E2E8F9';
                  e.currentTarget.style.color = '#999999';
                }}
              >
                Bank Deposit
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                <CurrencyInput
                  label="Amount (₦)"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(val) => setAmount(val)}
                />

                {modalType === 'withdraw' && (
                  <>
                    {!paymentInfo?.bankName || !paymentInfo?.accountNumber ? (
                      <div style={{
                        padding: '16px',
                        background: 'rgba(217, 63, 22, 0.1)',
                        border: '1px solid #D93F16',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}>
                        <p style={{
                          fontFamily: 'Lexend',
                          fontSize: '14px',
                          color: '#D93F16',
                          margin: 0
                        }}>
                          Please update your bank details in settings before you can withdraw.
                        </p>
                      </div>
                    ) : null}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '12.58px', 
                        lineHeight: '24px',
                        color: '#060606',
                      }}>
                        Bank Name
                      </label>
                      <input 
                        type="text"
                        placeholder="Bank Name"
                        value={bank}
                        readOnly
                        style={{
                          width: '100%',
                          height: '60px',
                          padding: '20px',
                          border: '1px solid #E2E8F9',
                          borderRadius: '6px',
                          fontFamily: 'Lexend',
                          fontWeight: 200, 
                          fontSize: '12.68px',
                          lineHeight: '20px', 
                          color: '#060606',
                          backgroundColor: '#F9FAFB',
                          outline: 'none',
                          cursor: 'not-allowed'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '12.58px', 
                        lineHeight: '24px',
                        color: '#060606',
                      }}>
                        Account Number
                      </label>
                      <input 
                        type="text"
                        placeholder="Enter Account Number"
                        value={accountNumber}
                        readOnly
                        style={{
                          width: '100%',
                          height: '60px',
                          padding: '20px',
                          border: '1px solid #E2E8F9',
                          borderRadius: '6px',
                          fontFamily: 'Lexend',
                          fontWeight: 200, 
                          fontSize: '12.68px',
                          lineHeight: '20px', 
                          color: '#060606',
                          backgroundColor: '#F9FAFB',
                          outline: 'none',
                          cursor: 'not-allowed'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={handleSubmit}
                disabled={submitting || !amount || (modalType === 'withdraw' && (!paymentInfo?.bankName || !paymentInfo?.accountNumber))}
                style={{
                  width: '100%',
                  height: '52px',
                  backgroundColor: '#005C32',
                  color: '#FFFFFF',
                  border: 'none', 
                  borderRadius: '10px',
                  fontFamily: 'Lexend',
                  fontWeight: 500, 
                  fontSize: '15px', 
                  cursor: (submitting || !amount || (modalType === 'withdraw' && (!paymentInfo?.bankName || !paymentInfo?.accountNumber))) ? 'not-allowed' : 'pointer',
                  opacity: (submitting || !amount || (modalType === 'withdraw' && (!paymentInfo?.bankName || !paymentInfo?.accountNumber))) ? 0.7 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                {submitting ? 'Processing...' : modalType === 'paystack' ? 'Pay with Paystack' : 'Submit Request'}
              </button>
            </>
          )}
      </Modal>
    </>
  );
}
