import { formatNaira, formatAmount, formatID } from '../../lib/formatters';
import { SkeletonLoader, StatsGridSkeleton, TableSkeleton } from '../ui/SkeletonLoader';
import { Navigation } from '../Navigation';
import { Spinner } from '../ui/Spinner';
import { toast } from 'sonner';
import { AppDownloadSection } from '../sections/AppDownloadSection';
import { Footer } from '../Footer';
import userAvatar from 'figma:asset/f77a7b555b924e5721574d1e5d638013bc02125d.png';
import { useEffect, useState } from 'react';
import { DashboardModal } from '../modals/DashboardModal';

import { MakeOfferModal } from '../modals/MakeOfferModal';
import { CustomerSupportView } from './CustomerSupportView';
import { WalletView } from './WalletView';
import { SavedCarsView } from './SavedCarsView';
import { HistoryView } from './HistoryView';
import { MessagesView } from './MessagesView';
import { ChatDetailView } from './ChatDetailView';
import { BuyerSettingsView } from './BuyerSettingsView';
import api from '../../lib/api';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';
import { API_BASE_URL } from '../../lib/api';

const SERVER_URL = API_BASE_URL.replace('/api', '');

// Icon components using inline SVG
const HomeIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const InvoiceIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const HeartIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.54981">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CarTimeIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
    <circle cx="7.5" cy="16.5" r="1.5" />
    <circle cx="16.5" cy="16.5" r="1.5" />
    <path d="M21 10h-3" />
    <path d="M22 7l-1 1" />
  </svg>
);

const ChatIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
  </svg>
);

const WalletIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="10" y1="16" x2="10" y2="16" />
    <line x1="14.5" y1="16" x2="17.5" y2="16" />
  </svg>
);

const SupportIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
    <path d="M8 14h8" />
  </svg>
);

const UserIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const InspectionIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.16235">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18.76" height="18.76" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="18.76" height="18.76" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SuccessCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#005C32" />
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const DetailIcon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

type TabType = 'home' | 'activities' | 'saved' | 'history' | 'wallet' | 'messages' | 'support' | 'profile';
type SubTabType = 'purchases' | 'offers' | 'inspections';

function InspectionCard({ 
  title, 
  subTitle, 
  status, 
  rating, 
  isWarning = false 
}: { 
  title: string; 
  subTitle: string; 
  status: string; 
  rating: number; 
  isWarning?: boolean;
}) {
  return (
    <div style={{ 
      background: '#FAFAFA', 
      borderRadius: '12px', 
      padding: '24px',
      border: '1px solid #F0F0F0'
    }}>
      <div style={{ marginBottom: '12px' }}>
        <span style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{title}: </span>
        <span style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>{subTitle}</span>
      </div>
      <p style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', color: '#000000', marginBottom: '16px' }}>
        Status: {status}
      </p>
      <div style={{ 
        display: 'inline-flex',
        padding: '4px 12px',
        background: isWarning ? '#FFF1F0' : '#F0F9F4',
        borderRadius: '6px',
        color: isWarning ? '#ED0D0D' : '#005C32',
        fontFamily: 'Lexend',
        fontSize: '12px',
        fontWeight: 500
      }}>
        Rating: {rating}%
      </div>
    </div>
  );
}

