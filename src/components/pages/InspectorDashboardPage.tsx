import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navigation } from '../Navigation';
import { Spinner } from '../ui/Spinner';
import { InspectorSettingsView } from './InspectorSettingsView';
import { WalletView } from './WalletView';
import api from '../../lib/api';
import { toast } from 'sonner';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';
import { DashboardModal } from '../modals/DashboardModal';
import { LayoutDashboard, FileSearch, Wallet, User, LogOut, Camera, ChevronRight, ChevronLeft, MessageSquare, Landmark, Search, ArrowLeft, ArrowRight } from 'lucide-react';

// Icon components
const HomeIcon = () => <LayoutDashboard size={18.6} />;
const InspectionIcon = () => <FileSearch size={18.6} />;
const WalletIcon = () => <Wallet size={18.6} />;
const UserIcon = () => <User size={18.6} />;
const LogoutIcon = () => <LogOut size={18.6} />;

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const ChevronRightIcon = () => <ChevronRight size={18.76} />;
const ChevronLeftIcon = () => <ChevronLeft size={18.76} />;
const SearchIcon = () => <Search size={20} />;
const ArrowLeftIcon = () => <ArrowLeft size={18} />;
const ArrowRightIcon = () => <ArrowRight size={18} />;
const ChevronDownIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const BoldIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>;
const ItalicIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>;
const UnderlineIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" x2="20" y1="20" y2="20"/></svg>;
const StrikethroughIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>;
const ListIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
const OrderedListIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>;
const UploadCloudIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#005C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;

const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount).replace('NGN', 'N');
};

const formatID = (id: string | number) => {
  return String(id).padStart(2, '0');
};

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
      background: '#F9FAFB',
      borderRadius: '12px',
      padding: '24px',
      flex: 1
    }}>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'baseline', marginBottom: '8px' }}>
        <h4 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>{title}:</h4>
        <p style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999' }}>{subTitle}</p>
      </div>
      <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#000000', marginBottom: '16px' }}>
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

