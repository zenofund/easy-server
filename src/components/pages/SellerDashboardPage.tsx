import { formatAmount, formatID } from '../../lib/formatters';
import { SkeletonLoader, StatsGridSkeleton, TableSkeleton } from '../ui/SkeletonLoader';
import { Navigation } from '../Navigation';
import { AppDownloadSection } from '../sections/AppDownloadSection';
import { Footer } from '../Footer';
import userAvatar from 'figma:asset/f77a7b555b924e5721574d1e5d638013bc02125d.png';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DashboardModal } from '../modals/DashboardModal';
import { MultiStepListingModal } from '../modals/MultiStepListingModal';
import { UpgradePlanModal, SubscriptionPlan } from '../modals/UpgradePlanModal';
import { jsPDF } from 'jspdf';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';
import { SellerCarDetailView } from './SellerCarDetailView';
import { SellerOffersView } from './SellerOffersView';
import { MessagesView } from './MessagesView';
import { ChatDetailView } from './ChatDetailView';
import { WalletView } from './WalletView';
import { CustomerSupportView } from './CustomerSupportView';
import { SellerSettingsView } from './SellerSettingsView';
import { Spinner } from '../ui/Spinner';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';

// Icon components using inline SVG
const HomeIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CarIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const InvoiceIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const TagIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const ChatIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const WalletIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="10" y1="16" x2="10" y2="16" />
    <line x1="14.5" y1="16" x2="17.5" y2="16" />
  </svg>
);

const SupportIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18.76" height="18.76" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="18.76" height="18.76" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

type TabType = 'home' | 'listings' | 'offers' | 'wallet' | 'messages' | 'support' | 'settings';
type ListingTabType = 'Active' | 'Sold';

