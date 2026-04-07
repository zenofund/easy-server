import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../lib/api';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';

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

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export function AdminSettingsView() {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [profileForm, setProfileForm] = useState({
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    email: user.email || '',
    phone: user.phone || ''
  });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [smtpConfig, setSmtpConfig] = useState({
    SMTP_HOST: '',
    SMTP_PORT: '465',
    SMTP_USER: '',
    SMTP_PASS: '',
    SMTP_FROM: ''
  });
  const [testEmail, setTestEmail] = useState('');
  const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);
  const [isSavingPasswords, setIsSavingPasswords] = useState(false);
  const [isSavingSMTP, setIsSavingSMTP] = useState(false);
  const [isTestingSMTP, setIsTestingSMTP] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showSMTPPassword, setShowSMTPPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSMTPConfig();
  }, []);

  const fetchSMTPConfig = async () => {
    try {
      const response = await api.get('/admin/config');
      if (response.data) {
        setSmtpConfig({
          SMTP_HOST: response.data.SMTP_HOST || '',
          SMTP_PORT: response.data.SMTP_PORT || '465',
          SMTP_USER: response.data.SMTP_USER || '',
          SMTP_PASS: response.data.SMTP_PASS || '',
          SMTP_FROM: response.data.SMTP_FROM || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch SMTP config:', error);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+\d{7,15}$/.test(phone.replace(/\s/g, ''));
  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleSavePersonalInfo = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!profileForm.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!validateEmail(profileForm.email)) newErrors.email = 'Invalid email address';
    if (profileForm.phone && !validatePhone(profileForm.phone)) newErrors.phone = 'Use international format (e.g. +234...)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSavingPersonalInfo(true);
    try {
      const [firstName, ...lastNameParts] = profileForm.fullName.split(' ');
      const response = await api.patch(`/admin/users/${user.id}`, {
        firstName,
        lastName: lastNameParts.join(' '),
        phone: profileForm.phone,
        email: profileForm.email
      });

      if (response.data) {
        const updatedUser = { ...user, ...response.data };
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
    const newErrors: { [key: string]: string } = {};
    if (!passwords.current) newErrors.currentPassword = 'Current password is required';
    if (!validatePassword(passwords.new)) newErrors.newPassword = 'Password must be 8+ alphanumeric characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsSavingPasswords(false);
    }
  };

  const handleSaveSMTPConfig = async () => {
    setIsSavingSMTP(true);
    try {
      await api.post('/admin/config', { configs: smtpConfig });
      toast.success('SMTP configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save SMTP configuration');
    } finally {
      setIsSavingSMTP(false);
    }
  };

  const handleTestSMTPDeliverability = async () => {
    if (!validateEmail(testEmail)) {
      toast.error('Please enter a valid test email address');
      return;
    }

    setIsTestingSMTP(true);
    const loadingToast = toast.loading('Sending test email...');
    try {
      await api.post('/admin/config/test-smtp', { email: testEmail });
      toast.dismiss(loadingToast);
      toast.success('Test email sent! Please check your inbox.');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorDetail = error.response?.data?.details || error.response?.data?.error || error.message;
      toast.error(`SMTP Error: ${errorDetail}`, {
        duration: 5000
      });
      console.error('SMTP Test Failed:', error.response?.data);
    } finally {
      setIsTestingSMTP(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));
        toast.success('Avatar updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Lexend' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '40px' }}>Admin Profile Settings</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: '#F0F0F0' }}>
              <UserAvatar 
                firstName={user.firstName} 
                lastName={user.lastName} 
                avatar={user.avatar}
                className="w-full h-full"
                fallbackClassName="text-2xl"
              />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute', bottom: '4px', right: '4px', width: '32px', height: '32px',
                borderRadius: '50%', background: '#005C32', border: '2px solid #FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', cursor: 'pointer'
              }}
            >
              <CameraIcon />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px 0' }}>{profileForm.fullName}</h3>
            <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>{user.email} (Admin)</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
          {/* Personal Info */}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Personal Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>Full Name</label>
                <input 
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.fullName ? '1px solid #DC2626' : '1px solid #E5E7EB', outline: 'none' }}
                />
                {errors.fullName && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>Email Address</label>
                <input 
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.email ? '1px solid #DC2626' : '1px solid #E5E7EB', outline: 'none' }}
                />
                {errors.email && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>Phone Number</label>
                <input 
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.phone ? '1px solid #DC2626' : '1px solid #E5E7EB', outline: 'none' }}
                />
                {errors.phone && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
              </div>
              <button 
                onClick={handleSavePersonalInfo}
                disabled={isSavingPersonalInfo}
                style={{ 
                  background: '#005C32', color: '#FFFFFF', padding: '12px', borderRadius: '8px', 
                  border: 'none', fontWeight: 600, cursor: isSavingPersonalInfo ? 'not-allowed' : 'pointer',
                  marginTop: '12px'
                }}
              >
                {isSavingPersonalInfo ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Password Change */}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Security</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.currentPassword ? '1px solid #DC2626' : '1px solid #E5E7EB', outline: 'none' }}
                  />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer' }}>
                    <EyeIcon />
                  </button>
                </div>
                {errors.currentPassword && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.currentPassword}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: errors.newPassword ? '1px solid #DC2626' : '1px solid #E5E7EB', outline: 'none' }}
                  />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer' }}>
                    <EyeIcon />
                  </button>
                </div>
                {errors.newPassword && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.newPassword}</p>}
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
              <button 
                onClick={handleSavePasswords}
                disabled={isSavingPasswords}
                style={{ 
                  background: '#FFFFFF', color: '#005C32', padding: '12px', borderRadius: '8px', 
                  border: '1px solid #005C32', fontWeight: 600, cursor: isSavingPasswords ? 'not-allowed' : 'pointer',
                  marginTop: '12px'
                }}
              >
                {isSavingPasswords ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>

        {/* SMTP Configuration Section */}
        <div style={{ marginTop: '60px', borderTop: '1px solid #F0F0F0', paddingTop: '40px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>SMTP Configuration</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            {/* SMTP Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>SMTP Host</label>
                  <input 
                    value={smtpConfig.SMTP_HOST}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, SMTP_HOST: e.target.value }))}
                    placeholder="smtp.example.com"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>Port</label>
                  <input 
                    value={smtpConfig.SMTP_PORT}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, SMTP_PORT: e.target.value }))}
                    placeholder="465"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>SMTP User</label>
                <input 
                  value={smtpConfig.SMTP_USER}
                  onChange={(e) => setSmtpConfig(prev => ({ ...prev, SMTP_USER: e.target.value }))}
                  placeholder="user@example.com"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>SMTP Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showSMTPPassword ? 'text' : 'password'}
                    value={smtpConfig.SMTP_PASS}
                    onChange={(e) => setSmtpConfig(prev => ({ ...prev, SMTP_PASS: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                  />
                  <button onClick={() => setShowSMTPPassword(!showSMTPPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer' }}>
                    <EyeIcon />
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>From Email (Sender)</label>
                <input 
                  value={smtpConfig.SMTP_FROM}
                  onChange={(e) => setSmtpConfig(prev => ({ ...prev, SMTP_FROM: e.target.value }))}
                  placeholder='"Huce Autos" <support@huceautos.com>'
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                />
              </div>
              <button 
                onClick={handleSaveSMTPConfig}
                disabled={isSavingSMTP}
                style={{ 
                  background: '#005C32', color: '#FFFFFF', padding: '12px', borderRadius: '8px', 
                  border: 'none', fontWeight: 600, cursor: isSavingSMTP ? 'not-allowed' : 'pointer',
                  marginTop: '12px'
                }}
              >
                {isSavingSMTP ? 'Saving Config...' : 'Save SMTP Settings'}
              </button>
            </div>

            {/* Test Deliverability */}
            <div>
              <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '24px', border: '1px solid #F0F0F0' }}>
                <h5 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Test Deliverability</h5>
                <p style={{ fontSize: '14px', color: '#666666', marginBottom: '24px' }}>
                  Send a test email to verify your SMTP configuration is working correctly.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>Test Email Address</label>
                    <input 
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="receiver@example.com"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', background: '#FFFFFF' }}
                    />
                  </div>
                  <button 
                    onClick={handleTestSMTPDeliverability}
                    disabled={isTestingSMTP}
                    style={{ 
                      background: '#FFFFFF', color: '#005C32', padding: '12px', borderRadius: '8px', 
                      border: '1px solid #005C32', fontWeight: 600, cursor: isTestingSMTP ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    {isTestingSMTP ? 'Sending...' : (
                      <>
                        <SendIcon />
                        Send Test Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
