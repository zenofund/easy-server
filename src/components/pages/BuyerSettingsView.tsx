import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/Spinner';
import { UserAvatar } from '../UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl } from '../../utils/avatarUtils';
import api from '../../lib/api';
import Cropper from 'react-easy-crop';
import { DashboardModal } from '../modals/DashboardModal';

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

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

interface BuyerSettingsViewProps {
  user: any;
  isMobile?: boolean;
  activeTab: 'Profile' | 'Payment';
  setActiveTab: (tab: 'Profile' | 'Payment') => void;
  personalInfo: { fullName: string; email: string; phone: string };
  setPersonalInfo: React.Dispatch<React.SetStateAction<{ fullName: string; email: string; phone: string }>>;
  isSavingPersonalInfo: boolean;
  onSavePersonalInfo: () => Promise<void>;
  passwords: { current: string; new: string };
  setPasswords: React.Dispatch<React.SetStateAction<{ current: string; new: string }>>;
  isSavingPasswords: boolean;
  onSavePasswords: () => Promise<void>;
  paymentInfo: { bankName: string; accountNumber: string; accountName: string; autopay: boolean };
  setPaymentInfo: React.Dispatch<React.SetStateAction<{ bankName: string; accountNumber: string; accountName: string; autopay: boolean }>>;
  // isSavingPaymentInfo is not used as a prop anymore since it's handled internally now? 
  // Wait, let's check the props again.
  isSavingPaymentInfo: boolean;
  onSavePaymentInfo: () => Promise<void>;
}

type SettingsTab = 'Profile' | 'Payment';