const formatShortPrice = (amount: number) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K`;
  }
  return formatAmount(amount);
};

const formatNaira = (amount: number) => {
  return `₦${formatShortPrice(amount)}`;
};

export function SellerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeListingTab, setActiveListingTab] = useState<ListingTabType>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('seller_sidebar_collapsed');
    if (saved === null) return true;
    return saved === 'true';
  });
  const [showListingModal, setShowListingModal] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCarForDetail, setSelectedCarForDetail] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    activeOffers: 0,
    totalRevenue: 0,
    unreadMessages: 0,
    totalViews: 0,
    revenueEarned: 500, // Dummy data for now, will be fetched
    withdrawnRevenue: 500,
    pendingRevenue: 500
  });

  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '', companyName: '', phone: '' });
  const [paymentInfo, setPaymentInfo] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    autopay: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me');
        if (response.data) {
          const userData = response.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          setProfileForm({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            companyName: userData.sellerProfile?.companyName || '',
            phone: userData.phone || ''
          });

          if (userData.sellerProfile) {
            setPaymentInfo({
              bankName: userData.sellerProfile.bankName || '',
              accountNumber: userData.sellerProfile.accountNumber || '',
              accountName: userData.sellerProfile.accountName || '',
              autopay: userData.sellerProfile.autopay || false,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to local storage if API fails
        const localUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (localUser) {
          setUser(localUser);
          setProfileForm({
            firstName: localUser.firstName,
            lastName: localUser.lastName,
            email: localUser.email,
            companyName: localUser.sellerProfile?.companyName || '',
            phone: localUser.phone || ''
          });
          if (localUser.sellerProfile) {
            setPaymentInfo({
              bankName: localUser.sellerProfile.bankName || '',
              accountNumber: localUser.sellerProfile.accountNumber || '',
              accountName: localUser.sellerProfile.accountName || '',
              autopay: localUser.sellerProfile.autopay || false,
            });
          }
        }
      }
    };

    fetchUserData();

    const handleUserUpdate = (event: any) => {
      const userData = event.detail || JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && Object.keys(userData).length > 0) {
        setUser(userData);
        setProfileForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          companyName: userData.sellerProfile?.companyName || '',
          phone: userData.phone || '',
        });
        // Update payment info state when user data is updated
        if (userData.sellerProfile) {
          setPaymentInfo({
            bankName: userData.sellerProfile.bankName || '',
            accountNumber: userData.sellerProfile.accountNumber || '',
            accountName: userData.sellerProfile.accountName || '',
            autopay: userData.sellerProfile.autopay || false,
          });
        }
      }
    };

    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await api.get('/sellers/subscription-plans');
        setPlans(response.data);
      } catch (error) {
        setPlans([
          {
            id: 'free',
            name: 'Free Plan',
            price: '0',
            duration: 30,
            features: ['Add up to 5 listings', 'Standard visibility'],
            listingLimit: 5,
            featuredListings: 0,
            prioritySupport: false,
            analyticsAccess: false
          },
          {
            id: 'pro',
            name: 'Pro Plan',
            price: '15000',
            duration: 30,
            features: ['Add up to 30 listings', 'Detailed analytics', 'Featured Listings'],
            listingLimit: 30,
            featuredListings: 5,
            prioritySupport: true,
            analyticsAccess: true
          },
          {
            id: 'premium',
            name: 'Premium Plan',
            price: '50000',
            duration: 30,
            features: ['Unlimited listings', 'Premium visibility', 'Advanced analytics'],
            listingLimit: 999999,
            featuredListings: 20,
            prioritySupport: true,
            analyticsAccess: true
          }
        ]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setProfileForm({
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        email: parsed.email || '',
        companyName: parsed.sellerProfile?.companyName || '',
        phone: parsed.phone || '',
      });
      // Initialize payment info from localStorage
      if (parsed.sellerProfile) {
        setPaymentInfo({
          bankName: parsed.sellerProfile.bankName || '',
          accountNumber: parsed.sellerProfile.accountNumber || '',
          accountName: parsed.sellerProfile.accountName || '',
          autopay: parsed.sellerProfile.autopay || false,
        });
      }
      fetchSellerData(parsed.id, currentPage);
    } else {
      // Redirect to landing page if not authenticated
      window.location.hash = '#home';
    }
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
      mq.removeEventListener('change', update);
      clearInterval(statsInterval);
    };
  }, []);

  const fetchUnreadCount = async (userId: string) => {
    try {
      const messagesResponse = await api.get('/messages');
      if (messagesResponse.data) {
        const unreadCount = messagesResponse.data.filter((m: any) => !m.read && m.receiverId === userId).length;
        setStats(prev => {
          if (prev.unreadMessages === unreadCount) return prev;
          return { ...prev, unreadMessages: unreadCount };
        });
      }
    } catch (error) {
      console.warn('Failed to fetch unread count:', error);
    }
  };

  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isOpeningModal, setIsOpeningModal] = useState<string | null>(null);

  const fetchSellerData = async (userId: string, page: number = 1, showSkeleton: boolean = false) => {
    // Only set fetching state if it's the first load, if page changes, or if explicitly requested
    if (!myListings.length || page !== currentPage || showSkeleton) {
      setIsFetchingData(true);
    }
    try {
      const itemsPerPage = 10;
      
      // Fetch all data in parallel for better performance
      const [carsResponse, revenueResponse, messagesResponse] = await Promise.all([
        api.get(`/sellers/${userId}?page=${page}&limit=${itemsPerPage}`),
        api.get(`/sellers/${userId}/revenue`).catch(err => {
          console.warn('Failed to fetch revenue stats:', err);
          return { data: null };
        }),
        api.get('/messages').catch(err => {
          console.warn('Failed to fetch messages:', err);
          return { data: null };
        })
      ]);

      // Process Cars Data
      if (carsResponse.data && carsResponse.data.cars) {
        const cars = carsResponse.data.cars;
        setMyListings(cars);
        setPagination(carsResponse.data.pagination);
        
        const totalViews = cars.reduce((acc: number, car: any) => acc + (car.views || 0), 0);
        const totalRevenue = cars
          .filter((car: any) => car.status === 'SOLD')
          .reduce((acc: number, car: any) => acc + Number(car.price), 0);
        const activeOffers = cars.reduce((acc: number, car: any) => acc + (car._count?.offers || 0), 0);

        setStats(prev => ({ 
          ...prev, 
          totalListings: carsResponse.data.pagination.total,
          activeListings: carsResponse.data.pagination.active || 0,
          soldListings: carsResponse.data.pagination.sold || 0,
          totalViews,
          totalRevenue,
          activeOffers
        }));
      }

      // Process Revenue Data
      if (revenueResponse.data) {
        setStats(prev => ({
          ...prev,
          revenueEarned: revenueResponse.data.revenueEarned,
          withdrawnRevenue: revenueResponse.data.withdrawnRevenue,
          pendingRevenue: revenueResponse.data.pendingRevenue,
        }));
      }

      // Process Messages Data
      if (messagesResponse.data) {
        const unreadCount = messagesResponse.data.filter((m: any) => !m.read && m.receiverId === userId).length;
        setStats(prev => ({ ...prev, unreadMessages: unreadCount }));
      }

    } catch (error: any) {
      console.error('Error fetching seller data', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        handleLogout();
      }
    } finally {
      setIsFetchingData(false);
    }
  };

  const [isTabSwitching, setIsTabSwitching] = useState(false);
   const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.name);
    try {
      const response = await api.post('/sellers/subscription/select', { planId: plan.id });
      toast.success(response.data?.message || `${plan.name} selected successfully!`);
      const me = await api.get('/users/me');
      const updatedUser = me.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
      setShowUpgradeModal(false);
    } catch (error: any) {
      const code = error.response?.data?.code;
      if (code === 'DOWNGRADE_NOT_ALLOWED') {
        toast.error('Downgrades are not allowed.');
      } else if (code === 'CURRENT_PLAN') {
        toast.error('You are already on this plan.');
      } else if (code === 'INSUFFICIENT_WALLET_BALANCE') {
        toast.error('Insufficient wallet balance for this upgrade.');
      } else {
        toast.error(error.response?.data?.error || 'Failed to change subscription plan.');
      }
    } finally {
      setSelectedPlan(null);
    }
  };

   const handleLogout = () => {
     localStorage.removeItem('token');
     localStorage.removeItem('user');
     toast.success('Logged out successfully');
     window.location.hash = '#home';
     window.location.reload();
   };

   const handleDeleteListing = (carId: string) => {
     toast('Are you sure you want to request deletion for this listing?', {
       description: 'This will be reviewed by an admin.',
       action: {
         label: 'Delete',
         onClick: async () => {
           setIsDeleting(carId);
           try {
             await api.post(`/cars/${carId}/request-deletion`);
             toast.success('Deletion request sent to admin');
             fetchSellerData(user.id);
           } catch (error) {
             console.error('Error requesting deletion', error);
             toast.error('Failed to send deletion request');
           } finally {
             setIsDeleting(null);
           }
         },
       },
       cancel: {
         label: 'Cancel',
         onClick: () => {},
       },
     });
   };

   const handleEditListing = async (car: any) => {
     setIsOpeningModal(car.id);
     setEditingCar(car);
     setShowListingModal(true);
     setIsOpeningModal(null);
   };

   const getInitials = (firstName: string, lastName: string) => {
     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
   };

   const handlePageChange = (newPage: number) => {
     if (user?.id && newPage >= 1 && newPage <= pagination.pages) {
       setCurrentPage(newPage);
       fetchSellerData(user.id, newPage);
     }
   };

   useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab, activeListingTab]);

  useEffect(() => {
    if (isMobile && isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      return;
    }
    localStorage.setItem('seller_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isMobile, isSidebarCollapsed]);

  const handleTabChange = async (tab: TabType) => {
     if (tab === activeTab) return;
     setIsTabSwitching(true);
     setActiveTab(tab);
     
     // Trigger re-fetch when switching to home or listings to show skeletons
     if ((tab === 'home' || tab === 'listings') && user?.id) {
       fetchSellerData(user.id, currentPage, true);
     }
     
     setIsTabSwitching(false);
   };

  if (!user) return null;

  const containerStyle: React.CSSProperties = {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: isMobile ? '16px' : '0 64px',
    display: 'flex',
    gap: isMobile ? '24px' : '33px',
    paddingTop: isMobile ? '24px' : '78px',
    paddingBottom: isMobile ? '24px' : '80px',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'flex-start',
    width: '100%',
    boxSizing: 'border-box',
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
    background: '#FFFFFF',
    border: '1px solid #E2E8F9',
    boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
    borderRadius: '15px',
    padding: isMobile ? '12px' : (activeTab === 'wallet' ? '40px 33px 33px' : '58px 33px 33px'),
    minHeight: isMobile ? 'auto' : '966px',
    overflow: 'auto',
    position: 'relative',
    width: '100%',
    maxWidth: isMobile ? '100%' : 'none',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Lexend'
  };

  const renderContent = () => {
    if (selectedCarForDetail) {
      return (
        <SellerCarDetailView 
          car={selectedCarForDetail} 
          user={user} 
          onBack={() => {
            setSelectedCarForDetail(null);
            fetchSellerData(user.id); // Refresh data when coming back
          }}
          onEdit={handleEditListing}
          onDelete={handleDeleteListing}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        const revenueChartData = [
          { name: 'Earned', value: stats.revenueEarned, color: '#005C32' },
          { name: 'Withdrawn', value: stats.withdrawnRevenue, color: '#A3C2B4' },
          { name: 'Pending', value: stats.pendingRevenue, color: '#E2E8F9' },
        ];

        return (
          <>
            <h2 style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '24px', lineHeight: '145%', color: '#000000', marginBottom: '35px' }}>
              Home
            </h2>
            <div style={{ marginBottom: '41px' }}>
              <h1 style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '22px', lineHeight: '145%', color: '#000000', marginBottom: '2px' }}>
                Welcome Back, {user.sellerProfile?.companyName || `${user.firstName} ${user.lastName}`}!
              </h1>
              <p style={{ fontFamily: 'Lexend', fontWeight: 300, fontSize: '14.4119px', lineHeight: '145%', color: '#999999' }}>
                Manage your listings, track offers, and connect with buyers - all from one place.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: isMobile ? '20px' : '24px', marginBottom: '40px' }}>
              {isFetchingData ? (
                <StatsGridSkeleton count={5} />
              ) : (
                <>
                  <StatsCard 
                    number={stats.totalListings.toString()} 
                    label="Total Listings" 
                    icon={<CarIcon />} 
                    badge1={`${stats.activeListings} Active Listings`}
                    badge2={`${stats.soldListings} Sold Listings`}
                  />
                  <StatsCard number={formatNaira(stats.revenueEarned)} label="Revenue" icon={<WalletIcon />} />
                  <StatsCard number={stats.activeOffers.toString()} label="Offers" icon={<InvoiceIcon />} />
                  <StatsCard 
                    number={stats.unreadMessages.toString()} 
                    label="Message" 
                    icon={<ChatIcon />} 
                    badge1={`${stats.unreadMessages} Unread Message`} 
                  />
                  <StatsCard number={stats.totalViews.toString()} label="Total Views" icon={<EyeIcon />} />
                </>
              )}
            </div>

            {/* Revenue Statistics Chart */}
            {isFetchingData ? (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F9',
                borderRadius: '15px',
                padding: '32px',
                maxWidth: '568px',
                height: '304px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <SkeletonLoader className="h-6 w-40" />
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', height: '100%' }}>
                  <SkeletonLoader className="w-[200px] h-[200px] rounded-full" />
                  <div className="flex-1 space-y-4">
                    <SkeletonLoader className="h-6 w-full" />
                    <SkeletonLoader className="h-6 w-full" />
                    <SkeletonLoader className="h-6 w-full" />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F9',
                borderRadius: '15px',
                padding: isMobile ? '20px' : '32px',
                maxWidth: isMobile ? '100%' : '568px'
              }}>
                <h3 style={{ 
                  fontFamily: 'Lexend', 
                  fontWeight: 500, 
                  fontSize: '18px', 
                  color: '#999999',
                  marginBottom: '24px'
                }}>
                  Revenue Statistics
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '40px', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={{ width: isMobile ? '100%' : '240px', height: isMobile ? '200px' : '240px', flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={0}
                          dataKey="value"
                          stroke="none"
                        >
                          {revenueChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                    {revenueChartData.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                          <span style={{ fontFamily: 'Lexend', fontSize: '16px', color: '#000000' }}>{item.name}</span>
                        </div>
                        <span style={{ fontFamily: 'Lexend', fontSize: '16px', color: '#999999' }}>{formatNaira(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Removed Recent Listings section */}
          </>
        );
      case 'listings':
        const filteredListings = myListings.filter(car => {
          const matchesTab = activeListingTab === 'Active' 
            ? car.status === 'AVAILABLE' 
            : car.status === 'SOLD';
          const matchesSearch = car.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              car.model.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesTab && matchesSearch;
        });

        return (
          <div style={{ width: '100%' }}>
            {/* Header */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '10px' }}>
              <h2 style={{ fontFamily: 'Lexend', fontWeight: 'bold', fontSize: isMobile ? '18px' : '24px', color: '#000000', whiteSpace: 'nowrap' }}>
                My Listings
              </h2>
              <button 
                onClick={async () => {
                  setIsOpeningModal('new');
                  await new Promise(resolve => setTimeout(resolve, 600));
                  setShowListingModal(true);
                  setIsOpeningModal(null);
                }}
                disabled={isOpeningModal === 'new'}
                style={{
                  padding: isMobile ? '8px 12px' : '12px 24px',
                  backgroundColor: '#005C32',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: isMobile ? '12px' : '16px',
                  border: 'none',
                  cursor: isOpeningModal === 'new' ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isOpeningModal === 'new' ? 0.8 : 1,
                  transition: 'all 0.2s'
                }}
                className="active:scale-[0.98]"
              >
                {isOpeningModal === 'new' ? <Spinner size="sm" variant="white" /> : <PlusIcon />}
                Add New Listing
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #F0F0F0', marginBottom: '24px' }}>
              {['Active', 'Sold'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveListingTab(tab as ListingTabType)}
                  style={{
                    paddingBottom: '12px',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    fontFamily: 'Lexend',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: activeListingTab === tab ? '#005C32' : '#999999',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {tab}
                  {activeListingTab === tab && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#005C32' }} />
                  )}
                </button>
              ))}
            </div>

            {/* Sub Header & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Lexend', fontWeight: 'bold', fontSize: '20px', color: '#000000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {activeListingTab}
                {isFetchingData ? (
                  <SkeletonLoader className="h-6 w-8" />
                ) : (
                  `(${pagination.total})`
                )}
              </h3>
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
              {isFetchingData ? (
                <TableSkeleton rows={5} cols={8} />
              ) : (
                <table style={{ width: '100%', minWidth: '800px', whiteSpace: 'nowrap', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                      {['Listing ID', 'Car Make', 'Car Model', 'Amount', 'Upload Date', 'Views', 'Listing Status', ''].map((header) => (
                        <th key={header} style={{ textAlign: 'left', padding: '10px 8px', fontSize: '14px', fontWeight: 500, color: '#666666', fontFamily: 'Lexend', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.length > 0 ? (
                      filteredListings.map((car, index) => (
                        <tr key={car.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                          <td style={{ padding: '8px 8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend', whiteSpace: 'nowrap' }}>
                            {formatID(car.id)}
                          </td>
                          <td style={{ padding: '8px 8px', fontSize: '14px', fontWeight: 500, color: '#005C32', fontFamily: 'Lexend', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }} onClick={() => setSelectedCarForDetail(car)}>
                            {car.make}
                          </td>
                          <td style={{ padding: '8px 8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend', whiteSpace: 'nowrap' }}>{car.model}</td>
                          <td style={{ padding: '8px 8px', fontSize: '14px', fontWeight: 500, color: '#000000', fontFamily: 'Lexend', whiteSpace: 'nowrap' }}>
                            {formatNaira(Number(car.price))}
                          </td>
                          <td style={{ padding: '8px 8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend', whiteSpace: 'nowrap' }}>
                            {new Date(car.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '8px 8px', fontSize: '14px', color: '#666666', fontFamily: 'Lexend', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <EyeIcon /> {car.views || 0}
                            </div>
                          </td>
                          <td style={{ padding: '8px 8px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {car.status === 'AVAILABLE' && (
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#82C43C' }} />
                              )}
                              {car.status === 'DELETION_PENDING' && (
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F2994A' }} />
                              )}
                              <span style={{ fontSize: '14px', color: '#666666', textTransform: 'capitalize', fontFamily: 'Lexend' }}>
                                {car.status === 'AVAILABLE' ? 'Active' : 
                                 car.status === 'DELETION_PENDING' ? 'Deletion Pending' : 
                                 car.status.toLowerCase()}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '8px 8px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <button 
                                onClick={() => handleEditListing(car)}
                                disabled={car.status === 'DELETION_PENDING' || isOpeningModal === car.id}
                                style={{
                                  padding: '8px 24px',
                                  backgroundColor: car.status === 'DELETION_PENDING' ? '#F3F4F6' : '#005C32',
                                  color: car.status === 'DELETION_PENDING' ? '#9CA3AF' : '#FFFFFF',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  borderRadius: '8px',
                                  border: 'none',
                                  cursor: (car.status === 'DELETION_PENDING' || isOpeningModal === car.id) ? 'not-allowed' : 'pointer',
                                  fontFamily: 'Lexend',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  opacity: isOpeningModal === car.id ? 0.8 : 1,
                                  transition: 'all 0.2s'
                                }}
                                className="active:scale-[0.98]"
                              >
                                {isOpeningModal === car.id ? <Spinner size="sm" variant="white" /> : 'Edit'}
                              </button>
                              <button 
                                onClick={() => handleDeleteListing(car.id)}
                                disabled={car.status === 'DELETION_PENDING' || isDeleting === car.id}
                                style={{
                                  padding: '8px 24px',
                                  backgroundColor: car.status === 'DELETION_PENDING' ? '#F3F4F6' : '#EFA286',
                                  color: car.status === 'DELETION_PENDING' ? '#9CA3AF' : '#FFFFFF',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  borderRadius: '8px',
                                  border: 'none',
                                  cursor: car.status === 'DELETION_PENDING' || isDeleting === car.id ? 'not-allowed' : 'pointer',
                                  fontFamily: 'Lexend',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  transition: 'all 0.2s'
                                }}
                                className="active:scale-[0.98]"
                              >
                                {isDeleting === car.id ? <Spinner size="sm" variant="white" /> : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ padding: '48px 0', textAlign: 'center', color: '#666666', fontFamily: 'Lexend' }}>
                          No listings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #F0F0F0' }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetchingData}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    border: (currentPage === 1 || isFetchingData) ? '1px solid #E2E8F9' : '1px solid #005C32',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: (currentPage === 1 || isFetchingData) ? '#999999' : '#005C32',
                    background: 'transparent',
                    cursor: (currentPage === 1 || isFetchingData) ? 'not-allowed' : 'pointer',
                    fontFamily: 'Lexend',
                    opacity: (currentPage === 1 || isFetchingData) ? 0.7 : 1,
                    transition: 'all 0.2s',
                    minWidth: '110px',
                    justifyContent: 'center'
                  }}
                  className="active:scale-[0.98]"
                >
                  {isFetchingData && currentPage > 1 ? <Spinner size="sm" /> : <ArrowLeftIcon />}
                  <span>Previous</span>
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(page => {
                      const start = Math.max(1, currentPage - 2);
                      const end = Math.min(pagination.pages, start + 4);
                      return page >= start && page <= end;
                    })
                    .map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={isFetchingData}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: 'none',
                        cursor: isFetchingData ? 'not-allowed' : 'pointer',
                        backgroundColor: currentPage === page ? '#E6F2EB' : 'transparent',
                        color: currentPage === page ? '#005C32' : '#666666',
                        fontFamily: 'Lexend',
                        transition: 'all 0.2s',
                        opacity: isFetchingData && currentPage !== page ? 0.5 : 1
                      }}
                      className="active:scale-[0.98]"
                    >
                      {isFetchingData && currentPage === page ? <Spinner size="sm" /> : page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages || isFetchingData}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    border: (currentPage === pagination.pages || isFetchingData) ? '1px solid #E2E8F9' : '1px solid #005C32',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: (currentPage === pagination.pages || isFetchingData) ? '#999999' : '#005C32',
                    background: 'transparent',
                    cursor: (currentPage === pagination.pages || isFetchingData) ? 'not-allowed' : 'pointer',
                    fontFamily: 'Lexend',
                    opacity: (currentPage === pagination.pages || isFetchingData) ? 0.7 : 1,
                    transition: 'all 0.2s',
                    minWidth: '110px',
                    justifyContent: 'center'
                  }}
                  className="active:scale-[0.98]"
                >
                  <span>Next</span>
                  {isFetchingData && currentPage < pagination.pages ? <Spinner size="sm" /> : <ArrowRightIcon />}
                </button>
              </div>
            )}
          </div>
        );
      case 'offers':
        return <SellerOffersView />;
      case 'wallet':
        return <WalletView userType="seller" paymentInfo={paymentInfo} />;
      case 'messages':
         return (
           selectedChat ? (
             <ChatDetailView 
               contactId={selectedChat.senderId}
               contactName={selectedChat.senderName}
               contactRole={selectedChat.senderRole}
               onBack={() => setSelectedChat(null)}
               userType="seller"
             />
           ) : (
             <MessagesView onSeeMore={(chat) => setSelectedChat(chat)} userType="seller" />
           )
         );
       case 'support':
         return <CustomerSupportView />;
       case 'settings':
       return <SellerSettingsView user={user} isMobile={isMobile} paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} plans={plans} loadingPlans={loadingPlans} onSelectPlan={handlePlanSelect} selectedPlan={selectedPlan} />;
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: isSidebarCollapsed && !isMobile ? '16px 0 24px' : '26.51px 0',
              gap: isSidebarCollapsed && !isMobile ? '12px' : '29.01px',
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
                border: '1px solid #FFFFFF',
                overflow: 'hidden',
                background: '#F0F9F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                  gap: '7.25px',
                  width: '258.7px',
                }}
              >
              {/* Name */}
              <div
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 500,
                  fontSize: '26.1081px',
                  lineHeight: '145%',
                  color: '#000000',
                  textAlign: 'center',
                }}
              >
                {user.sellerProfile?.companyName || `${user.firstName} ${user.lastName}`}
              </div>

              {/* Divider */}
              <div
                style={{
                  width: '229.17px',
                  height: '1px',
                  background: '#E2E8F9',
                }}
              />

              {/* Email and Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14.5px',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                <span
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 300,
                    fontSize: '11.6036px',
                    lineHeight: '145%',
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
                    justifyContent: 'center',
                    padding: '6.56px 13.12px 6.56px 8.75px',
                    background: 'rgba(0, 92, 50, 0.1)',
                    borderRadius: '13.1201px',
                    gap: '4.37px',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M8.33333 2.5L3.75 7.08333L1.66667 5" stroke="#005C32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 500,
                      fontSize: '8.74671px',
                      lineHeight: '13px',
                      color: '#005C32',
                    }}
                  >
                    {user.sellerProfile?.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div style={{ padding: isSidebarCollapsed && !isMobile ? '0 12px 16px' : '0 26.51px 26.51px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8.7px' }}>
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
                icon={<CarIcon />} 
                label="My Listings" 
                active={activeTab === 'listings'}
                onClick={() => handleTabChange('listings')}
                isMobile={isMobile}
                isCollapsed={isSidebarCollapsed && !isMobile}
              />
              <MenuDivider />
              <MenuItem 
                icon={<TagIcon />} 
                label="Offers" 
                active={activeTab === 'offers'}
                onClick={() => handleTabChange('offers')}
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
                label="Wallet/Transactions" 
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
                icon={<SettingsIcon />} 
                label="Settings" 
                active={activeTab === 'settings'}
                onClick={() => handleTabChange('settings')}
                isMobile={isMobile}
                isCollapsed={isSidebarCollapsed && !isMobile}
              />
              <MenuDivider />
              <MenuItem icon={<LogoutIcon />} label="Logout" isLogout onClick={handleLogout} isMobile={isMobile} isCollapsed={isSidebarCollapsed && !isMobile} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={mainContentStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {renderContent()}
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <AppDownloadSection />

      {/* Footer */}
      <Footer />

      {/* Listing Modal */}
      <MultiStepListingModal
        isOpen={showListingModal}
        editCar={editingCar}
        onClose={() => {
          setShowListingModal(false);
          setEditingCar(null);
        }}
        onSuccess={() => {
          setShowListingModal(false);
          setEditingCar(null);
          fetchSellerData(user.id); // Refresh listings
        }}
        onLimitReached={() => {
          setShowListingModal(false);
          setShowUpgradeModal(true);
        }}
      />
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        plans={plans}
        selectedPlan={selectedPlan}
        onSelect={handlePlanSelect}
      />

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
        minHeight: '134px',
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
            background: (badge1.includes('Rejected') || badge1.includes('Sold'))
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
              color: (badge1.includes('Rejected') || badge1.includes('Sold')) ? '#D93F16' : '#005C32',
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
            background: badge2.includes('Sold')
              ? 'rgba(217, 63, 22, 0.1)'
              : 'rgba(0, 92, 50, 0.1)',
            borderRadius: '6.91px',
          }}
        >
          <span
            style={{
              fontFamily: 'Lexend',
              fontWeight: 300,
              fontSize: '8.29px',
              lineHeight: '145%',
              color: badge2.includes('Sold') ? '#D93F16' : '#005C32',
            }}
          >
            {badge2}
          </span>
        </div>
      )}
    </div>
  );
}
