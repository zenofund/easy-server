import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/Spinner';
import { UserAvatar } from '../UserAvatar';
import { useAuth } from '../../context/AuthContext';

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
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

const SuccessCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#005C32" />
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

import { DashboardModal } from '../modals/DashboardModal';
import Cropper from 'react-easy-crop';
import api from '../../lib/api';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { SubscriptionPlan } from '../modals/UpgradePlanModal';
import { formatAmount } from '../../lib/formatters';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
}

interface SellerSettingsViewProps {
  user: any;
  isMobile?: boolean;
  paymentInfo: { bankName: string; accountNumber: string; accountName: string; autopay: boolean };
  setPaymentInfo: React.Dispatch<React.SetStateAction<{ bankName: string; accountNumber: string; accountName: string; autopay: boolean }>>;
  plans: SubscriptionPlan[];
  loadingPlans: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  selectedPlan: string | null;
}

type SettingsTab = 'Profile' | 'Business' | 'Payment' | 'Subscription Plan';

export function SellerSettingsView({ user, isMobile, paymentInfo, setPaymentInfo, plans, loadingPlans, onSelectPlan, selectedPlan }: SellerSettingsViewProps) {
  const [currentUser, setCurrentUser] = useState(user);
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
  const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);
  const [isSavingPasswords, setIsSavingPasswords] = useState(false);
  const [isSavingPaymentInfo, setIsSavingPaymentInfo] = useState(false);
  const [isSavingBusinessInfo, setIsSavingBusinessInfo] = useState(false);
  const [isSavingSubscription, setIsSavingSubscription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar Upload States
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const onCropComplete = (at: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result as string);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCroppedImage = async () => {
    if (!imageToCrop || !croppedAreaPixels || !currentUser) return;

    try {
      setIsUploadingAvatar(true);
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile photo updated successfully');
        setShowCropModal(false);
        setImageToCrop(null);
        // Dispatch event for dashboard to sync
        window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile photo');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Form States
  const [personalInfo, setPersonalInfo] = useState({
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone || "+234 703 404 1184"
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: ''
  });

  const [businessInfo, setBusinessInfo] = useState({
    carLot: user.sellerProfile?.companyName || "",
    address: user.sellerProfile?.address || "",
    nin: user.sellerProfile?.nin || "",
    companyRegNo: user.sellerProfile?.companyRegNo || ""
  });

  const [subscriptionPlan, setSubscriptionPlan] = useState(user?.subscription?.plan?.name || 'Free Plan');

  // Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Bank States
  const [banks, setBanks] = useState<any[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);

  useEffect(() => {
    if (activeTab === 'Payment') {
      fetchBanks();
    }
  }, [activeTab]);

  const fetchBanks = async () => {
    setIsLoadingBanks(true);
    try {
      const response = await api.get('/users/banks');
      if (response.data?.status === true) {
        setBanks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Failed to load banks');
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const resolveAccount = async (accountNumber: string, bankCode: string) => {
    if (accountNumber.length !== 10 || !bankCode) return;

    setIsResolvingAccount(true);
    try {
      const response = await api.get(`/users/resolve-account?accountNumber=${accountNumber}&bankCode=${bankCode}`);
      if (response.data?.status === true) {
        setPaymentInfo(prev => ({ ...prev, accountName: response.data.data.account_name }));
        toast.success('Account resolved successfully');
      } else {
        toast.error(response.data?.message || 'Could not resolve account');
      }
    } catch (error) {
      console.error('Error resolving account:', error);
      toast.error('Failed to resolve account');
    } finally {
      setIsResolvingAccount(false);
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPaymentInfo(prev => ({ ...prev, accountNumber: val }));
    
    const selectedBank = banks.find(b => b.name === paymentInfo.bankName);
    if (val.length === 10 && selectedBank) {
      resolveAccount(val, selectedBank.code);
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bankName = e.target.value;
    setPaymentInfo(prev => ({ ...prev, bankName }));
    
    const selectedBank = banks.find(b => b.name === bankName);
    if (paymentInfo.accountNumber.length === 10 && selectedBank) {
      resolveAccount(paymentInfo.accountNumber, selectedBank.code);
    }
  };

  useEffect(() => {
    const handleUserUpdate = (event: any) => {
      const userData = event.detail || JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && Object.keys(userData).length > 0) {
        setCurrentUser(userData);
        setPersonalInfo({
          fullName: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone || ""
        });
        setBusinessInfo({
          carLot: userData.sellerProfile?.companyName || "",
          address: "Abuja Wuse 2",
          nin: userData.sellerProfile?.nin || "",
          companyRegNo: userData.sellerProfile?.companyRegNo || ""
        });
        if (userData.sellerProfile) {
          setPaymentInfo({
            bankName: userData.sellerProfile.bankName || '',
            accountNumber: userData.sellerProfile.accountNumber || '',
            accountName: userData.sellerProfile.accountName || '',
            autopay: userData.sellerProfile.autopay || false,
          });
        }
        setSubscriptionPlan(userData.subscription?.plan?.name || 'Free Plan');
      }
    };

    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, [setPaymentInfo]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Validation States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // International format: starts with + and followed by 7-15 digits
    return /^\+\d{7,15}$/.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password: string) => {
    // 8+ alphanumeric with at least one letter and one number
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSavePersonalInfo = async () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!validateEmail(personalInfo.email)) newErrors.email = 'Invalid email address';
    if (!validatePhone(personalInfo.phone)) newErrors.phone = 'Use international format (e.g. +234...)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSavingPersonalInfo(true);
    try {
      const [firstName, ...lastNameParts] = personalInfo.fullName.split(' ');
      const response = await api.put(`/users/${currentUser.id}`, {
        firstName,
        lastName: lastNameParts.join(' '),
        phone: personalInfo.phone,
        email: personalInfo.email
      });

      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
        
        toast.success('Personal information updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update personal information');
    } finally {
      setIsSavingPersonalInfo(false);
    }
  };

  const handleSavePasswords = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwords.current) newErrors.currentPassword = 'Current password is required';
    if (!validatePassword(passwords.new)) newErrors.newPassword = 'Password must be 8+ alphanumeric characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the password errors');
      return;
    }

    setIsSavingPasswords(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      toast.success('Password updated successfully');
      setPasswords({ current: '', new: '' });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsSavingPasswords(false);
    }
  };

  const handleSavePaymentInfo = async () => {
    if (!paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountName) {
      toast.error('Please complete all payment fields');
      return;
    }

    setIsSavingPaymentInfo(true);
    try {
      const response = await api.put(`/users/payment-info`, {
        bankName: paymentInfo.bankName,
        accountNumber: paymentInfo.accountNumber,
        accountName: paymentInfo.accountName,
        autopay: paymentInfo.autopay
      });

      if (response.data) {
        toast.success('Payment information updated successfully');
        // Update local user state and sync with localStorage/dashboard
        const updatedUser = { 
          ...currentUser, 
          sellerProfile: { 
            ...currentUser.sellerProfile, 
            ...paymentInfo 
          } 
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Dispatch custom event to notify other components (like SellerDashboardPage)
        window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
      }
    } catch (error: any) {
      console.error('Error updating payment info:', error);
      toast.error(error.response?.data?.error || 'Failed to update payment information');
    } finally {
      setIsSavingPaymentInfo(false);
    }
  };

  const handleSaveBusinessInfo = async () => {
    if (!businessInfo.carLot.trim() || !businessInfo.address.trim()) {
      toast.error('Please complete car lot name and address');
      return;
    }

    if (!businessInfo.nin.trim() && !businessInfo.companyRegNo.trim()) {
      toast.error('Please provide either NIN or Business Registration No.');
      return;
    }

    setIsSavingBusinessInfo(true);
    try {
      const response = await api.put('/sellers/profile', {
        companyName: businessInfo.carLot,
        address: businessInfo.address,
        nin: businessInfo.nin,
        companyRegNo: businessInfo.companyRegNo,
        type: businessInfo.carLot ? 'COMPANY' : 'INDIVIDUAL'
      });

      if (response.data && response.data.sellerProfile) {
        const updatedUser = {
          ...currentUser,
          sellerProfile: response.data.sellerProfile
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
        
        toast.success('Business information updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating business info:', error);
      toast.error(error.response?.data?.error || 'Failed to update business information');
    } finally {
      setIsSavingBusinessInfo(false);
    }
  };

  const handleSaveSubscription = async () => {
    setIsSavingSubscription(true);
    setIsSavingSubscription(false);
    toast.success('Subscription plan updated successfully');
  };

  const tabs: SettingsTab[] = ['Profile', 'Business', 'Payment', 'Subscription Plan'];

  const renderProfileHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        <UserAvatar 
          firstName={currentUser.firstName} 
          lastName={currentUser.lastName} 
          avatar={currentUser.avatar}
          className="w-20 h-20 border-4 border-white shadow-lg"
          fallbackClassName="text-2xl"
        />
      </div>

      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            {user.sellerProfile?.companyName || "God's Autos"}
            <span style={{ fontSize: '16px', fontWeight: 400, color: '#666666', marginLeft: '8px' }}>
              ({user.firstName} {user.lastName})
            </span>
          </h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', color: '#999999' }}>{user.email}</span>
          <div style={{ 
            background: '#F0F9F4', 
            color: '#005C32', 
            padding: '4px 12px', 
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Verified
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #005C32',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#005C32',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <CameraIcon />
          Change Photo
        </button>
      </div>
    </div>
  );

  return (
    <>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#000000', fontFamily: 'Lexend' }}>Profile</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', fontFamily: 'Lexend' }}>
        {renderProfileHeader()}

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '16px' : '32px', 
          borderBottom: '1px solid #F0F0F0', 
          overflowX: isMobile ? 'auto' : 'visible',
          paddingBottom: '2px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 4px',
                fontSize: '14px',
                fontWeight: 500,
                color: activeTab === tab ? '#005C32' : '#999999',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-2px', 
                  left: 0, 
                  right: 0, 
                  height: '2px', 
                  backgroundColor: '#005C32' 
                }} />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Personal Info */}
            <div style={{ padding: '0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    placeholder="Enter your full name"
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${errors.fullName ? '#FF3B30' : '#E0E0E0'}`,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'Lexend'
                    }}
                  />
                  {errors.fullName && <span style={{ fontSize: '12px', color: '#FF3B30' }}>{errors.fullName}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    placeholder="Enter your email address"
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${errors.email ? '#FF3B30' : '#E0E0E0'}`,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'Lexend'
                    }}
                  />
                  {errors.email && <span style={{ fontSize: '12px', color: '#FF3B30' }}>{errors.email}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    placeholder="e.g. +234 703 404 1184"
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${errors.phone ? '#FF3B30' : '#E0E0E0'}`,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'Lexend'
                    }}
                  />
                  {errors.phone && <span style={{ fontSize: '12px', color: '#FF3B30' }}>{errors.phone}</span>}
                </div>
              </div>

              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSavePersonalInfo}
                  disabled={isSavingPersonalInfo}
                  style={{
                    background: '#005C32',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 32px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '140px',
                    justifyContent: 'center',
                    fontFamily: 'Lexend'
                  }}
                >
                  {isSavingPersonalInfo ? <Spinner size="sm" color="white" /> : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div style={{ padding: '0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Security</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => {
                        setPasswords(prev => ({ ...prev, current: e.target.value }));
                        if (errors.currentPassword) setErrors(prev => ({ ...prev, currentPassword: '' }));
                      }}
                      placeholder="Enter current password"
                      style={{
                        width: '100%',
                        padding: '14px 44px 14px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${errors.currentPassword ? '#FF3B30' : '#E0E0E0'}`,
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'Lexend'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <EyeIcon />
                    </button>
                  </div>
                  {errors.currentPassword && <span style={{ fontSize: '12px', color: '#FF3B30' }}>{errors.currentPassword}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => {
                        setPasswords(prev => ({ ...prev, new: e.target.value }));
                        if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                      }}
                      placeholder="Enter new password"
                      style={{
                        width: '100%',
                        padding: '14px 44px 14px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${errors.newPassword ? '#FF3B30' : '#E0E0E0'}`,
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'Lexend'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <EyeIcon />
                    </button>
                  </div>
                  {errors.newPassword && <span style={{ fontSize: '12px', color: '#FF3B30' }}>{errors.newPassword}</span>}
                  
                  {/* Password Strength Indicator */}
                  {passwords.new && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {[1, 2, 3, 4].map((level) => {
                        const strength = passwords.new.length < 6 ? 1 : passwords.new.length < 10 ? 2 : passwords.new.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) ? 4 : 3;
                        return (
                          <div
                            key={level}
                            style={{
                              height: '4px',
                              flex: 1,
                              borderRadius: '2px',
                              background: level <= strength 
                                ? strength <= 1 ? '#FF3B30' : strength <= 2 ? '#FFCC00' : '#34C759'
                                : '#E0E0E0'
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '4px 12px',
                    background: validatePassword(passwords.new) ? '#F0F9F4' : '#F0F0F0',
                    borderRadius: '100px',
                    width: 'fit-content',
                    marginTop: '8px',
                    transition: 'all 0.3s'
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      border: validatePassword(passwords.new) ? '1px solid #005C32' : '1px solid #999999',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      color: validatePassword(passwords.new) ? '#005C32' : '#999999'
                    }}>✓</div>
                    <span style={{ 
                      fontSize: '10px', 
                      color: validatePassword(passwords.new) ? '#005C32' : '#999999', 
                      fontFamily: 'Lexend',
                      fontWeight: 500
                    }}>8+ Alphanumeric Characters</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSavePasswords}
                  disabled={isSavingPasswords}
                  style={{
                    background: '#005C32',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 32px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '140px',
                    justifyContent: 'center',
                    fontFamily: 'Lexend'
                  }}
                >
                  {isSavingPasswords ? <Spinner size="sm" color="white" /> : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Business' && (
          <div style={{ padding: '0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Business Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Car Lot Name</label>
                <input
                  type="text"
                  value={businessInfo.carLot}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, carLot: e.target.value }))}
                  placeholder="Enter car lot name"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Lexend'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>NIN</label>
                <input
                  type="text"
                  value={businessInfo.nin}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, nin: e.target.value }))}
                  placeholder="Enter NIN"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Lexend'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Business Registration No.</label>
                <input
                  type="text"
                  value={businessInfo.companyRegNo}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, companyRegNo: e.target.value }))}
                  placeholder="Enter Reg No."
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Lexend'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: isMobile ? 'auto' : '1 / span 2' }}>
                <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Business Address</label>
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter business address"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Lexend'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSaveBusinessInfo}
                disabled={isSavingBusinessInfo}
                style={{
                  background: '#005C32',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 32px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '140px',
                  justifyContent: 'center',
                  fontFamily: 'Lexend'
                }}
              >
                {isSavingBusinessInfo ? <Spinner size="sm" color="white" /> : 'Save Business Info'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Payment' && (
          <div style={{ padding: '0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Bank Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Bank Name</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={paymentInfo.bankName}
                    onChange={handleBankChange}
                    style={{
                      width: '100%',
                      padding: '14px 44px 14px 16px',
                      borderRadius: '12px',
                      border: '1px solid #E0E0E0',
                      fontSize: '14px',
                      outline: 'none',
                      appearance: 'none',
                      backgroundColor: '#FFFFFF',
                      fontFamily: 'Lexend'
                    }}
                  >
                    <option value="">Select Bank</option>
                    {banks.map(bank => (
                      <option key={bank.id} value={bank.name}>{bank.name}</option>
                    ))}
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Account Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={paymentInfo.accountNumber}
                    onChange={handleAccountNumberChange}
                    placeholder="Enter 10-digit account number"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: '1px solid #E0E0E0',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'Lexend'
                    }}
                  />
                  {isResolvingAccount && (
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner size="sm" />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: isMobile ? 'auto' : '1 / span 2' }}>
                <label style={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>Account Name</label>
                <input
                  type="text"
                  value={paymentInfo.accountName}
                  readOnly
                  placeholder="Account name will be resolved automatically"
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#F9F9F9',
                    fontFamily: 'Lexend'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSavePaymentInfo}
                disabled={isSavingPaymentInfo}
                style={{
                  background: '#005C32',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 32px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '140px',
                  justifyContent: 'center',
                  fontFamily: 'Lexend'
                }}
              >
                {isSavingPaymentInfo ? <Spinner size="sm" color="white" /> : 'Save Payment Info'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Subscription Plan' && (
          <div style={{ padding: '0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Subscription Plan</h3>
            <div style={{ 
              background: '#F0F9F4', 
              borderRadius: '16px', 
              padding: '24px',
              border: '1px solid #005C32',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '14px', color: '#005C32', fontWeight: 500, display: 'block', marginBottom: '4px' }}>CURRENT PLAN</span>
                <h4 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{subscriptionPlan}</h4>
              </div>
              <span style={{
                background: '#005C32',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'Lexend'
              }}>
                {isSavingSubscription ? 'Saving...' : 'Manage Plan'}
              </span>
            </div>
            <div style={{ marginTop: '24px' }}>
              {loadingPlans ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                  <Spinner size="lg" />
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {(() => {
                    const currentPlanPrice = Number(
                      plans.find((p) => p.name === subscriptionPlan)?.price || 0
                    );
                    return plans.map((plan) => {
                      const planPrice = Number(plan.price || 0);
                      const isCurrent = subscriptionPlan === plan.name;
                      const isDowngrade = !isCurrent && currentPlanPrice > 0 && planPrice < currentPlanPrice;
                      const isUpgradeWithProration = !isCurrent && currentPlanPrice > 0 && planPrice > currentPlanPrice;
                      return (
                        <div
                          key={plan.id}
                          style={{
                            border: isCurrent ? '1px solid #005C32' : '1px solid #E5E7EB',
                            borderRadius: '14px',
                            padding: isMobile ? '16px' : '20px',
                            background: '#FFFFFF',
                            boxShadow: isCurrent ? '0 6px 20px rgba(0, 92, 50, 0.08)' : '0 4px 10px rgba(16, 24, 40, 0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                            <h4 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', fontWeight: 700, color: '#111827' }}>{plan.name}</h4>
                            {isCurrent && (
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#005C32', background: '#E6F4EC', borderRadius: '9999px', padding: '6px 10px' }}>
                                Current
                              </span>
                            )}
                          </div>
                          <p style={{ margin: 0, fontSize: isMobile ? '24px' : '28px', fontWeight: 700, color: '#005C32' }}>
                            {Number(plan.price) === 0 ? 'Free' : `₦${formatAmount(plan.price)}`}
                            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>/month</span>
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                            {plan.duration} days billing cycle
                          </p>
                          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(plan.features || []).slice(0, 4).map((feature, index) => (
                              <li key={index} style={{ fontSize: '13px', color: '#374151', lineHeight: 1.45 }}>{feature}</li>
                            ))}
                          </ul>
                          <div
                            style={{
                              marginTop: '2px',
                              padding: '12px',
                              background: '#F9FAFB',
                              border: '1px solid #EEF2F7',
                              borderRadius: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Listing Limit</span>
                              <span style={{ fontSize: '12px', color: '#111827', fontWeight: 700 }}>
                                {plan.listingLimit && plan.listingLimit > 0 ? `${plan.listingLimit} listings` : 'Unlimited'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Featured Listings</span>
                              <span style={{ fontSize: '12px', color: '#111827', fontWeight: 700 }}>
                                {plan.featuredListings && plan.featuredListings > 0 ? `${plan.featuredListings} slots` : 'Not included'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Priority Support</span>
                              <span style={{ fontSize: '12px', color: plan.prioritySupport ? '#005C32' : '#6B7280', fontWeight: 700 }}>
                                {plan.prioritySupport ? 'Included' : 'Standard support'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Advanced Analytics</span>
                              <span style={{ fontSize: '12px', color: plan.analyticsAccess ? '#005C32' : '#6B7280', fontWeight: 700 }}>
                                {plan.analyticsAccess ? 'Included' : 'Not included'}
                              </span>
                            </div>
                          </div>
                          <button
                            disabled={selectedPlan === plan.name || isCurrent || isDowngrade}
                            onClick={() => {
                              onSelectPlan(plan);
                            }}
                            style={{
                              marginTop: '4px',
                              width: '100%',
                              background: isCurrent || isDowngrade ? '#E5E7EB' : '#005C32',
                              color: isCurrent || isDowngrade ? '#6B7280' : '#FFFFFF',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '11px 14px',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: isCurrent || isDowngrade ? 'not-allowed' : 'pointer',
                              fontFamily: 'Lexend',
                              opacity: selectedPlan === plan.name ? 0.75 : 1
                            }}
                          >
                            {selectedPlan === plan.name
                              ? 'Processing...'
                              : isCurrent
                                ? 'Current Plan'
                                : isDowngrade
                                  ? 'Downgrade Not Allowed'
                                  : isUpgradeWithProration
                                    ? 'Upgrade (Prorated)'
                                    : 'Choose Plan'}
                          </button>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <DashboardModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          title="Crop Profile Photo"
        >
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ position: 'relative', width: '100%', height: '300px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
              {imageToCrop && (
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label style={{ fontSize: '14px', color: '#666', marginBottom: '8px', display: 'block' }}>Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button
                onClick={() => setShowCropModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  background: '#FFF',
                  cursor: 'pointer',
                  fontFamily: 'Lexend'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadCroppedImage}
                disabled={isUploadingAvatar}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#005C32',
                  color: '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'Lexend'
                }}
              >
                {isUploadingAvatar ? <Spinner size="sm" color="white" /> : 'Apply Crop'}
              </button>
            </div>
          </div>
        </DashboardModal>
      )}
    </>
  );
}