export function BuyerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('inspections');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'Profile' | 'Payment'>('Profile');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [initialOfferPrice, setInitialOfferPrice] = useState<string | undefined>(undefined);
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmPurchaseStepModal, setShowConfirmPurchaseStepModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showConfirmPurchaseModal, setShowConfirmPurchaseModal] = useState(false);
  const [showRequestInspectionModal, setShowRequestInspectionModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [lastPurchasedVehicle, setLastPurchasedVehicle] = useState<any>(null);
  const [offerToPay, setOfferToPay] = useState<any>(null);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [isFetchingStats, setIsFetchingStats] = useState(true);
  const [isFetchingActivities, setIsFetchingActivities] = useState({
    purchases: true,
    offers: true,
    inspections: true
  });
  const [isAcceptingOffer, setIsAcceptingOffer] = useState<string | null>(null);
  const [isCancellingOffer, setIsCancellingOffer] = useState<string | null>(null);
  const [isConfirmingPurchase, setIsConfirmingPurchase] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('buyer_sidebar_collapsed');
    if (saved === null) return true;
    return saved === 'true';
  });
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [paymentInfo, setPaymentInfo] = useState({ bankName: '', accountNumber: '', accountName: '', autopay: false });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingPaymentInfo, setIsSavingPaymentInfo] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [offersSearchQuery, setOffersSearchQuery] = useState('');
  const [inspectionsSearchQuery, setInspectionsSearchQuery] = useState('');
  const [purchasesSearchQuery, setPurchasesSearchQuery] = useState('');
  const [wallet, setWallet] = useState<any>(null);
  const [activities, setActivities] = useState<{
    purchases: any[];
    offers: any[];
    inspections: any[];
  }>({
    purchases: [],
    offers: [],
    inspections: [],
  });
  const [activitiesPagination, setActivitiesPagination] = useState<{
    [key: string]: {
      page: number;
      totalPages: number;
      total: number;
    }
  }>({
    purchases: { page: 1, totalPages: 1, total: 0 },
    offers: { page: 1, totalPages: 1, total: 0 },
    inspections: { page: 1, totalPages: 1, total: 0 },
  });
  const [stats, setStats] = useState({
    purchases: 0,
    offers: { total: 0, accepted: 0, rejected: 0 },
    savedCars: 0,
    inspections: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    const pendingChat = localStorage.getItem('pending_chat_partner');
    if (pendingChat) {
      const partner = JSON.parse(pendingChat);
      setSelectedChat({
        senderId: partner.id,
        senderName: partner.name,
        senderRole: partner.role
      });
      setActiveTab('messages');
      localStorage.removeItem('pending_chat_partner');
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setProfileForm({
        fullName: `${parsed.firstName} ${parsed.lastName}`,
        email: parsed.email,
        phone: parsed.phone || ""
      });
      if (parsed.buyerProfile) {
        setPaymentInfo({
          bankName: parsed.buyerProfile.bankName || '',
          accountNumber: parsed.buyerProfile.accountNumber || '',
          accountName: parsed.buyerProfile.accountName || '',
          autopay: parsed.buyerProfile.autopay || false,
        });
      }
      fetchBuyerStats(parsed.id);
      fetchActivities();
      fetchWalletData();
    } else {
      // Redirect to landing page if not authenticated
      window.location.hash = '#home';
    }

    const handleUserUpdate = (event: any) => {
      const userData = event.detail || JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && Object.keys(userData).length > 0) {
        setUser(userData);
        setProfileForm({
          fullName: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone || ""
        });
        if (userData.buyerProfile) {
          setPaymentInfo({
            bankName: userData.buyerProfile.bankName || '',
            accountNumber: userData.buyerProfile.accountNumber || '',
            accountName: userData.buyerProfile.accountName || '',
            autopay: userData.buyerProfile.autopay || false,
          });
        }
      }
    };

    window.addEventListener('user-updated', handleUserUpdate);

    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);

    // Set up polling for unread messages count every 15 seconds
    const statsInterval = setInterval(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        fetchUnreadCount(parsed.id);
      }
    }, 15000);

    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
      mq.removeEventListener('change', update);
      clearInterval(statsInterval);
    };
  }, [user?.id]);

  useEffect(() => {
    if (isMobile && isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      return;
    }
    localStorage.setItem('buyer_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isMobile, isSidebarCollapsed]);

  const fetchUnreadCount = async (userId: string) => {
    try {
      const response = await api.get(`/buyers/${userId}/stats`);
      if (response.data && response.data.unreadMessages !== undefined) {
        setStats(prev => {
          if (prev.unreadMessages === response.data.unreadMessages) return prev;
          return { ...prev, unreadMessages: response.data.unreadMessages };
        });
      }
    } catch (error) {
      console.warn('Failed to fetch unread count:', error);
    }
  };

  const fetchWalletData = async () => {
    try {
      const response = await api.get('/wallet');
      if (response.data && response.data.wallet) {
        setWallet(response.data.wallet);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const formatNaira = (amount: number | string) => {
    return `₦${formatAmount(amount)}`;
  };

  const safeJsonParse = (str: string | null | undefined, fallback: any = {}) => {
    if (!str) return fallback;
    try {
      // If it's already an object (though the DB says string, Prisma might parse it sometimes or it might be mock data)
      if (typeof str === 'object') return str;
      return JSON.parse(str);
    } catch (e) {
      console.warn('JSON Parse Error:', e, 'on string:', str);
      return fallback;
    }
  };

  const fetchBuyerStats = async (userId: string) => {
    try {
      setIsFetchingStats(true);
      const response = await api.get(`/buyers/${userId}/stats`);
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching buyer stats:', error);
    } finally {
      setIsFetchingStats(false);
    }
  };

  const fetchBuyerActivities = async (userId: string, type: SubTabType, page: number = 1) => {
    try {
      setIsFetchingActivities(prev => ({ ...prev, [type]: true }));
      const limit = 10;
      const response = await api.get(`/buyers/${userId}/activities?type=${type}&page=${page}&limit=${limit}`);
      if (response.data) {
        setActivities(prev => ({ ...prev, [type]: response.data.data }));
        setActivitiesPagination(prev => ({
          ...prev,
          [type]: {
            page: response.data.pagination.page,
            totalPages: response.data.pagination.totalPages,
            total: response.data.pagination.total
          }
        }));
      }
    } catch (error) {
      console.error(`Error fetching buyer ${type}:`, error);
    } finally {
      setIsFetchingActivities(prev => ({ ...prev, [type]: false }));
    }
  };

  const fetchActivities = async () => {
    if (!user?.id) return;
    await Promise.all([
      fetchBuyerActivities(user.id, 'purchases'),
      fetchBuyerActivities(user.id, 'offers'),
      fetchBuyerActivities(user.id, 'inspections')
    ]);
  };

  const handleSubTabChange = (tab: SubTabType) => {
    setActiveSubTab(tab);
    if (user?.id) {
      fetchBuyerActivities(user.id, tab);
    }
  };

  const handlePageChange = (type: SubTabType, newPage: number) => {
    if (user?.id && newPage >= 1 && newPage <= activitiesPagination[type].totalPages) {
      fetchBuyerActivities(user.id, type, newPage);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab, activeSubTab]);

  const handleTabChange = async (tab: TabType) => {
    if (tab === activeTab) return;
    
    setIsTabSwitching(true);
    
    setActiveTab(tab);
    setSelectedInspection(null);
    setSelectedOffer(null);
    setSelectedPurchase(null);
    setIsTabSwitching(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    window.location.hash = '#home';
    window.location.reload();
  };

  const handleDownloadReceipt = (purchase: any) => {
    const data = {
      invoiceNo: `H1-${purchase.vehicleName?.split(' ')[0] || 'Auto'}`,
      seller: {
        name: purchase.seller?.name || 'N/A',
        phone: 'N/A',
        email: 'N/A'
      },
      middleman: {
        name: 'Huce Autos',
        phone: '2349493493232',
        email: 'support@huceautos.com'
      },
      buyer: {
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || 'N/A',
        email: user.email
      },
      car: {
        name: purchase.car?.title || 'N/A',
        image: purchase.car?.images?.[0] || '',
        vin: purchase.car?.vin || 'N/A',
        mileage: purchase.car?.mileage ? `${formatAmount(purchase.car.mileage)} Miles` : 'N/A',
        condition: purchase.car?.condition || 'Used',
        purchaseDate: new Date(purchase.createdAt).toLocaleDateString()
      },
      summation: {
        subTotal: purchase.amount,
        discount: '0.00',
        total: purchase.amount
      }
    };
    setReceiptData(data);
    setShowReceiptModal(true);
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.fullName.trim()) {
      setErrors({ ...errors, fullName: 'Full name is required' });
      return;
    }
    setIsUpdatingProfile(true);
    try {
      const [firstName, ...lastNameParts] = profileForm.fullName.split(' ');
      const response = await api.put(`/users/${user.id}`, {
        firstName,
        lastName: lastNameParts.join(' '),
        phone: profileForm.phone
      });
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('user-updated', { detail: response.data.user }));
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSavePasswords = async () => {
    if (!passwords.current || !passwords.new) {
      setErrors({
        currentPassword: !passwords.current ? 'Current password is required' : undefined,
        newPassword: !passwords.new ? 'New password is required' : undefined
      });
      return;
    }
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(passwords.new)) {
      setErrors({ ...errors, newPassword: 'Password must be 8+ alphanumeric characters' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setPasswords({ current: '', new: '' });
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSavePaymentInfo = async () => {
    setIsSavingPaymentInfo(true);
    try {
      const response = await api.put('/users/payment-info', paymentInfo);
      
      // Update local state and storage with new profile data
      const updatedUser = { ...user, buyerProfile: response.data.buyerProfile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
      
      toast.success('Payment information saved');
    } catch (error) {
      toast.error('Failed to save payment information');
    } finally {
      setIsSavingPaymentInfo(false);
    }
  };

  if (!user) return null;

  const containerStyle: React.CSSProperties = {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: isMobile ? '0 16px' : '0 64px',
    display: 'flex',
    gap: isMobile ? '16px' : '33px',
    paddingTop: isMobile ? '16px' : '78px',
    paddingBottom: isMobile ? '24px' : '80px',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'flex-start',
    width: '100%',
  };

  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '100%' : (isSidebarCollapsed ? '92px' : '319.1px'),
    height: 'fit-content',
    background: isSidebarCollapsed && !isMobile ? '#FAFCFB' : '#FFFFFF',
    border: isSidebarCollapsed && !isMobile ? '1px solid #D9E8E0' : '1px solid #E2E8F9',
    boxShadow: isSidebarCollapsed && !isMobile
      ? '0px 6px 18px rgba(0, 92, 50, 0.08), 0px 1px 3px rgba(16, 24, 40, 0.06)'
      : '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
    borderRadius: isMobile ? '15px' : '21.7568px',
    flexShrink: 0,
    transition: 'width 0.2s ease',
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    background: '#FFFFFF',
    border: '1px solid #E2E8F9',
    boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
    borderRadius: '15px',
    padding: isMobile ? '12px' : (activeTab === 'wallet' ? '40px 33px 33px' : '58px 33px 33px'),
    minHeight: isMobile ? 'auto' : '966px',
    width: '100%',
    overflow: 'auto',
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Lexend'
  };

  if (isFetchingStats && !stats.purchases) {
    return (
      <div style={containerStyle}>
        <div style={sidebarStyle}>
          <div style={{ padding: isMobile ? '20px' : '40px 32px' }}>
            <SkeletonLoader className="h-12 w-12 rounded-full mb-6" />
            <SkeletonLoader className="h-6 w-3/4 mb-12" />
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonLoader key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <div style={mainContentStyle}>
          <div style={{ padding: isMobile ? '24px 16px' : '62px 55px' }}>
            <SkeletonLoader className="h-10 w-64 mb-10" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-[20px] border border-[#E2E8F9] flex items-center gap-4">
                  <SkeletonLoader className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <SkeletonLoader className="h-4 w-20" />
                    <SkeletonLoader className="h-7 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'messages' && selectedChat) {
      return (
        <ChatDetailView 
          contactId={selectedChat.senderId}
          contactName={selectedChat.senderName}
          contactRole={selectedChat.senderRole}
          onBack={() => setSelectedChat(null)}
          userType="buyer"
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <>
            <h2 style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '24px', lineHeight: '145%', color: '#000000', marginBottom: '35px' }}>
              Home
            </h2>
            <div style={{ marginBottom: '41px' }}>
              <h1 style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '22px', lineHeight: '145%', color: '#000000', marginBottom: '2px' }}>
                Welcome Back, {user.firstName}!
              </h1>
              <p style={{ fontFamily: 'Lexend', fontWeight: 300, fontSize: '14.4119px', lineHeight: '145%', color: '#999999' }}>
                Ready to find your next car? Explore saved listings, check offers, or start a new search.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: isMobile ? '20px' : '24px' }}>
              {isFetchingStats ? (
                <StatsGridSkeleton count={5} />
              ) : (
                <>
                  <StatsCard number={stats.purchases.toString()} label="Purchases" icon={<InvoiceIcon />} />
                  <StatsCard 
                    number={stats.offers.total.toString()} 
                    label="Offers" 
                    icon={<InvoiceIcon />} 
                    badge1={`${stats.offers.accepted} Offers Accepted`} 
                    badge2={`${stats.offers.rejected} Offers Rejected`} 
                  />
                  <StatsCard number={stats.savedCars.toString()} label="Car Saved" icon={<HeartIcon />} />
                  <StatsCard number={stats.inspections.toString()} label="Inspection" icon={<InvoiceIcon />} />
                  <StatsCard 
                    number={stats.unreadMessages.toString()} 
                    label="Message" 
                    icon={<ChatIcon />} 
                    badge1={`${stats.unreadMessages} Unread Message`} 
                  />
                </>
              )}
            </div>
          </>
        );
      case 'activities':
        if (selectedOffer) {
          return (
            <div>
              <h2 style={{ 
                fontFamily: 'Lexend', 
                fontWeight: 600, 
                fontSize: '32px', 
                lineHeight: '145%', 
                color: '#000000',
                marginBottom: '24px'
              }}>
                Inspection , Offers , Purchases
              </h2>
              
              <button 
                onClick={() => setSelectedOffer(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Lexend',
                  fontSize: '18px',
                  color: '#999999',
                  marginBottom: '32px'
                }}
              >
                <ArrowLeftIcon />
                Back
              </button>

              <div style={{ 
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '40px',
                border: '1px solid #F5F5F5'
              }}>
                <h3 style={{ 
                  fontFamily: 'Lexend', 
                  fontWeight: 600, 
                  fontSize: '24px', 
                  color: '#000000',
                  marginBottom: '32px'
                }}>
                  Offer for {selectedOffer.car.title}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)', gap: isMobile ? '16px' : '32px', marginBottom: '32px' }}>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Car Details</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{selectedOffer.car.title}</p>
                      <button 
                        onClick={() => {
                          // TODO: Navigate to car detail page when implemented
                          // window.location.hash = `#car-detail/${selectedOffer.car.id}`;
                          setSelectedCar(selectedOffer.car);
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#E6F2EB',
                          border: 'none',
                          borderRadius: '4px',
                          color: '#005C32',
                          fontFamily: 'Lexend',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        View Car Details
                      </button>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Seller's Name:</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{selectedOffer.seller?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Offer Amount</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{formatNaira(selectedOffer.amount)}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Offer Date</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                      {new Date(selectedOffer.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspection Date</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>N/A</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Offer Status</p>
                    <div style={{ 
                      display: 'inline-flex',
                      padding: '6px 16px',
                      background: '#E6F2EB',
                      borderRadius: '12px',
                      color: '#005C32',
                      fontFamily: 'Lexend',
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}>
                      {selectedOffer.status.toLowerCase()}
                    </div>
                  </div>
                </div>

                {selectedOffer.status === 'COUNTERED' && (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '16px' : '32px', marginBottom: '40px' }}>
                    <div>
                      <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Seller's Counter Offer Amount</p>
                      <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{formatNaira(selectedOffer.counterOffer || 0)}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Seller's Counter Offer Date</p>
                      <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                        {selectedOffer.updatedAt ? new Date(selectedOffer.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ height: '1px', background: '#F5F5F5', marginBottom: '40px' }} />

                <h4 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>Car Overview</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '24px' : '60px', marginBottom: '40px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {[
                      { label: 'CarType', value: selectedOffer.car?.bodyType || 'N/A', icon: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2' },
                      { label: 'Mileage', value: selectedOffer.car?.mileage ? `${formatAmount(selectedOffer.car.mileage)} Miles` : 'N/A', icon: 'M12 2v3M12 19v3M5 12H2m20 0h-3m-1 7l-2-2m-8-8L4 5m0 14l2-2m8-8l2-2' },
                      { label: 'Fuel Type', value: selectedOffer.car?.fuelType || 'N/A', icon: 'M3 22h12M18 5v17M14 7l-1 1h-2l-1-1V5l1-1h2l1 1v2z' },
                      { label: 'Year', value: selectedOffer.car?.year?.toString() || 'N/A', icon: 'M19 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 10h18M7 2v4M17 2v4' },
                      { label: 'Transmission', value: selectedOffer.car?.transmission || 'N/A', icon: 'M5 12h14M12 5v14' },
                      { label: 'Drive Type', value: selectedOffer.car?.driveType ? selectedOffer.car.driveType.replace(/_/g, ' ') : 'N/A', icon: 'M12 2v20M2 12h20' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DetailIcon d={item.icon} />
                        <div>
                          <p style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>{item.label}</p>
                          <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666', textTransform: 'capitalize' }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {[
                      { label: 'Condition', value: selectedOffer.car?.condition || 'Used', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
                      { label: 'Door', value: selectedOffer.car?.doors ? `${selectedOffer.car.doors} Doors` : '4 Doors', icon: 'M3 3h18v18H3zM9 3v18' },
                      { label: 'Color', value: selectedOffer.car?.color || 'N/A', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z' },
                      { label: 'VIN', value: selectedOffer.car?.vin || 'N/A', icon: 'M4 7h16M4 12h16M4 17h16' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DetailIcon d={item.icon} />
                        <div>
                          <p style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>{item.label}</p>
                          <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h4 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>Features</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '16px' : '40px', marginBottom: '48px' }}>
                  {(() => {
                    const featuresList = typeof selectedOffer.car?.features === 'string' 
                      ? safeJsonParse(selectedOffer.car.features, []) 
                      : (selectedOffer.car?.features || []);
                    
                    if (!featuresList || featuresList.length === 0) {
                      return <p style={{ fontFamily: 'Lexend', color: '#999999' }}>No features listed</p>;
                    }

                    const perColumn = Math.ceil(featuresList.length / 4);
                    const columns = [
                      { title: 'Interior', items: featuresList.slice(0, perColumn) },
                      { title: 'Safety', items: featuresList.slice(perColumn, perColumn * 2) },
                      { title: 'Exterior', items: featuresList.slice(perColumn * 2, perColumn * 3) },
                      { title: 'Comfort & Convenience', items: featuresList.slice(perColumn * 3) },
                    ];

                    return columns.map((group, idx) => (
                      group.items.length > 0 && (
                        <div key={idx}>
                          <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000', marginBottom: '16px' }}>{group.title}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {group.items.map((item: string, i: number) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckIcon />
                                <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ));
                  })()}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  {selectedOffer.status === 'ACCEPTED' && (
                    <button 
                      onClick={() => {
                        setOfferToPay(selectedOffer);
                        setShowPaymentModal(true);
                      }}
                      style={{
                        padding: '16px 40px',
                        background: '#005C32',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        border: 'none',
                        fontFamily: 'Lexend',
                        fontSize: '18px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      Purchase Cars
                    </button>
                  )}
                  {selectedOffer.status === 'COUNTERED' && (
                    <button 
                      onClick={async () => {
                        setIsAcceptingOffer(selectedOffer.id);
                        try {
                          await api.post(`/offers/${selectedOffer.id}/accept`);
                          toast.success('Counter offer accepted successfully!');
                          // Refresh data
                          if (user?.id) {
                            fetchBuyerActivities(user.id, 'offers', activitiesPagination.offers.page);
                            fetchBuyerStats(user.id);
                          }
                          setSelectedOffer(null);
                        } catch (error: any) {
                          toast.error(error.response?.data?.error || 'Failed to accept counter offer');
                        } finally {
                          setIsAcceptingOffer(null);
                        }
                      }}
                      disabled={isAcceptingOffer === selectedOffer.id}
                      style={{
                        padding: '16px 40px',
                        background: '#005C32',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        border: 'none',
                        fontFamily: 'Lexend',
                        fontSize: '18px',
                        fontWeight: 600,
                        cursor: isAcceptingOffer === selectedOffer.id ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: isAcceptingOffer === selectedOffer.id ? 0.7 : 1
                      }}
                    >
                      {isAcceptingOffer === selectedOffer.id ? <Spinner size="sm" variant="white" /> : null}
                      {isAcceptingOffer === selectedOffer.id ? 'Accepting...' : 'Accept Counter'}
                    </button>
                  )}
                  <button 
                    onClick={async () => {
                      const action = selectedOffer.status === 'COUNTERED' ? 'decline' : 'cancel';
                      if (window.confirm(`Are you sure you want to ${action} this offer?`)) {
                        setIsCancellingOffer(selectedOffer.id);
                        try {
                          const endpoint = selectedOffer.status === 'COUNTERED' ? 'reject' : 'cancel';
                          await api.post(`/offers/${selectedOffer.id}/${endpoint}`);
                          toast.success(`Offer ${action}ed successfully`);
                          setSelectedOffer(null);
                          // Refresh data
                          if (user?.id) {
                            fetchBuyerActivities(user.id, 'offers', activitiesPagination.offers.page);
                            fetchBuyerStats(user.id);
                          }
                        } catch (error) {
                          toast.error(`Failed to ${action} offer`);
                        } finally {
                          setIsCancellingOffer(null);
                        }
                      }
                    }}
                    disabled={isCancellingOffer === selectedOffer.id}
                    style={{
                      padding: '16px 40px',
                      background: '#F5C2B1',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      border: 'none',
                      fontFamily: 'Lexend',
                      fontSize: '18px',
                      fontWeight: 600,
                      cursor: isCancellingOffer === selectedOffer.id ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isCancellingOffer === selectedOffer.id ? 0.7 : 1
                    }}
                  >
                    {isCancellingOffer === selectedOffer.id ? <Spinner size="sm" variant="white" /> : null}
                    {isCancellingOffer === selectedOffer.id ? 'Processing...' : (selectedOffer.status === 'COUNTERED' ? 'Decline Counter' : 'Cancel Offer')}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedCar(selectedOffer.car);
                      const initialPrice = selectedOffer.status === 'COUNTERED' 
                        ? (selectedOffer.counterOffer ? `N${formatAmount(selectedOffer.counterOffer)}` : `N${formatAmount(selectedOffer.amount)}`)
                        : `N${formatAmount(selectedOffer.amount)}`;
                      setInitialOfferPrice(initialPrice);
                      setShowMakeOfferModal(true);
                    }}
                    style={{
                      padding: '16px 40px',
                      background: '#FFFFFF',
                      color: '#999999',
                      borderRadius: '12px',
                      border: '1px solid #999999',
                      fontFamily: 'Lexend',
                      fontSize: '18px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Make New Offer
                  </button>
                </div>
              </div>
            </div>
          );
        }
        if (selectedPurchase) {
          return (
            <div>
              <h2 style={{ 
                fontFamily: 'Lexend', 
                fontWeight: 600, 
                fontSize: '32px', 
                lineHeight: '145%', 
                color: '#000000',
                marginBottom: '24px'
              }}>
                Inspection , Offers , Purchases
              </h2>
              
              <button 
                onClick={() => setSelectedPurchase(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Lexend',
                  fontSize: '18px',
                  color: '#999999',
                  marginBottom: '32px'
                }}
              >
                <ArrowLeftIcon />
                Back
              </button>

              <div style={{ 
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '40px',
                border: '1px solid #E2E8F9'
              }}>
                <h3 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '24px', color: '#000000', marginBottom: '32px' }}>
                  Purchase for {selectedPurchase.description || selectedPurchase.car?.title || 'Vehicle Purchase'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: isMobile ? '16px' : '24px', marginBottom: '40px' }}>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Car Details</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{selectedPurchase.description || selectedPurchase.car?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Seller's Name:</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{selectedPurchase.seller?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Purchase Amount</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{formatNaira(selectedPurchase.amount)}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Purchase Date</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                      {new Date(selectedPurchase.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Purchase Status</p>
                    <div style={{ 
                      display: 'inline-flex',
                      padding: '4px 12px',
                      background: selectedPurchase.status === 'SUCCESS' ? '#F0F9F4' : '#FFF9F0',
                      borderRadius: '12px',
                      color: selectedPurchase.status === 'SUCCESS' ? '#005C32' : '#FF9500',
                      fontFamily: 'Lexend',
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}>
                      {selectedPurchase.status === 'SUCCESS' ? 'Paid' : (selectedPurchase.status?.toLowerCase() || 'Pending')}
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', background: '#F5F5F5', marginBottom: '40px' }} />

                <h4 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>Car Overview</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '24px' : '60px', marginBottom: '40px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {[
                      { label: 'CarType', value: selectedPurchase.car?.bodyType || 'N/A', icon: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2' },
                      { label: 'Mileage', value: selectedPurchase.car?.mileage ? `${formatAmount(selectedPurchase.car.mileage)} Miles` : 'N/A', icon: 'M12 2v3M12 19v3M5 12H2m20 0h-3m-1 7l-2-2m-8-8L4 5m0 14l2-2m8-8l2-2' },
                      { label: 'Fuel Type', value: selectedPurchase.car?.fuelType || 'N/A', icon: 'M3 22h12M18 5v17M14 7l-1 1h-2l-1-1V5l1-1h2l1 1v2z' },
                      { label: 'Year', value: selectedPurchase.car?.year?.toString() || 'N/A', icon: 'M19 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 10h18M7 2v4M17 2v4' },
                      { label: 'Transmission', value: selectedPurchase.car?.transmission || 'N/A', icon: 'M5 12h14M12 5v14' },
                      { label: 'Drive Type', value: selectedPurchase.car?.driveType ? selectedPurchase.car.driveType.replace(/_/g, ' ') : 'N/A', icon: 'M12 2v20M2 12h20' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DetailIcon d={item.icon} />
                        <div>
                          <p style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>{item.label}</p>
                          <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666', textTransform: 'capitalize' }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {[
                      { label: 'Condition', value: selectedPurchase.car?.condition || 'Used', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
                      { label: 'Door', value: selectedPurchase.car?.doors ? `${selectedPurchase.car.doors} Doors` : '4 Doors', icon: 'M3 3h18v18H3zM9 3v18' },
                      { label: 'Color', value: selectedPurchase.car?.color || 'N/A', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z' },
                      { label: 'VIN', value: selectedPurchase.car?.vin || 'N/A', icon: 'M4 7h16M4 12h16M4 17h16' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DetailIcon d={item.icon} />
                        <div>
                          <p style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>{item.label}</p>
                          <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h4 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>Features</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '16px' : '40px', marginBottom: '48px' }}>
                  {(() => {
                    const featuresList = typeof selectedPurchase.car?.features === 'string' 
                      ? safeJsonParse(selectedPurchase.car.features, []) 
                      : (selectedPurchase.car?.features || []);
                    
                    if (!featuresList || featuresList.length === 0) {
                      return <p style={{ fontFamily: 'Lexend', color: '#999999' }}>No features listed</p>;
                    }

                    // Group features if they are not already grouped
                    // For now, let's just display them in a few columns
                    const perColumn = Math.ceil(featuresList.length / 4);
                    const columns = [
                      { title: 'Interior', items: featuresList.slice(0, perColumn) },
                      { title: 'Safety', items: featuresList.slice(perColumn, perColumn * 2) },
                      { title: 'Exterior', items: featuresList.slice(perColumn * 2, perColumn * 3) },
                      { title: 'Comfort & Convenience', items: featuresList.slice(perColumn * 3) },
                    ];

                    return columns.map((group, idx) => (
                      group.items.length > 0 && (
                        <div key={idx}>
                          <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000', marginBottom: '16px' }}>{group.title}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {group.items.map((item: string, i: number) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckIcon />
                                <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ));
                  })()}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  {selectedPurchase.status?.toUpperCase() === 'PAID' || selectedPurchase.status?.toUpperCase() === 'COMPLETED' ? (
                    <>
                      <button 
                        onClick={() => handleDownloadReceipt(selectedPurchase)}
                        style={{
                          padding: '16px 40px',
                          background: '#005C32',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          border: 'none',
                          fontFamily: 'Lexend',
                          fontSize: '18px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Download Receipt
                      </button>
                      <button 
                        style={{
                          padding: '16px 40px',
                          background: '#FFFFFF',
                          color: '#999999',
                          borderRadius: '12px',
                          border: '1px solid #999999',
                          fontFamily: 'Lexend',
                          fontSize: '18px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Raise a Dispute
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setOfferToPay(selectedPurchase);
                          setShowConfirmPurchaseStepModal(true);
                        }}
                        style={{
                          padding: '16px 40px',
                          background: '#005C32',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          border: 'none',
                          fontFamily: 'Lexend',
                          fontSize: '18px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Confirm Purchase
                      </button>
                      <button 
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to cancel this purchase?')) {
                            setIsCancellingOffer(selectedPurchase.id);
                            try {
                              await api.post(`/purchases/${selectedPurchase.id}/cancel`);
                              toast.success('Purchase cancelled successfully');
                              setSelectedPurchase(null);
                              if (user?.id) {
                                fetchBuyerActivities(user.id, 'purchases', activitiesPagination.purchases.page);
                                fetchBuyerStats(user.id);
                              }
                            } catch (error) {
                              toast.error('Failed to cancel purchase');
                            } finally {
                              setIsCancellingOffer(null);
                            }
                          }
                        }}
                        disabled={isCancellingOffer === selectedPurchase.id}
                        style={{
                          padding: '16px 40px',
                          background: '#F5C2B1',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          border: 'none',
                          fontFamily: 'Lexend',
                          fontSize: '18px',
                          fontWeight: 600,
                          cursor: isCancellingOffer === selectedPurchase.id ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          opacity: isCancellingOffer === selectedPurchase.id ? 0.7 : 1
                        }}
                      >
                        {isCancellingOffer === selectedPurchase.id ? <Spinner size="sm" variant="white" /> : null}
                        {isCancellingOffer === selectedPurchase.id ? 'Cancelling...' : 'Cancel Purchase'}
                      </button>
                      <button 
                        style={{
                          padding: '16px 40px',
                          background: '#FFFFFF',
                          color: '#999999',
                          borderRadius: '12px',
                          border: '1px solid #999999',
                          fontFamily: 'Lexend',
                          fontSize: '18px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Raise a Dispute
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        }
        if (selectedInspection) {
          return (
            <div>
              <h2 style={{ 
                fontFamily: 'Lexend', 
                fontWeight: 600, 
                fontSize: '32px', 
                lineHeight: '145%', 
                color: '#000000',
                marginBottom: '24px'
              }}>
                Inspection , Offers , Purchases
              </h2>
              
              <button 
                onClick={() => setSelectedInspection(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Lexend',
                  fontSize: '18px',
                  color: '#999999',
                  marginBottom: '32px'
                }}
              >
                <ArrowLeftIcon />
                Back
              </button>

              <div style={{ 
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '40px',
                border: '1px solid #F5F5F5'
              }}>
                <h3 style={{ 
                  fontFamily: 'Lexend', 
                  fontWeight: 600, 
                  fontSize: '24px', 
                  color: '#000000',
                  marginBottom: '32px'
                }}>
                  Vehicle Inspection Report
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: isMobile ? '16px' : '32px', marginBottom: '32px' }}>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Car Details</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{selectedInspection.car.title}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Seller's Name</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{selectedInspection.seller?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspection Date | Time</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                      {selectedInspection.scheduledDate ? new Date(selectedInspection.scheduledDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }).replace(' at ', ' | ') : 'TBD'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspection Location</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{selectedInspection.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspector's Name</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{selectedInspection.inspector?.name || selectedInspection.inspectorName || 'TBD'}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: isMobile ? '16px' : '32px', marginBottom: '40px' }}>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspection Amount</p>
                    <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{formatNaira(selectedInspection.fee || 5000)}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Overall Status</p>
                    {(() => {
                      const rating = selectedInspection.score || 0;
                      let statusText = 'Fair';
                      let bgColor = '#FFF8EB';
                      let textColor = '#B27B16';

                      if (rating >= 80) {
                        statusText = 'Excellent';
                        bgColor = '#F0F9F4';
                        textColor = '#005C32';
                      } else if (rating >= 60) {
                        statusText = 'Good';
                        bgColor = '#E6F4FF';
                        textColor = '#003A8C';
                      } else if (rating < 40) {
                        statusText = 'Poor';
                        bgColor = '#FFF1F0';
                        textColor = '#A8071A';
                      }

                      return (
                        <div style={{ 
                          display: 'inline-flex',
                          padding: '4px 12px',
                          background: bgColor,
                          borderRadius: '6px',
                          color: textColor,
                          fontFamily: 'Lexend',
                          fontSize: '12px',
                          fontWeight: 500
                        }}>
                          {statusText}: {rating}%
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div style={{ height: '1px', background: '#F5F5F5', marginBottom: '40px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '24px', marginBottom: '24px' }}>
                  <InspectionCard 
                    title="Exterior" 
                    subTitle="Paint condition, dents, scratches, rust."
                    status={safeJsonParse(selectedInspection.reportData).exterior?.comment || "N/A"}
                    rating={safeJsonParse(selectedInspection.reportData).exterior?.rating || 0}
                    isWarning={safeJsonParse(selectedInspection.reportData).exterior?.rating < 50}
                  />
                  <InspectionCard 
                    title="Interior" 
                    subTitle="Upholstery, dashboard, electronics (e.g., AC, audio system)."
                    status={safeJsonParse(selectedInspection.reportData).interior?.comment || "N/A"}
                    rating={safeJsonParse(selectedInspection.reportData).interior?.rating || 0}
                    isWarning={safeJsonParse(selectedInspection.reportData).interior?.rating < 50}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '24px', marginBottom: '24px' }}>
                  <InspectionCard 
                    title="Engine & Transmission" 
                    subTitle="Engine performance, oil leaks, transmission shifts."
                    status={safeJsonParse(selectedInspection.reportData).engine?.comment || "N/A"}
                    rating={safeJsonParse(selectedInspection.reportData).engine?.rating || 0}
                    isWarning={safeJsonParse(selectedInspection.reportData).engine?.rating < 50}
                  />
                  <InspectionCard 
                    title="Suspension & Brakes" 
                    subTitle="Shock absorbers, brake pads, brake performance."
                    status={safeJsonParse(selectedInspection.reportData).suspension?.comment || "N/A"}
                    rating={safeJsonParse(selectedInspection.reportData).suspension?.rating || 0}
                    isWarning={safeJsonParse(selectedInspection.reportData).suspension?.rating < 50}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '24px', marginBottom: '40px' }}>
                  <InspectionCard 
                    title="Tires & Wheels" 
                    subTitle="Tread depth, alignment, condition of rims."
                    status={safeJsonParse(selectedInspection.reportData).tires?.comment || "N/A"}
                    rating={safeJsonParse(selectedInspection.reportData).tires?.rating || 0}
                    isWarning={safeJsonParse(selectedInspection.reportData).tires?.rating < 50}
                  />
                  <InspectionCard 
                    title="Lights & Electricals" 
                    subTitle="Headlights, indicators, battery, wiring."
                    status={safeJsonParse(selectedInspection.reportData).electrical?.comment || "N/A"}
                    rating={safeJsonParse(selectedInspection.reportData).electrical?.rating || 0}
                    isWarning={safeJsonParse(selectedInspection.reportData).electrical?.rating < 50}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
                  <div>
                    <h4 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '18px', color: '#000000', marginBottom: '16px' }}>
                      Recommendations
                    </h4>
                    <ul style={{ 
                      paddingLeft: '20px', 
                      fontFamily: 'Lexend', 
                      fontSize: '16px', 
                      color: '#999999',
                      lineHeight: '2'
                    }}>
                      {safeJsonParse(selectedInspection.reportData).recommendations?.length > 0 ? 
                        safeJsonParse(selectedInspection.reportData).recommendations.map((rec: string, i: number) => (
                          <li key={i}>{rec}</li>
                        )) : <li>No recommendations provided</li>
                      }
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '18px', color: '#000000', marginBottom: '16px' }}>
                      Photos
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {safeJsonParse(selectedInspection.reportData).photos?.length > 0 ? 
                        safeJsonParse(selectedInspection.reportData).photos.map((photo: string, i: number) => {
                          const photoUrl = photo.startsWith('http') ? photo : `${SERVER_URL}${photo}`;
                          return (
                            <a 
                              key={i} 
                              href={photoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ fontFamily: 'Lexend', fontSize: '16px', color: '#005C32', textDecoration: 'underline' }}
                            >
                              View Image {i + 1}
                            </a>
                          );
                        }) : <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999' }}>No photos available</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <>
            <h2 style={{ 
              fontFamily: 'Lexend', 
              fontWeight: 600, 
              fontSize: '32px', 
              lineHeight: '145%', 
              color: '#000000',
              marginBottom: '40px'
            }}>
              Inspection , Offers , Purchases
            </h2>

            <div style={{ 
              display: 'flex', 
              gap: '32px', 
              borderBottom: '1px solid #E5E5E5',
              marginBottom: '64px',
              paddingBottom: '1px'
            }}>
              {(['inspections', 'offers', 'purchases'] as SubTabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleSubTabChange(tab)}
                  style={{
                    padding: '0 4px 12px 4px',
                    fontFamily: 'Lexend',
                    fontSize: '18px',
                    fontWeight: activeSubTab === tab ? 600 : 500,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: activeSubTab === tab ? '#005C32' : '#999999',
                    position: 'relative',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'inspections' ? 'Inspection' : tab}
                  {activeSubTab === tab && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#005C32',
                      borderRadius: '2px'
                    }} />
                  )}
                </button>
              ))}
            </div>

            {activeSubTab === 'inspections' && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '32px'
                }}>
                  <h3 style={{ 
                    fontFamily: 'Lexend', 
                    fontWeight: 600, 
                    fontSize: '24px', 
                    color: '#000000' 
                  }}>
                    Inspections({activitiesPagination.inspections.total})
                  </h3>
                  
                  <div style={{ position: 'relative', width: '380px' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '16px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#999999',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={inspectionsSearchQuery}
                      onChange={(e) => setInspectionsSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 56px',
                        borderRadius: '12px',
                        border: '1px solid #E5E5E5',
                        fontFamily: 'Lexend',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  {isFetchingActivities.inspections ? (
                    <TableSkeleton rows={5} cols={7} />
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #F5F5F5' }}>
                          {['Inspect ID', 'Car Make', 'Seller Name', 'Inspection Amount', 'Inspection Result', 'Scheduled Time/ Date', 'Status'].map((header) => (
                            <th key={header} style={{ 
                              padding: '16px 8px', 
                              fontFamily: 'Lexend', 
                              fontWeight: 500, 
                              fontSize: '14px', 
                              color: '#999999',
                              whiteSpace: 'nowrap'
                            }}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activities.inspections.length > 0 ? (
                          activities.inspections.map((inspection, index) => (
                            <tr key={inspection.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                              <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                                {formatID(inspection.id)}
                              </td>
                              <td 
                                style={{ 
                                  padding: '24px 8px', 
                                  fontFamily: 'Lexend', 
                                  fontSize: '14px', 
                                  color: '#666666',
                                  cursor: 'pointer'
                                }}
                                onClick={() => setSelectedInspection(inspection)}
                              >
                                {inspection.car.title}
                              </td>
                              <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                                {inspection.seller?.name || "N/A"}
                              </td>
                              <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                                {formatNaira(inspection.fee || 4500)}
                              </td>
                              <td style={{ 
                                padding: '24px 8px', 
                                fontFamily: 'Lexend', 
                                fontSize: '14px', 
                                color: inspection.score ? (inspection.score >= 70 ? '#00A85A' : '#ED0D0D') : '#999999'
                              }}>
                                {inspection.score ? `${inspection.score} %` : '----'}
                              </td>
                              <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                                {inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  hour12: true
                                }).replace(' at ', ',') : '----'}
                              </td>
                              <td style={{ padding: '24px 8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ 
                                    width: '10px', 
                                    height: '10px', 
                                    borderRadius: '50%', 
                                    background: inspection.status === 'COMPLETED' ? '#8BC34A' : '#FFB74D' 
                                  }} />
                                  <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                                    {inspection.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#999999', fontFamily: 'Lexend' }}>
                              You have no scheduled inspections.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                {activitiesPagination.inspections.totalPages > 1 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: '40px',
                    paddingTop: '20px',
                    borderTop: '1px solid #F5F5F5'
                  }}>
                    <button 
                      disabled={activitiesPagination.inspections.page === 1}
                      onClick={() => handlePageChange('inspections', activitiesPagination.inspections.page - 1)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: activitiesPagination.inspections.page === 1 ? '1px solid #E2E8F9' : '1px solid #005C32',
                        background: 'none',
                        color: activitiesPagination.inspections.page === 1 ? '#999999' : '#005C32',
                        fontFamily: 'Lexend',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: activitiesPagination.inspections.page === 1 ? 'not-allowed' : 'pointer'
                      }}>
                      <ArrowLeftIcon />
                      Previous
                    </button>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {(() => {
                        const pages = [];
                        const { page, totalPages } = activitiesPagination.inspections;
                        const maxVisible = 5;
                        
                        if (totalPages <= maxVisible) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else {
                          if (page <= 3) {
                            pages.push(1, 2, 3, '...', totalPages);
                          } else if (page >= totalPages - 2) {
                            pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                          } else {
                            pages.push(1, '...', page, '...', totalPages);
                          }
                        }

                        return pages.map((p, idx) => (
                          <button 
                            key={idx}
                            onClick={() => typeof p === 'number' && handlePageChange('inspections', p)}
                            style={{
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px',
                              border: 'none',
                              background: p === page ? '#E6F2EB' : 'none',
                              color: p === page ? '#005C32' : '#999999',
                              fontFamily: 'Lexend',
                              fontSize: '14px',
                              fontWeight: p === page ? 600 : 400,
                              cursor: p === '...' ? 'default' : 'pointer'
                            }}
                          >
                            {p}
                          </button>
                        ));
                      })()}
                    </div>

                    <button 
                      disabled={activitiesPagination.inspections.page === activitiesPagination.inspections.totalPages}
                      onClick={() => handlePageChange('inspections', activitiesPagination.inspections.page + 1)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: activitiesPagination.inspections.page === activitiesPagination.inspections.totalPages ? '1px solid #E2E8F9' : '1px solid #005C32',
                        background: 'none',
                        color: activitiesPagination.inspections.page === activitiesPagination.inspections.totalPages ? '#999999' : '#005C32',
                        fontFamily: 'Lexend',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: activitiesPagination.inspections.page === activitiesPagination.inspections.totalPages ? 'not-allowed' : 'pointer'
                      }}>
                      Next
                      <ArrowRightIcon />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'offers' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '24px', color: '#000000' }}>
                    Offers({activitiesPagination.offers.total})
                  </h3>
                  <div style={{ position: 'relative', width: '350px' }}>
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={offersSearchQuery}
                      onChange={(e) => setOffersSearchQuery(e.target.value)}
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

                <div style={{ overflowX: 'auto' }}>
                  {isFetchingActivities.offers ? (
                    <TableSkeleton rows={5} cols={8} />
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                          {['Offer ID', 'Car Make', 'Seller Name', 'Offer Amount', 'Offer Date', 'Inspection Result', 'Status', ''].map((header) => (
                            <th key={header} style={{ 
                              textAlign: 'left', 
                              padding: '12px 8px', 
                              fontFamily: 'Lexend', 
                              fontWeight: 500, 
                              fontSize: '14px', 
                              color: '#999999',
                              whiteSpace: 'nowrap'
                            }}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activities.offers.length > 0 ? (
                          activities.offers
                            .filter(offer => 
                              offer.id.toLowerCase().includes(offersSearchQuery.toLowerCase()) ||
                              offer.car?.title?.toLowerCase().includes(offersSearchQuery.toLowerCase())
                            )
                            .map((offer, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #F0F0F0' }}>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                              {formatID(offer.id)}
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                              <span 
                                onClick={() => setSelectedOffer(offer)}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                {offer.car?.title || 'Vehicle'}
                              </span>
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                              {offer.seller?.name || "N/A"}
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                              {formatNaira(offer.amount)}
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                              {new Date(offer.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px' }}>
                              {(() => {
                                // 1. Use inspectionScore from offer if available (provided by backend)
                                let score = offer.inspectionScore;
                                
                                // 2. Fallback: Check offer.car.inspections (should be included by backend)
                                if (score === null || score === undefined) {
                                  const carInspection = offer.car?.inspections?.[0];
                                  if (carInspection && carInspection.status === 'COMPLETED') {
                                    score = carInspection.score;
                                  }
                                }

                                // 3. Second Fallback: search in activities.inspections
                                if (score === null || score === undefined) {
                                  const inspection = activities.inspections.find(i => 
                                    i.carId === offer.carId && i.status === 'COMPLETED'
                                  );
                                  score = inspection?.score;
                                }

                                if (score === null || score === undefined) {
                                  return <span style={{ color: '#999999' }}>------</span>;
                                }

                                // Determine status and color
                                let statusText = 'Excellent';
                                let statusColor = '#005C32';

                                if (score >= 90) {
                                  statusText = 'Excellent';
                                  statusColor = '#005C32';
                                } else if (score >= 70) {
                                  statusText = 'Good';
                                  statusColor = '#82C43C';
                                } else if (score >= 50) {
                                  statusText = 'Fair';
                                  statusColor = '#FFB119';
                                } else {
                                  statusText = 'Poor';
                                  statusColor = '#ED0D0D';
                                }

                                return (
                                  <span style={{ 
                                    color: statusColor,
                                    fontWeight: 500
                                  }}>
                                    {statusText} ({score}%)
                                  </span>
                                );
                              })()}
                            </td>
                            <td style={{ padding: '24px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ 
                                  width: '8px', 
                                  height: '8px', 
                                  borderRadius: '50%', 
                                  background: offer.status === 'ACCEPTED' ? '#82C43C' : '#FFB119' 
                                }} />
                                <span style={{ 
                                  fontFamily: 'Lexend', 
                                  fontSize: '14px', 
                                  color: '#666666',
                                  textTransform: 'capitalize'
                                }}>
                                  {offer.status.toLowerCase()}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '24px 8px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                {offer.status === 'ACCEPTED' && (
                                  <button 
                                    onClick={() => {
                                      setOfferToPay(offer);
                                      setShowPaymentModal(true);
                                    }}
                                    style={{
                                      padding: '10px 24px',
                                      background: '#005C32',
                                      color: '#FFFFFF',
                                      borderRadius: '8px',
                                      border: 'none',
                                      fontFamily: 'Lexend',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    Purchase Cars
                                  </button>
                                )}
                                {offer.status === 'COUNTERED' && (
                                  <button 
                                    onClick={async () => {
                                      try {
                                        await api.post(`/offers/${offer.id}/accept`);
                                        toast.success('Counter offer accepted successfully!');
                                        fetchBuyerActivities(user.id, 'offers', activitiesPagination.offers.page);
                                      } catch (error: any) {
                                        toast.error(error.response?.data?.error || 'Failed to accept counter offer');
                                      }
                                    }}
                                    style={{
                                      padding: '10px 24px',
                                      background: '#005C32',
                                      color: '#FFFFFF',
                                      borderRadius: '8px',
                                      border: 'none',
                                      fontFamily: 'Lexend',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    Accept Counter
                                  </button>
                                )}
                                {offer.status !== 'REJECTED' && offer.status !== 'CANCELLED' && (
                                  <button 
                                    onClick={async () => {
                                      const action = offer.status === 'COUNTERED' ? 'decline' : 'cancel';
                                      if (window.confirm(`Are you sure you want to ${action} this offer?`)) {
                                        try {
                                          const endpoint = offer.status === 'COUNTERED' ? 'reject' : 'cancel';
                                          await api.post(`/offers/${offer.id}/${endpoint}`);
                                          toast.success(`Offer ${action}ed successfully`);
                                          fetchBuyerActivities(user.id, 'offers', activitiesPagination.offers.page);
                                        } catch (error) {
                                          toast.error(`Failed to ${action} offer`);
                                        }
                                      }
                                    }}
                                    style={{
                                      padding: '10px 24px',
                                      background: '#ED0D0D',
                                      color: '#FFFFFF',
                                      borderRadius: '8px',
                                      border: 'none',
                                      fontFamily: 'Lexend',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {offer.status === 'COUNTERED' ? 'Decline Counter' : 'Decline Offer'}
                                  </button>
                                )}
                                {offer.status === 'REJECTED' && (
                                  <span style={{ 
                                    padding: '10px 24px',
                                    color: '#ED0D0D',
                                    fontFamily: 'Lexend',
                                    fontSize: '14px',
                                    fontWeight: 500
                                  }}>
                                    Declined
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} style={{ padding: '48px 0', textAlign: 'center', color: '#666666', fontFamily: 'Lexend' }}>
                            No offers found.
                          </td>
                        </tr>
                      )}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                {activitiesPagination.offers.totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '40px',
                  paddingTop: '20px',
                  borderTop: '1px solid #F5F5F5'
                }}>
                  <button 
                    disabled={activitiesPagination.offers.page === 1}
                    onClick={() => handlePageChange('offers', activitiesPagination.offers.page - 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: activitiesPagination.offers.page === 1 ? '1px solid #E2E8F9' : '1px solid #005C32',
                      background: 'none',
                      color: activitiesPagination.offers.page === 1 ? '#999999' : '#005C32',
                      fontFamily: 'Lexend',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: activitiesPagination.offers.page === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ArrowLeftIcon />
                    Previous
                  </button>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {(() => {
                      const pages = [];
                      const { page, totalPages } = activitiesPagination.offers;
                      const maxVisible = 5;
                      
                      if (totalPages <= maxVisible) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        if (page <= 3) {
                          pages.push(1, 2, 3, '...', totalPages);
                        } else if (page >= totalPages - 2) {
                          pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                        } else {
                          pages.push(1, '...', page, '...', totalPages);
                        }
                      }

                      return pages.map((p, idx) => (
                        <button 
                          key={idx}
                          onClick={() => typeof p === 'number' && handlePageChange('offers', p)}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: 'none',
                            background: p === page ? '#E6F2EB' : 'none',
                            color: p === page ? '#005C32' : '#999999',
                            fontFamily: 'Lexend',
                            fontSize: '14px',
                            fontWeight: p === page ? 600 : 400,
                            cursor: p === '...' ? 'default' : 'pointer'
                          }}
                        >
                          {p}
                        </button>
                      ));
                    })()}
                  </div>

                  <button 
                    disabled={activitiesPagination.offers.page === activitiesPagination.offers.totalPages}
                    onClick={() => handlePageChange('offers', activitiesPagination.offers.page + 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: activitiesPagination.offers.page === activitiesPagination.offers.totalPages ? '1px solid #E2E8F9' : '1px solid #005C32',
                      background: 'none',
                      color: activitiesPagination.offers.page === activitiesPagination.offers.totalPages ? '#999999' : '#005C32',
                      fontFamily: 'Lexend',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: activitiesPagination.offers.page === activitiesPagination.offers.totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                    <ArrowRightIcon />
                  </button>
                </div>
                )}
              </div>
            )}

            {activeSubTab === 'purchases' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '24px', color: '#000000' }}>
                    Purchases({activitiesPagination.purchases.total})
                  </h3>
                  <div style={{ position: 'relative', width: '350px' }}>
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={purchasesSearchQuery}
                      onChange={(e) => setPurchasesSearchQuery(e.target.value)}
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

                <div style={{ overflowX: 'auto' }}>
                  {isFetchingActivities.purchases ? (
                    <TableSkeleton rows={5} cols={7} />
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                          {['Offer ID', 'Car Make', 'Seller Name', 'Purchase Amount', 'Purchase Date', 'Status', ''].map((header) => (
                            <th key={header} style={{ 
                              textAlign: 'left', 
                              padding: '12px 8px', 
                              fontFamily: 'Lexend', 
                              fontWeight: 500, 
                              fontSize: '14px', 
                              color: '#999999',
                              whiteSpace: 'nowrap'
                            }}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activities.purchases.length > 0 ? (
                          activities.purchases
                            .filter(purchase => 
                              purchase.id.toLowerCase().includes(purchasesSearchQuery.toLowerCase()) ||
                              purchase.description?.toLowerCase().includes(purchasesSearchQuery.toLowerCase())
                            )
                            .map((purchase, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #F0F0F0' }}>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                              {formatID(purchase.id)}
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                              <span 
                                onClick={() => setSelectedPurchase(purchase)}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                {purchase.description || purchase.car?.title || 'Vehicle Purchase'}
                              </span>
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                              {purchase.seller?.name || "N/A"}
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                              {formatNaira(purchase.amount)}
                            </td>
                            <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                              {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td style={{ padding: '24px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ 
                                  width: '8px', 
                                  height: '8px', 
                                  borderRadius: '50%', 
                                  background: '#82C43C' 
                                }} />
                                <span style={{ 
                                  fontFamily: 'Lexend', 
                                  fontSize: '14px', 
                                  color: '#666666',
                                  textTransform: 'capitalize'
                                }}>
                                  {purchase.status === 'IN-ESCROW' ? 'In-Escrow' : 'Paid'}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '24px 8px', textAlign: 'right' }}>
                              {purchase.status === 'IN-ESCROW' ? (
                                <button 
                                  onClick={() => setSelectedPurchase(purchase)}
                                  style={{
                                    padding: '10px 24px',
                                    background: '#005C32',
                                    color: '#FFFFFF',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontFamily: 'Lexend',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Confirm Purchase
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleDownloadReceipt(purchase)}
                                  style={{
                                    padding: '10px 24px',
                                    background: '#005C32',
                                    color: '#FFFFFF',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontFamily: 'Lexend',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Download Receipt
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ padding: '48px 0', textAlign: 'center', color: '#666666', fontFamily: 'Lexend' }}>
                            No purchases found.
                          </td>
                        </tr>
                      )}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                {activitiesPagination.purchases.totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '40px',
                  paddingTop: '20px',
                  borderTop: '1px solid #F5F5F5'
                }}>
                  <button 
                    disabled={activitiesPagination.purchases.page === 1}
                    onClick={() => handlePageChange('purchases', activitiesPagination.purchases.page - 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: activitiesPagination.purchases.page === 1 ? '1px solid #E2E8F9' : '1px solid #005C32',
                      background: 'none',
                      color: activitiesPagination.purchases.page === 1 ? '#999999' : '#005C32',
                      fontFamily: 'Lexend',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: activitiesPagination.purchases.page === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ArrowLeftIcon />
                    Previous
                  </button>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {(() => {
                      const pages = [];
                      const { page, totalPages } = activitiesPagination.purchases;
                      const maxVisible = 5;
                      
                      if (totalPages <= maxVisible) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        if (page <= 3) {
                          pages.push(1, 2, 3, '...', totalPages);
                        } else if (page >= totalPages - 2) {
                          pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                        } else {
                          pages.push(1, '...', page, '...', totalPages);
                        }
                      }

                      return pages.map((p, idx) => (
                        <button 
                          key={idx}
                          onClick={() => typeof p === 'number' && handlePageChange('purchases', p)}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: 'none',
                            background: p === page ? '#E6F2EB' : 'none',
                            color: p === page ? '#005C32' : '#999999',
                            fontFamily: 'Lexend',
                            fontSize: '14px',
                            fontWeight: p === page ? 600 : 400,
                            cursor: p === '...' ? 'default' : 'pointer'
                          }}
                        >
                          {p}
                        </button>
                      ));
                    })()}
                  </div>

                  <button 
                    disabled={activitiesPagination.purchases.page === activitiesPagination.purchases.totalPages}
                    onClick={() => handlePageChange('purchases', activitiesPagination.purchases.page + 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: activitiesPagination.purchases.page === activitiesPagination.purchases.totalPages ? '1px solid #E2E8F9' : '1px solid #005C32',
                      background: 'none',
                      color: activitiesPagination.purchases.page === activitiesPagination.purchases.totalPages ? '#999999' : '#005C32',
                      fontFamily: 'Lexend',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: activitiesPagination.purchases.page === activitiesPagination.purchases.totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                    <ArrowRightIcon />
                  </button>
                </div>
                )}
              </div>
            )}
          </>
        );
      case 'saved':
        return <SavedCarsView userType="buyer" />;
      case 'history':
        return <HistoryView userType="buyer" />;
      case 'wallet':
        return <WalletView userType="buyer" paymentInfo={paymentInfo} />;
      case 'messages':
        return <MessagesView onSeeMore={(chat) => setSelectedChat(chat)} userType="buyer" />;
      case 'support':
        return <CustomerSupportView userType="buyer" />;
      case 'profile':
        return (
          <BuyerSettingsView 
            user={user} 
            isMobile={isMobile}
            activeTab={activeSettingsTab}
            setActiveTab={setActiveSettingsTab}
            personalInfo={profileForm}
            setPersonalInfo={setProfileForm}
            isSavingPersonalInfo={isUpdatingProfile}
            onSavePersonalInfo={handleUpdateProfile}
            passwords={passwords}
            setPasswords={setPasswords}
            isSavingPasswords={isUpdatingPassword}
            onSavePasswords={handleSavePasswords}
            paymentInfo={paymentInfo}
            setPaymentInfo={setPaymentInfo}
            isSavingPaymentInfo={isSavingPaymentInfo}
            onSavePaymentInfo={handleSavePaymentInfo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-white min-h-screen">
      {/* Navigation managed by App.tsx */}

      {/* Main Container - max-width 1440px */}
      <div style={containerStyle}>
        {/* Left Sidebar */}
        <div style={sidebarStyle}>
          {/* User Profile Section */}
          {/* Profile Header in Sidebar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isSidebarCollapsed && !isMobile ? '16px 0 24px' : '40px 0',
            gap: isSidebarCollapsed && !isMobile ? '12px' : '24px',
          }}
        >
          {!isMobile && (
            <button
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '16px',
                border: '1px solid #E2E8F9',
                background: '#FFFFFF',
                color: '#005C32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </button>
          )}
          {/* Avatar */}
          <div
            style={{
              width: isSidebarCollapsed && !isMobile ? '60px' : '120px',
              height: isSidebarCollapsed && !isMobile ? '60px' : '120px',
              borderRadius: '50%',
              border: '4px solid #FFFFFF',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              background: '#F0F0F0',
              position: 'relative',
            }}
          >
            <UserAvatar 
              firstName={user.firstName} 
              lastName={user.lastName} 
              avatar={user.avatar}
              className="w-full h-full"
              fallbackClassName="text-2xl"
            />
          </div>

          {/* User Info */}
          {!isSidebarCollapsed && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
              }}
            >
            {/* Name */}
            <div
              style={{
                fontFamily: 'Lexend',
                fontWeight: 600,
                fontSize: '20px',
                color: '#000000',
              }}
            >
              {user.firstName} {user.lastName}
            </div>

            {/* Email and Badge */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: '#999999',
                }}
              >
                {user.email}
              </span>

              {/* Verified Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 12px',
                  background: '#F0F9F4',
                  borderRadius: '100px',
                  fontFamily: 'Lexend',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#005C32',
                }}
              >
                Verified
              </div>
            </div>
            </div>
          )}
        </div>

          {/* Menu Items */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: isSidebarCollapsed && !isMobile ? '0 12px 16px' : '0 23.21px',
            gap: '10px',
          }}
        >
            <MenuItem 
              icon={<HomeIcon />} 
              label="Home" 
              active={activeTab === 'home'} 
              onClick={() => handleTabChange('home')}
              isMobile={isMobile}
              isCollapsed={isSidebarCollapsed && !isMobile}
            />
            <MenuDivider />
            <MenuItem 
              icon={<InvoiceIcon />} 
              label="My Activities" 
              active={activeTab === 'activities'}
              onClick={() => handleTabChange('activities')}
              isMobile={isMobile}
              isCollapsed={isSidebarCollapsed && !isMobile}
            />
            <MenuDivider />
            <MenuItem 
              icon={<HeartIcon />} 
              label="Saved Car" 
              active={activeTab === 'saved'}
              onClick={() => handleTabChange('saved')}
              isMobile={isMobile}
              isCollapsed={isSidebarCollapsed && !isMobile}
            />
            <MenuDivider />
            <MenuItem 
              icon={<CarTimeIcon />} 
              label="Viewed Car History" 
              active={activeTab === 'history'}
              onClick={() => handleTabChange('history')}
              isMobile={isMobile}
              isCollapsed={isSidebarCollapsed && !isMobile}
            />
            <MenuDivider />
            <MenuItem 
              icon={<ChatIcon />} 
              label="Messages" 
              active={activeTab === 'messages'}
              onClick={() => handleTabChange('messages')}
              isMobile={isMobile}
              isCollapsed={isSidebarCollapsed && !isMobile}
            />
            <MenuDivider />
            <MenuItem 
              icon={<WalletIcon />} 
              label="Wallet" 
              active={activeTab === 'wallet'}
              onClick={() => handleTabChange('wallet')}
              isMobile={isMobile}
              isCollapsed={isSidebarCollapsed && !isMobile}
            />
            <MenuDivider />
            <MenuItem 
              icon={<SupportIcon />} 
              label="Customer Support" 
              active={activeTab === 'support'}
              onClick={() => handleTabChange('support')}
              isMobile={isMobile}
              isCollapsed={isSidebarCollapsed && !isMobile}
            />
            <MenuDivider />
            <MenuItem 
              icon={<UserIcon />} 
              label="Profile" 
              active={activeTab === 'profile'}
              onClick={() => handleTabChange('profile')}
              isMobile={isMobile}
              isCollapsed={isSidebarCollapsed && !isMobile}
            />
            <MenuDivider />
            <MenuItem icon={<LogoutIcon />} label="Logout" isLogout onClick={handleLogout} isMobile={isMobile} isCollapsed={isSidebarCollapsed && !isMobile} />
          </div>
        </div>

        {/* Main Content Area */}
        <div style={mainContentStyle} className="relative">
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {renderContent()}
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <AppDownloadSection />

      {/* Footer */}
      <Footer />

      {/* Detail Modal */}
      <DashboardModal
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
        title="Car Details"
      >
        {selectedCar && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ width: '100%', height: '192px', background: '#F0F0F0', borderRadius: '8px' }}></div>
             <h3 style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 500 }}>{selectedCar.name}</h3>
             <p style={{ color: '#005C32', fontWeight: 700, fontSize: '18px', fontFamily: 'Lexend' }}>{selectedCar.price}</p>
             <p style={{ color: '#666666', fontFamily: 'Lexend' }}>
               Detailed specs, condition report, and seller information would appear here.
             </p>
             <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
               <button 
                 style={{ flex: 1, padding: '12px', background: '#005C32', color: '#FFFFFF', borderRadius: '8px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'Lexend' }}
                 onClick={() => setShowMakeOfferModal(true)}
               >
                 Make Offer
               </button>
               <button style={{ flex: 1, padding: '12px', border: '1px solid #E2E8F9', borderRadius: '8px', fontWeight: 500, background: '#FFFFFF', cursor: 'pointer', fontFamily: 'Lexend' }}>Request Inspection</button>
             </div>
          </div>
        )}
      </DashboardModal>

      {/* Make Offer Modal */}
      <MakeOfferModal 
        isOpen={showMakeOfferModal} 
        onClose={() => {
          setShowMakeOfferModal(false);
          setInitialOfferPrice(undefined);
        }}
        carId={selectedCar?.id}
        carName={selectedCar?.name || selectedCar?.title}
        currentPrice={selectedCar?.price}
        initialValue={initialOfferPrice}
        mode="offer"
      />

      {/* Payment Modal - Adapted from MakeOfferModal */}
      <MakeOfferModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        carName={offerToPay?.car?.title || offerToPay?.vehicleName}
        currentPrice={offerToPay?.amount ? formatNaira(offerToPay.amount) : offerToPay?.price}
        mode="payment"
        walletBalance={wallet ? `N${formatAmount(wallet.balance)}` : "N0.00"}
        onProceed={async (method) => {
          console.log('Payment method selected:', method);
          if (method === 'online') {
            try {
              setIsPurchasing(true);
              const response = await api.post('/wallet/paystack/initialize', { 
                amount: offerToPay?.amount,
                metadata: {
                  type: 'purchase',
                  offerId: offerToPay?.id,
                  carId: offerToPay?.carId
                }
              });
              
              if (response.data?.data?.authorization_url) {
                window.location.href = response.data.data.authorization_url;
              } else {
                toast.error('Failed to initialize online payment');
              }
            } catch (error: any) {
              console.error('Payment initialization error:', error);
              toast.error(error.response?.data?.error || 'Failed to initialize payment');
            } finally {
              setIsPurchasing(false);
            }
          } else {
            setShowPaymentModal(false);
            setShowConfirmPurchaseStepModal(true);
          }
        }}
      />

      {/* Confirm Purchase Step Modal - Adapted from MakeOfferModal */}
      <MakeOfferModal 
        isOpen={showConfirmPurchaseStepModal} 
        onClose={() => {
          setShowConfirmPurchaseStepModal(false);
          setShowPaymentModal(true);
        }}
        carName={offerToPay?.car?.title || offerToPay?.vehicleName}
        mode="confirm"
        isSubmitting={isPurchasing}
        onProceed={async () => {
          if (!offerToPay) return;
          
          setIsPurchasing(true);
          try {
            await api.post('/wallet/purchase', { offerId: offerToPay.id });
            setShowConfirmPurchaseStepModal(false);
            setShowConfirmPurchaseModal(true);
            toast.success('Purchase completed successfully!');
            
            // Show feedback modal after 2 seconds
            setTimeout(() => {
              setShowConfirmPurchaseModal(false);
              setShowFeedbackModal(true);
            }, 2000);
            
            // Refresh wallet and activities
            fetchWalletData();
            fetchActivities();
          } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to complete purchase';
            toast.error(message);
          } finally {
            setIsPurchasing(false);
          }
        }}
      />

      {/* Feedback Modal - Adapted from MakeOfferModal */}
      <MakeOfferModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        mode="feedback"
        onSubmitFeedback={(rating, comment) => {
          console.log('Feedback submitted:', { rating, comment });
          setShowFeedbackModal(false);
          toast.success('Thank you for your feedback!');
          setActiveTab('purchases');
        }}
      />

      {/* Receipt Modal - Adapted from MakeOfferModal */}
      <MakeOfferModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        mode="receipt"
        receiptData={receiptData}
      />

      {/* Confirm Purchase Modal */}
      <DashboardModal
        isOpen={showConfirmPurchaseModal}
        onClose={() => setShowConfirmPurchaseModal(false)}
        title="Purchase Successful"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '24px 0' }}>
          <div style={{ width: '64px', height: '64px', background: '#F0F9F4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#005C32' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#000000', fontFamily: 'Lexend' }}>Payment Successful!</h3>
          <p style={{ color: '#666666', fontFamily: 'Lexend' }}>
            You have successfully purchased the {offerToPay?.car?.title || offerToPay?.vehicleName}. The seller has been notified.
          </p>
          <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '24px' }}>
            <button 
              style={{ flex: 1, padding: '12px', border: '1px solid #E2E8F9', borderRadius: '8px', fontWeight: 500, background: '#FFFFFF', cursor: 'pointer', fontFamily: 'Lexend' }}
              onClick={() => setShowConfirmPurchaseModal(false)}
            >
              Close
            </button>
            <button 
              style={{ flex: 1, padding: '12px', background: '#005C32', color: '#FFFFFF', borderRadius: '8px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'Lexend' }}
              onClick={() => {
                setShowConfirmPurchaseModal(false);
                setActiveTab('activities');
                handleSubTabChange('purchases');
              }}
            >
              View Purchases
            </button>
          </div>
        </div>
      </DashboardModal>

      {/* Deposit Modal */}
    </div>
  );
}

// Menu Item Component
function MenuItem({
  icon,
  label,
  active = false,
  isLogout = false,
  onClick,
  isMobile = false,
  isCollapsed = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isLogout?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
  isCollapsed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: '8px',
        width: '100%',
        padding: isCollapsed ? '8px 0' : (isMobile ? '6px' : '10px 8px'),
        border: 'none',
        background: active ? '#F0F9F4' : 'transparent',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '8px', flex: 1 }}>
        {/* Icon Circle */}
        <div
          style={{
            width: isMobile ? '28px' : '32px',
            height: isMobile ? '28px' : '32px',
            background: isLogout ? '#ED0D0D' : (active ? '#005C32' : '#F0F9F4'),
            borderRadius: isMobile ? '14px' : '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isLogout || active ? '#FFFFFF' : '#005C32',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          {icon}
        </div>

        {/* Label */}
        {!isCollapsed && (
          <span
            style={{
              fontFamily: 'Lexend',
              fontWeight: 500,
              fontSize: isMobile ? '11px' : '16px',
              lineHeight: '145%',
              color: active ? '#005C32' : '#060606',
            }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Chevron */}
      {!isLogout && !isCollapsed && (
        <div style={{ color: active ? '#005C32' : '#999999', flexShrink: 0 }}>
          <ChevronRightIcon />
        </div>
      )}
    </button>
  );
}

// Menu Divider Component
function MenuDivider() {
  return (
    <div
      style={{
        width: '100%',
        height: '1px',
        background: '#E2E8F9',
      }}
    />
  );
}

// Stats Card Component
function StatsCard({
  number,
  label,
  icon,
  badge1,
  badge2,
}: {
  number: string;
  label: string;
  icon: React.ReactNode;
  badge1?: string;
  badge2?: string;
}) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: '100%',
        height: '134px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F9',
        borderRadius: '15px',
        padding: '19px 26px',
        position: 'relative',
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: 'Lexend',
          fontWeight: 300,
          fontSize: '38px',
          lineHeight: '48px',
          color: '#060606',
          marginBottom: '10px',
        }}
      >
        {number}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'Lexend',
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: '20px',
          color: '#999999',
          marginBottom: '8px',
        }}
      >
        {label}
      </div>

      {/* Icon Circle */}
      <div
        style={{
          position: 'absolute',
          width: '42px',
          height: '42px',
          right: '26px',
          top: '17px',
          background: '#CCDED6',
          borderRadius: '21px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#005C32',
        }}
      >
        {icon}
      </div>

      {/* Badges */}
      {badge1 && (
        <div
          style={{
            display: 'inline-flex',
            padding: '4.15px 8.29px 4.15px 5.53px',
            background: badge1.includes('Rejected')
              ? 'rgba(217, 63, 22, 0.1)'
              : 'rgba(0, 92, 50, 0.1)',
            borderRadius: '6.91px',
            marginRight: badge2 ? '8px' : '0',
          }}
        >
          <span
            style={{
              fontFamily: 'Lexend',
              fontWeight: 300,
              fontSize: '8.29px',
              lineHeight: '145%',
              color: badge1.includes('Rejected') ? '#D93F16' : '#005C32',
            }}
          >
            {badge1}
          </span>
        </div>
      )}

      {badge2 && (
        <div
          style={{
            display: 'inline-flex',
            padding: '4.15px 8.29px 4.15px 5.53px',
            background: 'rgba(217, 63, 22, 0.1)',
            borderRadius: '6.91px',
          }}
        >
          <span
            style={{
              fontFamily: 'Lexend',
              fontWeight: 300,
              fontSize: '8.29px',
              lineHeight: '145%',
              color: '#D93F16',
            }}
          >
            {badge2}
          </span>
        </div>
      )}
    </div>
  );
}