export function BuyerSettingsView({ 
  user, 
  isMobile, 
  activeTab, 
  setActiveTab,
  personalInfo,
  setPersonalInfo,
  isSavingPersonalInfo,
  onSavePersonalInfo,
  passwords,
  setPasswords,
  isSavingPasswords,
  onSavePasswords,
  paymentInfo,
  setPaymentInfo,
  isSavingPaymentInfo,
  onSavePaymentInfo
}: BuyerSettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar Upload States
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result as string);
      setShowCropModal(true);
    });
    reader.readAsDataURL(file);
  };

  const handleUploadCroppedImage = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    setIsUploadingAvatar(true);
    try {
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update local storage and dispatch event
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new CustomEvent('user-updated', { detail: response.data.user }));
      
      setShowCropModal(false);
      setImageToCrop(null);
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Bank States
  const [banks, setBanks] = useState<any[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+\d{7,15}$/.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
    
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
    if (personalInfo.phone && !validatePhone(personalInfo.phone)) newErrors.phone = 'Use international format (e.g. +234...)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    await onSavePersonalInfo();
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

    await onSavePasswords();
  };

  const handleSavePaymentInfo = async () => {
    await onSavePaymentInfo();
  };

  const tabs: SettingsTab[] = ['Profile', 'Payment'];

  const renderProfileHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        <UserAvatar 
          firstName={user.firstName} 
          lastName={user.lastName} 
          avatar={user.avatar}
          className="w-20 h-20 border-4 border-white shadow-lg"
          fallbackClassName="text-2xl"
        />
      </div>

      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, fontFamily: 'Lexend' }}>
            {personalInfo.fullName}
          </h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', color: '#999999', fontFamily: 'Lexend' }}>{user.email}</span>
          <div style={{ 
            background: '#F0F9F4', 
            color: '#005C32', 
            padding: '4px 12px', 
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'Lexend'
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
            cursor: 'pointer',
            fontFamily: 'Lexend'
          }}
        >
          <CameraIcon />
          Change Photo
        </button>
      </div>

      {/* Avatar Crop Modal */}
      <DashboardModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          setImageToCrop(null);
        }}
        title="Crop Profile Photo"
      >
        <div style={{ position: 'relative', width: '100%', height: '400px', background: '#333' }}>
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
        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#666' }}>Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ flex: 1 }}
            />
          </div>
          <button
            onClick={handleUploadCroppedImage}
            disabled={isUploadingAvatar}
            style={{
              width: '100%',
              padding: '12px',
              background: '#005C32',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: 'none',
              fontFamily: 'Lexend',
              fontWeight: 600,
              cursor: isUploadingAvatar ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isUploadingAvatar ? <Spinner size="sm" variant="white" /> : null}
            {isUploadingAvatar ? 'Uploading...' : 'Save Profile Photo'}
          </button>
        </div>
      </DashboardModal>
    </div>
  );

  return (
    <>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#000000', fontFamily: 'Lexend' }}>Settings</h2>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '16px' : '32px', 
        borderBottom: '1px solid #F0F0F0', 
        marginBottom: '32px',
        overflowX: isMobile ? 'auto' : 'visible',
        paddingBottom: '2px',
        fontFamily: 'Lexend'
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
              whiteSpace: 'nowrap',
              fontFamily: 'Lexend'
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Shared Profile Header */}
        {renderProfileHeader()}

        <div style={{ width: '100%', height: '1px', background: '#F0F0F0' }} />

        {activeTab === 'Profile' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Personal Information */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: '40px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', fontFamily: 'Lexend' }}>Personal Information</h4>
                <p style={{ fontSize: '14px', color: '#999999', margin: '0 0 24px 0', fontFamily: 'Lexend' }}>Update your personal details here.</p>
                <button 
                  onClick={handleSavePersonalInfo}
                  disabled={isSavingPersonalInfo}
                  style={{
                    padding: '10px 24px',
                    background: '#005C32',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: isSavingPersonalInfo ? 'not-allowed' : 'pointer',
                    fontFamily: 'Lexend',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isSavingPersonalInfo ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                  className="active:scale-[0.98] hover:opacity-90"
                >
                  {isSavingPersonalInfo ? (
                    <>
                      <Spinner size="sm" variant="white" />
                      <span>Saving...</span>
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    style={{
                      padding: '14px 16px',
                      border: errors.fullName ? '1px solid #ED0D0D' : '1px solid #E2E8F9',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#333333',
                      fontFamily: 'Lexend'
                    }}
                  />
                  {errors.fullName && <span style={{ color: '#ED0D0D', fontSize: '12px', fontFamily: 'Lexend' }}>{errors.fullName}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Email</label>
                  <input 
                    type="email" 
                    value={personalInfo.email}
                    disabled
                    style={{
                      padding: '14px 16px',
                      border: '1px solid #E2E8F9',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#999999',
                      background: '#F9FAFB',
                      fontFamily: 'Lexend'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    placeholder="+234..."
                    style={{
                      padding: '14px 16px',
                      border: errors.phone ? '1px solid #ED0D0D' : '1px solid #E2E8F9',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#333333',
                      fontFamily: 'Lexend'
                    }}
                  />
                  {errors.phone && <span style={{ color: '#ED0D0D', fontSize: '12px', fontFamily: 'Lexend' }}>{errors.phone}</span>}
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: '1px', background: '#F0F0F0' }} />

            {/* Password Information */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: '40px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', fontFamily: 'Lexend' }}>Password Information</h4>
                <p style={{ fontSize: '14px', color: '#999999', margin: '0 0 24px 0', fontFamily: 'Lexend' }}>Update your Password here.</p>
                <button 
                  onClick={handleSavePasswords}
                  disabled={isSavingPasswords}
                  style={{
                    padding: '10px 24px',
                    background: '#005C32',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: isSavingPasswords ? 'not-allowed' : 'pointer',
                    fontFamily: 'Lexend',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isSavingPasswords ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                  className="active:scale-[0.98] hover:opacity-90"
                >
                  {isSavingPasswords ? (
                    <>
                      <Spinner size="sm" variant="white" />
                      <span>Saving...</span>
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      value={passwords.current}
                      onChange={(e) => {
                        setPasswords(prev => ({ ...prev, current: e.target.value }));
                        if (errors.currentPassword) setErrors(prev => {
                          const next = { ...prev };
                          delete next.currentPassword;
                          return next;
                        });
                      }}
                      placeholder="............"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: errors.currentPassword ? '1px solid #ED0D0D' : '1px solid #E2E8F9',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#333333',
                        fontFamily: 'Lexend'
                      }}
                    />
                    <div 
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >
                      <EyeIcon />
                    </div>
                  </div>
                  {errors.currentPassword && <span style={{ color: '#ED0D0D', fontSize: '12px', fontFamily: 'Lexend' }}>{errors.currentPassword}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={passwords.new}
                      onChange={(e) => {
                        setPasswords(prev => ({ ...prev, new: e.target.value }));
                        if (errors.newPassword) setErrors(prev => {
                          const next = { ...prev };
                          delete next.newPassword;
                          return next;
                        });
                      }}
                      placeholder="............"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: errors.newPassword ? '1px solid #ED0D0D' : '1px solid #E2E8F9',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#333333',
                        fontFamily: 'Lexend'
                      }}
                    />
                    <div 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >
                      <EyeIcon />
                    </div>
                  </div>
                  {errors.newPassword && <span style={{ color: '#ED0D0D', fontSize: '12px', fontFamily: 'Lexend' }}>{errors.newPassword}</span>}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    background: validatePassword(passwords.new) ? '#F0F9F4' : '#F0F0F0', 
                    color: validatePassword(passwords.new) ? '#005C32' : '#999999', 
                    padding: '4px 12px', 
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 500,
                    width: 'fit-content',
                    marginTop: '4px',
                    transition: 'all 0.3s',
                    fontFamily: 'Lexend'
                  }}>
                    <CheckCircleIcon />
                    8+ Alphanumeric Characters
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Information Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: '40px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', fontFamily: 'Lexend' }}>Payment Information</h4>
                <p style={{ fontSize: '14px', color: '#999999', margin: '0 0 24px 0', fontFamily: 'Lexend' }}>Update your payment details here.</p>
                <button 
                  onClick={handleSavePaymentInfo}
                  disabled={isSavingPaymentInfo || !paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountName}
                  style={{
                    padding: '10px 24px',
                    background: (!paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountName) ? '#E2E8F9' : '#005C32',
                    color: (!paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountName) ? '#999999' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: (isSavingPaymentInfo || !paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountName) ? 'not-allowed' : 'pointer',
                    fontFamily: 'Lexend',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isSavingPaymentInfo ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                  className="active:scale-[0.98] hover:opacity-90"
                >
                  {isSavingPaymentInfo ? (
                    <>
                      <Spinner size="sm" variant="white" />
                      <span>Saving...</span>
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Bank Name</label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      value={paymentInfo.bankName}
                      onChange={handleBankChange}
                      disabled={isLoadingBanks}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '1px solid #E2E8F9',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        color: paymentInfo.bankName ? '#333333' : '#999999',
                        background: isLoadingBanks ? '#F9FAFB' : '#FFFFFF',
                        appearance: 'none',
                        cursor: isLoadingBanks ? 'not-allowed' : 'pointer',
                        fontFamily: 'Lexend'
                      }}
                    >
                      <option value="" disabled>{isLoadingBanks ? 'Loading banks...' : 'Select Bank'}</option>
                      {banks.map((bank: any) => (
                        <option key={bank.id} value={bank.name}>{bank.name}</option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      {isLoadingBanks ? <Spinner size="sm" /> : <ChevronDownIcon />}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Account Number</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={paymentInfo.accountNumber}
                      onChange={handleAccountNumberChange}
                      placeholder="Enter 10-digit account number"
                      maxLength={10}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '1px solid #E2E8F9',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#333333',
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Account Name</label>
                  <input 
                    type="text" 
                    value={paymentInfo.accountName}
                    readOnly
                    placeholder={isResolvingAccount ? "Resolving account name..." : "Account name will appear here"}
                    style={{
                      padding: '14px 16px',
                      border: '1px solid #E2E8F9',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#333333',
                      background: '#F9FAFB',
                      fontFamily: 'Lexend',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  <div 
                    onClick={() => setPaymentInfo(prev => ({ ...prev, autopay: !prev.autopay }))}
                    style={{
                      width: '40px',
                      height: '20px',
                      borderRadius: '10px',
                      background: paymentInfo.autopay ? '#005C32' : '#E2E8F9',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      position: 'absolute',
                      top: '2px',
                      left: paymentInfo.autopay ? '22px' : '2px',
                      transition: 'all 0.3s'
                    }} />
                  </div>
                  <span style={{ fontSize: '14px', color: '#666666', fontFamily: 'Lexend' }}>Enable Autopay for future purchases</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