function InspectionInput({ 
  label, 
  subLabel, 
  value, 
  onChange 
}: { 
  label: string; 
  subLabel: string;
  value: { status: string; score: number };
  onChange: (val: { status: string; score: number }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { label: 'Excellent', score: 100 },
    { label: 'Good', score: 80 },
    { label: 'Fair', score: 50 },
    { label: 'Poor', score: 20 },
    { label: 'Critical', score: 0 },
  ];

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <p style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 500, color: '#000000', marginBottom: '4px' }}>
        {label}: <span style={{ fontWeight: 400, color: '#999999', fontSize: '12px' }}>{subLabel}</span>
      </p>
      <p style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999', marginBottom: '8px' }}>Status</p>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'relative',
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #E2E8F9',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: value.status ? '#060606' : '#999999' }}>
          {value.status ? `${value.status} - ${value.score}%` : 'Select status'}
        </span>
        <ChevronDownIcon />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#FFFFFF',
          border: '1px solid #E2E8F9',
          borderRadius: '8px',
          marginTop: '4px',
          zIndex: 10,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          {options.map((opt) => (
            <div
              key={opt.label}
              onClick={() => {
                onChange({ status: opt.label, score: opt.score });
                setIsOpen(false);
              }}
              style={{
                padding: '12px 16px',
                fontFamily: 'Lexend',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F0F9F4'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {opt.label} - {opt.score}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatsCard({ 
  value, 
  label, 
  icon, 
  badges = [] 
}: { 
  value: string | number; 
  label: string; 
  icon: React.ReactNode; 
  badges?: { text: string; color?: string }[] 
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F9',
      borderRadius: '20px',
      padding: '24px',
      flex: 1,
      minWidth: '280px',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <span style={{
          fontFamily: 'Lexend',
          fontSize: '48px',
          fontWeight: 400,
          color: '#060606',
          lineHeight: 1
        }}>
          {value}
        </span>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: '#F0F9F4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#005C32'
        }}>
          {icon}
        </div>
      </div>
      
      <p style={{
        fontFamily: 'Lexend',
        fontSize: '18px',
        color: '#999999',
        marginBottom: '16px'
      }}>
        {label}
      </p>

      {badges.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {badges.map((badge, i) => (
            <span key={i} style={{
              padding: '4px 12px',
              borderRadius: '6px',
              background: badge.color || '#F0F9F4',
              color: '#005C32',
              fontSize: '10px',
              fontFamily: 'Lexend',
              fontWeight: 500
            }}>
              {badge.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

type TabType = 'home' | 'inspections' | 'wallet' | 'profile';

export function InspectorDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('inspector_sidebar_collapsed');
    if (saved === null) return true;
    return saved === 'true';
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    email: user.email || '',
    phone: user.phone || '',
    officeName: user.inspectorProfile?.officeName || ''
  });

  // Password State
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [isSavingPasswords, setIsSavingPasswords] = useState(false);
  const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);

  const [showAddResultModal, setShowAddResultModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    exterior: { status: 'Good', score: 90 },
    interior: { status: 'Good', score: 90 },
    engine: { status: 'Good', score: 90 },
    suspension: { status: 'Good', score: 90 },
    tires: { status: 'Good', score: 90 },
    lights: { status: 'Good', score: 90 },
    recommendations: '',
    photos: [] as string[]
  });

  const [stats, setStats] = useState({
    totalInspections: 0,
    activeInspections: 0,
    completedInspections: 0,
    revenue: 0,
    unreadMessages: 0
  });

  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, messagesRes] = await Promise.all([
        api.get('/inspections/stats'),
        api.get('/messages/unread/count')
      ]);
      setStats({
        ...statsRes.data,
        unreadMessages: messagesRes.data.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'home') {
      fetchStats();
    }
  }, [activeTab, fetchStats]);

  const [paymentInfo, setPaymentInfo] = useState({
    bankName: user.inspectorProfile?.bankName || '',
    accountNumber: user.inspectorProfile?.accountNumber || '',
    accountName: user.inspectorProfile?.accountName || '',
    autopay: user.inspectorProfile?.autopay || false,
  });

  const [inspectionSubTab, setInspectionSubTab] = useState<'available' | 'active' | 'completed'>('available');
  const [inspectionSearchQuery, setInspectionSearchQuery] = useState('');
  const [inspectionsPagination, setInspectionsPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [inspections, setInspections] = useState<any[]>([]);
  const [isFetchingInspections, setIsFetchingInspections] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const fetchInspections = useCallback(async (page: number = 1) => {
    setIsFetchingInspections(true);
    try {
      let endpoint = '/inspections/inspector';
      if (inspectionSubTab === 'available') {
        endpoint = '/inspections/available';
      }

      const limit = 10;
      const response = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
      let data = response.data;
      
      // The available endpoint might return an array directly or a paginated object
      // Let's handle both for robustness, but prioritize the paginated structure
      const inspectionData = Array.isArray(data) ? data : (data.data || []);
      const pagination = data.pagination || {
        page: page,
        totalPages: Math.ceil(inspectionData.length / limit),
        total: inspectionData.length
      };

      // Filter by sub-tab if not using the 'available' endpoint and it's not already filtered by backend
      let filteredData = inspectionData;
      if (inspectionSubTab === 'active') {
        filteredData = inspectionData.filter((ins: any) => ins.status === 'SCHEDULED' || ins.status === 'IN_PROGRESS');
      } else if (inspectionSubTab === 'completed') {
        filteredData = inspectionData.filter((ins: any) => ins.status === 'COMPLETED');
      }

      setInspections(filteredData);
      setInspectionsPagination({
        page: pagination.page,
        totalPages: pagination.totalPages,
        total: pagination.total
      });
    } catch (error) {
      console.error('Error fetching inspections:', error);
      toast.error('Failed to load inspections');
    } finally {
      setIsFetchingInspections(false);
    }
  }, [inspectionSubTab]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= inspectionsPagination.totalPages) {
      fetchInspections(newPage);
    }
  };

  useEffect(() => {
    if (activeTab === 'inspections') {
      fetchInspections();
    }
  }, [activeTab, fetchInspections]);

  const handleClaimInspection = async (inspectionId: string) => {
    try {
      await api.post(`/inspections/${inspectionId}/assign`);
      toast.success('Inspection claimed successfully!');
      setInspectionSubTab('active');
      fetchInspections();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to claim inspection');
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleUserUpdate = (event: any) => {
      const userData = event.detail || JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && Object.keys(userData).length > 0) {
        setUser(userData);
        setProfileForm({
          fullName: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone || "",
          officeName: userData.inspectorProfile?.officeName || ""
        });
        if (userData.inspectorProfile) {
          setPaymentInfo({
            bankName: userData.inspectorProfile.bankName || '',
            accountNumber: userData.inspectorProfile.accountNumber || '',
            accountName: userData.inspectorProfile.accountName || '',
            autopay: userData.inspectorProfile.autopay || false,
          });
        }
      }
    };

    window.addEventListener('user-updated', handleUserUpdate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    if (isMobile && isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      return;
    }
    localStorage.setItem('inspector_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isMobile, isSidebarCollapsed]);

  const handleSavePersonalInfo = async () => {
    setIsSavingPersonalInfo(true);
    try {
      const [firstName, ...lastNameParts] = profileForm.fullName.split(' ');
      const response = await api.put(`/users/${user.id}`, {
        firstName,
        lastName: lastNameParts.join(' '),
        phone: profileForm.phone,
        email: profileForm.email,
        officeName: profileForm.officeName
      });

      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingPersonalInfo(false);
    }
  };

  const handleSavePasswords = async () => {
    setIsSavingPasswords(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      toast.success('Password updated successfully');
      setPasswords({ current: '', new: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsSavingPasswords(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsTabSwitching(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTabSwitching(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    window.location.hash = '#home';
    window.location.reload();
  };

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

  const handleProceedReport = async () => {
     if (!selectedInspection) return;
 
     try {
       const payload = {
         exteriorScore: reportForm.exterior.score,
         interiorScore: reportForm.interior.score,
         engineScore: reportForm.engine.score,
         suspensionScore: reportForm.suspension.score,
         tiresScore: reportForm.tires.score,
         lightsScore: reportForm.lights.score,
         exteriorStatus: reportForm.exterior.status,
         interiorStatus: reportForm.interior.status,
         engineStatus: reportForm.engine.status,
         suspensionStatus: reportForm.suspension.status,
         tiresStatus: reportForm.tires.status,
         lightsStatus: reportForm.lights.status,
         recommendations: reportForm.recommendations,
         photos: reportForm.photos
       };
 
       await api.post(`/inspections/${selectedInspection.id}/report`, payload);
       toast.success('Inspection report submitted successfully!');
       setShowAddResultModal(false);
       setSelectedInspection(null);
       fetchInspections();
       fetchStats();
     } catch (error: any) {
       toast.error(error.response?.data?.error || 'Failed to submit report');
     }
   };

   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    setIsUploadingPhotos(true);
    try {
      const response = await api.post('/inspections/upload-photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { photoUrls } = response.data;
      setReportForm(prev => ({
        ...prev,
        photos: [...prev.photos, ...photoUrls]
      }));
      toast.success('Photos uploaded successfully');
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <InspectorSettingsView 
          user={user}
          isMobile={isMobile}
          personalInfo={profileForm}
          setPersonalInfo={setProfileForm}
          isSavingPersonalInfo={isSavingPersonalInfo}
          onSavePersonalInfo={handleSavePersonalInfo}
          passwords={passwords}
          setPasswords={setPasswords}
          isSavingPasswords={isSavingPasswords}
          onSavePasswords={handleSavePasswords}
          paymentInfo={paymentInfo}
          setPaymentInfo={setPaymentInfo}
        />
      );
    }

    if (activeTab === 'wallet') {
      return <WalletView userType="inspector" />;
    }

    if (activeTab === 'inspections') {
      if (selectedInspection) {
        return (
          <div style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'Lexend', fontSize: '32px', fontWeight: 600, color: '#060606' }}>
                Inspection
              </h2>
              <button 
                onClick={() => setShowAddResultModal(true)}
                style={{
                  background: '#005C32',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: 'Lexend',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Add Result
              </button>
            </div>

            <button 
              onClick={() => setSelectedInspection(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#999999',
                fontFamily: 'Lexend',
                fontSize: '18px',
                cursor: 'pointer',
                marginBottom: '32px',
                padding: 0
              }}
            >
              <ArrowLeftIcon />
              Back
            </button>

            <h3 style={{ fontFamily: 'Lexend', fontSize: '24px', fontWeight: 600, color: '#000000', marginBottom: '40px' }}>
              Vehicle Inspection Report
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', marginBottom: '32px' }}>
              <div>
                <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Car Details</p>
                <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                  {selectedInspection.car?.year} {selectedInspection.car?.make} {selectedInspection.car?.model}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Customer Name:</p>
                <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                  {selectedInspection.buyer ? `${selectedInspection.buyer.firstName} ${selectedInspection.buyer.lastName}` : 'N/A'}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspection Date | Time</p>
                <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                  {selectedInspection.scheduledDate ? new Date(selectedInspection.scheduledDate).toLocaleDateString() : 'TBD'}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspection Location</p>
                <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                  {selectedInspection.location || 'Abuja, Nigeria'}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspector's Name</p>
                <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', color: '#000000' }}>
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '48px', marginBottom: '40px' }}>
              <div>
                <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999', marginBottom: '8px' }}>Inspection Earnings</p>
                <p style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '24px', color: '#000000' }}>{formatNaira(selectedInspection.fee || 5000)}</p>
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

            <div style={{ height: '1px', background: '#E2E8F9', marginBottom: '40px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <InspectionCard 
                title="Exterior" 
                subTitle="Paint condition, dents, scratches, rust."
                status={selectedInspection.report?.exteriorStatus || "Nill"}
                rating={selectedInspection.report?.exteriorScore || 0}
                isWarning={(selectedInspection.report?.exteriorScore || 0) < 50}
              />
              <InspectionCard 
                title="Interior" 
                subTitle="Upholstery, dashboard, electronics (e.g., AC, audio system)."
                status={selectedInspection.report?.interiorStatus || "Nill"}
                rating={selectedInspection.report?.interiorScore || 0}
                isWarning={(selectedInspection.report?.interiorScore || 0) < 50}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <InspectionCard 
                title="Engine & Transmission" 
                subTitle="Engine performance, oil leaks, transmission shifts."
                status={selectedInspection.report?.engineStatus || "Nill"}
                rating={selectedInspection.report?.engineScore || 0}
                isWarning={(selectedInspection.report?.engineScore || 0) < 50}
              />
              <InspectionCard 
                title="Suspension & Brakes" 
                subTitle="Shock absorbers, brake pads, brake performance."
                status={selectedInspection.report?.suspensionStatus || "Nill"}
                rating={selectedInspection.report?.suspensionScore || 0}
                isWarning={(selectedInspection.report?.suspensionScore || 0) < 50}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
              <InspectionCard 
                title="Tires & Wheels" 
                subTitle="Tread depth, alignment, condition of rims."
                status={selectedInspection.report?.tiresStatus || "Nill"}
                rating={selectedInspection.report?.tiresScore || 0}
                isWarning={(selectedInspection.report?.tiresScore || 0) < 50}
              />
              <InspectionCard 
                title="Lights & Electricals" 
                subTitle="Headlights, indicators, battery, wiring."
                status={selectedInspection.report?.lightsStatus || "Nill"}
                rating={selectedInspection.report?.lightsScore || 0}
                isWarning={(selectedInspection.report?.lightsScore || 0) < 50}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h4 style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 600, color: '#000000', marginBottom: '24px' }}>Recommendations</h4>
                <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666', lineHeight: '1.6' }}>
                  {selectedInspection.report?.recommendations || "No recommendations yet."}
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: 'Lexend', fontSize: '20px', fontWeight: 600, color: '#000000', marginBottom: '24px' }}>Photos</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {selectedInspection.report?.photos?.length > 0 ? (
                    selectedInspection.report.photos.map((photo: string, i: number) => (
                      <img 
                        key={i} 
                        src={`${api.defaults.baseURL?.replace('/api', '')}${photo}`} 
                        alt="Car" 
                        style={{ width: '120px', height: '120px', borderRadius: '8px', objectFit: 'cover' }} 
                      />
                    ))
                  ) : (
                    <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#999999' }}>No photos uploaded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div style={{ maxWidth: '1200px' }}>
          <h2 style={{ 
            fontFamily: 'Lexend', 
            fontSize: '32px', 
            fontWeight: 600, 
            color: '#060606',
            marginBottom: '40px'
          }}>
            Inspection
          </h2>

          {/* Sub-Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '32px', 
            borderBottom: '1px solid #E2E8F9',
            marginBottom: '40px'
          }}>
            {['available', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setInspectionSubTab(tab as 'available' | 'active' | 'completed')}
                style={{
                  padding: '0 4px 12px 4px',
                  fontFamily: 'Lexend',
                  fontSize: '18px',
                  fontWeight: inspectionSubTab === tab ? 600 : 500,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: inspectionSubTab === tab ? '#005C32' : '#999999',
                  position: 'relative',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
                {inspectionSubTab === tab && (
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

          {/* Table Title and Search */}
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
              color: '#060606' 
            }}>
              {inspectionSubTab.charAt(0).toUpperCase() + inspectionSubTab.slice(1)}({inspectionsPagination.total})
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
                value={inspectionSearchQuery}
                onChange={(e) => setInspectionSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 56px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F9',
                  fontFamily: 'Lexend',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #F5F5F5' }}>
                  {['Inspect ID', 'Car Make', 'Seller/Buyer Name', 'Earnings', 'Result', 'Schedule/ Date', 'Status', 'Action'].map((header) => (
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
                {inspections.map((inspection, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                      {formatID(inspection.id.substring(0, 4))}
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
                      {inspection.car?.year} {inspection.car?.make} {inspection.car?.model}
                    </td>
                    <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                      {inspection.buyer ? `${inspection.buyer.firstName} ${inspection.buyer.lastName}` : 'N/A'}
                    </td>
                    <td style={{ padding: '24px 8px', fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                      {formatNaira(inspection.fee || 5000)}
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
                      {inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleDateString() : 'TBD'}
                    </td>
                    <td style={{ padding: '24px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          background: inspection.status === 'COMPLETED' ? '#8BC34A' : 
                                     inspection.status === 'SCHEDULED' ? '#2196F3' : '#FFB74D' 
                        }} />
                        <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666666' }}>
                          {inspection.status.charAt(0) + inspection.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '24px 8px' }}>
                      {inspectionSubTab === 'available' ? (
                        <button
                          onClick={() => handleClaimInspection(inspection.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#005C32',
                            color: '#FFFFFF',
                            borderRadius: '6px',
                            border: 'none',
                            fontFamily: 'Lexend',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          Claim
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedInspection(inspection)}
                          style={{
                            padding: '6px 12px',
                            background: '#F0F9F4',
                            color: '#005C32',
                            borderRadius: '6px',
                            border: 'none',
                            fontFamily: 'Lexend',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {inspections.length === 0 && !isFetchingInspections && (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#999999', fontFamily: 'Lexend' }}>
                      No inspections found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {inspectionsPagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid #F5F5F5'
            }}>
              <button 
                disabled={inspectionsPagination.page === 1}
                onClick={() => handlePageChange(inspectionsPagination.page - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: inspectionsPagination.page === 1 ? '1px solid #E2E8F9' : '1px solid #005C32',
                  background: 'none',
                  color: inspectionsPagination.page === 1 ? '#999999' : '#005C32',
                  fontFamily: 'Lexend',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: inspectionsPagination.page === 1 ? 'not-allowed' : 'pointer'
                }}>
                <ArrowLeftIcon />
                Previous
              </button>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {(() => {
                  const pages = [];
                  const { page, totalPages } = inspectionsPagination;
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
                      onClick={() => typeof p === 'number' && handlePageChange(p)}
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
                disabled={inspectionsPagination.page === inspectionsPagination.totalPages}
                onClick={() => handlePageChange(inspectionsPagination.page + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: inspectionsPagination.page === inspectionsPagination.totalPages ? '1px solid #E2E8F9' : '1px solid #005C32',
                  background: 'none',
                  color: inspectionsPagination.page === inspectionsPagination.totalPages ? '#999999' : '#005C32',
                  fontFamily: 'Lexend',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: inspectionsPagination.page === inspectionsPagination.totalPages ? 'not-allowed' : 'pointer'
                }}>
                Next
                <ArrowRightIcon />
              </button>
            </div>
          )}
        </div>
      );
    }

    // Default: Home Tab
    return (
      <div style={{ maxWidth: '1200px' }}>
        <h2 style={{ 
          fontFamily: 'Lexend', 
          fontSize: '24px', 
          fontWeight: 600, 
          color: '#060606',
          marginBottom: '32px'
        }}>
          Home
        </h2>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
                fontFamily: 'Lexend', 
                fontSize: '32px', 
                fontWeight: 600, 
                color: '#060606',
                marginBottom: '8px'
              }}>
                Welcome Back, {user.firstName || 'Inspection Officer'}
              </h1>
          <p style={{ 
            fontFamily: 'Lexend', 
            fontSize: '16px', 
            color: '#999999'
          }}>
            Manage your Inspection
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <StatsCard 
            value={stats.totalInspections}
            label="Total Inspection"
            icon={<Landmark size={24} />}
            badges={[
              { text: `${stats.activeInspections} Active Inspection` },
              { text: `${stats.completedInspections} Completed Inspection(s)`, color: '#E2E8F9' }
            ]}
          />
          <StatsCard 
            value={formatNaira(stats.revenue)}
            label="Revenue"
            icon={<Wallet size={24} />}
          />
          <StatsCard 
            value={stats.unreadMessages}
            label="Message"
            icon={<MessageSquare size={24} />}
            badges={[
              { text: `${stats.unreadMessages} Unread Message` }
            ]}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-white min-h-screen">
      <div style={containerStyle}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          {/* User Profile Section */}
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
              icon={<InspectionIcon />} 
              label="Inspections" 
              active={activeTab === 'inspections'} 
              onClick={() => handleTabChange('inspections')}
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
        <div style={mainContentStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Add Result Modal */}
      <DashboardModal
        isOpen={showAddResultModal}
        onClose={() => setShowAddResultModal(false)}
        title="Add Result"
      >
        <div style={{ padding: '0 24px 24px 24px' }}>
          <button 
            onClick={() => setShowAddResultModal(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#999999',
              fontFamily: 'Lexend',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '24px',
              padding: 0
            }}
          >
            <ArrowLeftIcon />
            Back
          </button>

          <h3 style={{ 
            fontFamily: 'Lexend', 
            fontSize: '24px', 
            fontWeight: 600, 
            color: '#000000', 
            textAlign: 'center',
            marginBottom: '32px' 
          }}>
            Add Result
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px', 
            marginBottom: '32px' 
          }}>
            <InspectionInput 
              label="Exterior" 
              subLabel="Paint condition, dents, scratches, rust." 
              value={reportForm.exterior}
              onChange={(val) => setReportForm({ ...reportForm, exterior: val })}
            />
            <InspectionInput 
              label="Interior" 
              subLabel="Upholstery, dashboard, electronics (e.g., AC, audio system)." 
              value={reportForm.interior}
              onChange={(val) => setReportForm({ ...reportForm, interior: val })}
            />
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px', 
            marginBottom: '32px' 
          }}>
            <InspectionInput 
              label="Engine & Transmission" 
              subLabel="Engine performance, oil leaks, transmission shifts." 
              value={reportForm.engine}
              onChange={(val) => setReportForm({ ...reportForm, engine: val })}
            />
            <InspectionInput 
              label="Suspension & Brakes" 
              subLabel="Shock absorbers, brake pads, brake performance." 
              value={reportForm.suspension}
              onChange={(val) => setReportForm({ ...reportForm, suspension: val })}
            />
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px', 
            marginBottom: '32px' 
          }}>
            <InspectionInput 
              label="Tires & Wheels" 
              subLabel="Tread depth, alignment, condition of rims." 
              value={reportForm.tires}
              onChange={(val) => setReportForm({ ...reportForm, tires: val })}
            />
            <InspectionInput 
              label="Lights & Electricals" 
              subLabel="Headlights, indicators, battery, wiring" 
              value={reportForm.lights}
              onChange={(val) => setReportForm({ ...reportForm, lights: val })}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 500, color: '#000000', marginBottom: '12px' }}>Recommendations</p>
            <div style={{ 
              border: '1px solid #E2E8F9',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <textarea 
                value={reportForm.recommendations}
                onChange={(e) => setReportForm({ ...reportForm, recommendations: e.target.value })}
                placeholder="Enter Description"
                style={{ 
                  width: '100%',
                  padding: '16px',
                  minHeight: '180px',
                  fontFamily: 'Lexend',
                  fontSize: '14px',
                  color: '#060606',
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <div style={{ 
                padding: '12px 16px',
                borderTop: '1px solid #F5F5F5',
                display: 'flex',
                gap: '16px',
                color: '#666666'
              }}>
                <BoldIcon />
                <ItalicIcon />
                <UnderlineIcon />
                <StrikethroughIcon />
                <ListIcon />
                <OrderedListIcon />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontFamily: 'Lexend', fontSize: '14px', fontWeight: 500, color: '#000000', marginBottom: '12px' }}>Photos</p>
            
            {/* Display Uploaded Photos */}
            {reportForm.photos.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {reportForm.photos.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                    <img 
                      src={`${api.defaults.baseURL?.replace('/api', '')}${url}`} 
                      alt="Uploaded" 
                      style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} 
                    />
                    <button
                      onClick={() => setReportForm(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== idx)
                      }))}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ED0D0D',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div 
              onClick={() => photoInputRef.current?.click()}
              style={{ 
                border: '1px dashed #E2E8F9',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoUpload}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
              />
              {isUploadingPhotos ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Spinner size="md" color="green" />
                  <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#005C32' }}>Uploading...</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                    <UploadCloudIcon />
                  </div>
                  <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#000000' }}>
                    Drag & Drop or <span style={{ color: '#005C32', textDecoration: 'underline' }}>choose file</span> to upload
                  </p>
                  <p style={{ fontFamily: 'Lexend', fontSize: '12px', color: '#999999', marginTop: '4px' }}>
                    Supported formats: Jpeg, Png
                  </p>
                </>
              )}
            </div>
          </div>

          <button 
            style={{
              width: '100%',
              background: '#005C32',
              color: '#FFFFFF',
              padding: '16px',
              borderRadius: '8px',
              border: 'none',
              fontFamily: 'Lexend',
              fontWeight: 600,
              fontSize: '18px',
              cursor: 'pointer'
            }}
            onClick={handleProceedReport}
          >
            Proceed
          </button>
        </div>
      </DashboardModal>
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
