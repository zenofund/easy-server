import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';
import { Spinner } from '../ui/Spinner';
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

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

interface InspectorSettingsViewProps {
  user: any;
  isMobile?: boolean;
  personalInfo: { fullName: string; email: string; phone: string; officeName: string };
  setPersonalInfo: React.Dispatch<React.SetStateAction<{ fullName: string; email: string; phone: string; officeName: string }>>;
  isSavingPersonalInfo: boolean;
  onSavePersonalInfo: () => Promise<void>;
  passwords: { current: string; new: string };
  setPasswords: React.Dispatch<React.SetStateAction<{ current: string; new: string }>>;
  isSavingPasswords: boolean;
  onSavePasswords: () => Promise<void>;
  paymentInfo: { bankName: string; accountNumber: string; accountName: string; autopay: boolean };
  setPaymentInfo: React.Dispatch<React.SetStateAction<{ bankName: string; accountNumber: string; accountName: string; autopay: boolean }>>;
}

export function InspectorSettingsView({ 
  user, 
  isMobile, 
  personalInfo,
  setPersonalInfo,
  isSavingPersonalInfo,
  onSavePersonalInfo,
  passwords,
  setPasswords,
  isSavingPasswords,
  onSavePasswords,
  paymentInfo,
  setPaymentInfo
}: InspectorSettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Avatar Upload States
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const onCropComplete = useCallback((at: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
    if (!imageToCrop || !croppedAreaPixels || !user) return;

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

  // Bank States
  const [banks, setBanks] = useState<any[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);
  const [isSavingPaymentInfo, setIsSavingPaymentInfo] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

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

  const handleSavePaymentInfo = async () => {
    if (!paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountName) {
      toast.error('Please fill in all payment details');
      return;
    }

    setIsSavingPaymentInfo(true);
    try {
      const response = await api.put('/users/payment-info', {
        bankName: paymentInfo.bankName,
        accountNumber: paymentInfo.accountNumber,
        accountName: paymentInfo.accountName,
        autopay: paymentInfo.autopay
      });
      
      if (response.data) {
        toast.success('Payment information updated successfully');
        
        // Update local user state and sync with localStorage/dashboard
        const updatedUser = { 
          ...user, 
          inspectorProfile: { 
            ...user.inspectorProfile, 
            ...paymentInfo 
          } 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Dispatch custom event to notify other components (like InspectorDashboardPage)
        window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
      }
    } catch (error) {
      console.error('Error updating payment info:', error);
      toast.error('Failed to update payment information');
    } finally {
      setIsSavingPaymentInfo(false);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+\d{7,15}$/.test(phone.replace(/\s/g, ''));
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

  return (
    <>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#000000', fontFamily: 'Lexend' }}>Profile</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', fontFamily: 'Lexend' }}>
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              background: '#F0F0F0',
              border: '4px solid #FFFFFF',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <UserAvatar 
                firstName={user.firstName} 
                lastName={user.lastName} 
                avatar={user.avatar}
                className="w-full h-full"
                fallbackClassName="text-2xl"
              />
            </div>
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
        </div>

        <div style={{ width: '100%', height: '1px', background: '#F0F0F0' }} />

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Office Name</label>
              <input 
                type="text" 
                name="officeName"
                value={personalInfo.officeName}
                onChange={handlePersonalInfoChange}
                placeholder="Enter your office name"
                style={{
                  padding: '14px 16px',
                  border: '1px solid #E2E8F9',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#333333',
                  fontFamily: 'Lexend'
                }}
              />
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
                gap: '8px',
                padding: '4px 12px',
                background: validatePassword(passwords.new) ? '#F0F9F4' : '#F0F0F0',
                borderRadius: '100px',
                width: 'fit-content',
                marginTop: '4px',
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
        </div>

        <div style={{ width: '100%', height: '1px', background: '#F0F0F0' }} />

        {/* Payment Information */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: '40px', paddingBottom: '40px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', fontFamily: 'Lexend' }}>Payment Information</h4>
            <p style={{ fontSize: '14px', color: '#999999', margin: '0 0 24px 0', fontFamily: 'Lexend' }}>Update your payment details here.</p>
            <button 
              onClick={handleSavePaymentInfo}
              disabled={isSavingPaymentInfo || !paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountName}
              style={{
                padding: '10px 24px',
                background: '#005C32',
                color: '#FFFFFF',
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
                opacity: (isSavingPaymentInfo || !paymentInfo.bankName || !paymentInfo.accountNumber || !paymentInfo.accountName) ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
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
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F9', 
                    outline: 'none',
                    appearance: 'none',
                    background: isLoadingBanks ? '#F9FAFB' : '#FFFFFF',
                    cursor: isLoadingBanks ? 'not-allowed' : 'pointer',
                    color: paymentInfo.bankName ? '#333333' : '#999999',
                    fontFamily: 'Lexend',
                    fontSize: '14px'
                  }}
                >
                  <option value="" disabled>{isLoadingBanks ? 'Loading banks...' : 'Select Bank'}</option>
                  {banks.map((bank: any) => (
                    <option key={bank.id} value={bank.name}>{bank.name}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Account Number</label>
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
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#333333', fontFamily: 'Lexend' }}>Account Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  value={paymentInfo.accountName}
                  readOnly
                  placeholder={isResolvingAccount ? "Resolving..." : "Account name will appear here"}
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F9', 
                    outline: 'none',
                    background: '#F9FAFB',
                    cursor: 'not-allowed',
                    fontFamily: 'Lexend',
                    fontSize: '14px',
                    color: '#333333'
                  }}
                />
                {isResolvingAccount && (
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                    <Spinner size="sm" />
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <div 
                onClick={() => setPaymentInfo(prev => ({ ...prev, autopay: !prev.autopay }))}
                style={{
                  width: '40px',
                  height: '20px',
                  borderRadius: '20px',
                  background: paymentInfo.autopay ? '#005C32' : '#E5E7EB',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
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
                  transition: 'left 0.3s'
                }} />
              </div>
              <span style={{ fontSize: '14px', color: '#666666', fontFamily: 'Lexend' }}>Enable autopay for inspection fees</span>
            </div>
          </div>
        </div>
      </div>
      {/* Crop Modal */}
      {showCropModal && imageToCrop && (
        <DashboardModal
          isOpen={showCropModal}
          onClose={() => {
            setShowCropModal(false);
            setImageToCrop(null);
          }}
          title="Crop Profile Photo"
        >
          <div style={{ position: 'relative', width: '100%', height: '400px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#005C32' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setImageToCrop(null);
                }}
                style={{
                  padding: '10px 24px',
                  background: '#F3F4F6',
                  color: '#4B5563',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadCroppedImage}
                disabled={isUploadingAvatar}
                style={{
                  padding: '10px 24px',
                  background: '#005C32',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: isUploadingAvatar ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isUploadingAvatar ? 0.7 : 1
                }}
              >
                {isUploadingAvatar ? (
                  <>
                    <Spinner size="sm" variant="white" />
                    <span>Uploading...</span>
                  </>
                ) : 'Upload Photo'}
              </button>
            </div>
          </div>
        </DashboardModal>
      )}
    </>
  );
}
