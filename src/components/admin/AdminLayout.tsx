import { Bell, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AdminHomeContent } from './AdminHomeContent';
import { AdminFinanceContent } from './AdminFinanceContent';
import { AdminUserMgtContent } from './AdminUserMgtContent';
import { AdminSubscriptionsContent } from './AdminSubscriptionsContent';
import { AdminSettingsView } from './AdminSettingsView';
import { 
  AdminHomeSkeleton, 
  AdminFinanceSkeleton, 
  AdminSettingsSkeleton, 
  AdminPlaceholderSkeleton,
  AdminManagementSkeleton,
  AdminSubscriptionsSkeleton,
  AdminCMSSkeleton
} from '../ui/SkeletonLoader';
import { CustomerSupportView } from '../pages/CustomerSupportView';
import imgLogo from "figma:asset/33fdad934e5e2e869921ffdcb711b343ad08d8b9.png";
import { UserAvatar } from '../UserAvatar';

type AdminTab = 'home' | 'user-mgt' | 'car-inventory' | 'subscriptions' | 'finances' | 'customer-support' | 'cms' | 'settings';

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'user-mgt', label: 'User Mgt' },
  { id: 'car-inventory', label: 'Car Inventory' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'finances', label: 'Finances' },
  { id: 'customer-support', label: 'Customer Support' },
  { id: 'cms', label: 'CMS' },
  { id: 'settings', label: 'Settings' },
];

export function AdminLayout() {
  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Load user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }

    const handleUserUpdate = (event: any) => {
      const updatedUserData = event.detail;
      if (updatedUserData) {
        setUser(updatedUserData);
      } else {
        const localData = localStorage.getItem('user');
        if (localData) {
          setUser(JSON.parse(localData));
        }
      }
    };

    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, [activeTab]);

  const handleTabChange = async (tab: AdminTab) => {
    if (tab === activeTab) return;
    setIsTabSwitching(true);
    setIsMobileMenuOpen(false);
    
    // Simulate loading to show skeleton
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setActiveTab(tab);
    setIsTabSwitching(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    window.location.hash = '#home';
    window.location.reload();
  };

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Header - Static - Mobile-First */}
      <header 
        style={{ 
          background: '#005C32', 
          height: '64px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 50, 
          flexShrink: 0,
          paddingTop: 'env(safe-area-inset-top)',
          boxSizing: 'content-box'
        }} 
        className="lg:h-[72px] lg:pt-0"
      >
        <div className="w-full max-w-[1500px] mx-auto px-0 h-full relative flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden absolute left-3 top-1/2 -translate-y-1/2 text-white z-50 w-11 h-11 flex items-center justify-center rounded-md transition-colors hover:bg-white/10 active:bg-white/20"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X size={24} strokeWidth={2} />
            ) : (
              <Menu size={24} strokeWidth={2} />
            )}
          </button>

          {/* Logo */}
          <div 
            onClick={() => handleTabChange('home')}
            className="absolute left-1/2 lg:left-[69px] -translate-x-1/2 lg:translate-x-0 top-1/2 lg:top-[17.28px] -translate-y-1/2 lg:translate-y-0 w-[110px] h-[30px] lg:w-[138px] lg:h-[37.44px]"
            style={{ 
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            <img 
              src={imgLogo} 
              alt="Logo"
              style={{ 
                position: 'absolute',
                width: '100%',
                height: '368.59%',
                left: '-11.45%',
                top: '-115.04%',
                maxWidth: 'none'
              }}
            />
          </div>

          {/* Mobile User Avatar (right side) */}
          <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {/* Notification */}
            <button 
              className="relative w-9 h-9 flex items-center justify-center"
              aria-label="Notifications"
            >
              <div style={{ 
                position: 'absolute', 
                width: '36px', 
                height: '36px', 
                background: 'rgba(255, 255, 255, 0.12)', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}></div>
              <Bell size={18} color="#FFFFFF" strokeWidth={2} />
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="relative w-9 h-9 flex items-center justify-center"
              aria-label="Logout"
            >
              <div style={{ 
                position: 'absolute', 
                width: '36px', 
                height: '36px', 
                background: 'rgba(255, 255, 255, 0.12)', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}></div>
              <LogOut size={18} color="#FFFFFF" strokeWidth={2} />
            </button>
            
            {/* Avatar */}
            <div style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%',
              overflow: 'hidden'
            }}>
              <UserAvatar 
                firstName={user?.firstName} 
                lastName={user?.lastName} 
                avatar={user?.avatar}
                className="w-full h-full"
                fallbackClassName="text-sm font-semibold"
              />
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex" style={{ position: 'absolute', left: '220px', right: '40px', top: '0px', height: '72px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            {/* Left Side: Navigation Items */}
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: '8px' }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 16px',
                    borderRadius: '5px 5px 0px 0px',
                    fontFamily: 'Lexend',
                    fontWeight: 600,
                    fontSize: '12px',
                    lineHeight: '15px',
                    color: activeTab === tab.id ? '#005C32' : '#F4FFF3',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right Side: Avatar Section - Aligned at bottom */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '50px' }}>
              {/* User Info */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '13px', lineHeight: '16px', color: '#F4FFF3' }}>
                  {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                </span>
                <span style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '11px', lineHeight: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              
              {/* Avatar */}
              <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0, cursor: 'pointer' }}>
                <UserAvatar 
                  firstName={user?.firstName} 
                  lastName={user?.lastName} 
                  avatar={user?.avatar}
                  className="w-full h-full"
                  fallbackClassName="text-sm font-semibold"
                />
              </div>
              
              {/* Notification */}
              <button style={{ 
                position: 'relative', 
                width: '38px', 
                height: '38px', 
                flexShrink: 0,
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}>
                <Bell size={20} color="#FFFFFF" strokeWidth={2} />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  background: '#FF4D4D',
                  borderRadius: '50%',
                  border: '2px solid #005C32'
                }}></div>
              </button>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                style={{ 
                  height: '38px', 
                  padding: '0 16px',
                  flexShrink: 0,
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                className="hover:bg-white/20"
              >
                <LogOut size={20} color="#FFFFFF" strokeWidth={2} />
                <span style={{ 
                  fontFamily: 'Lexend', 
                  fontWeight: 600, 
                  fontSize: '13px', 
                  color: '#FFFFFF' 
                }}>
                  Logout
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-[#005C32] border-t border-white/10 z-50">
              <div className="flex flex-col gap-1 p-4">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                    className={`text-left px-4 py-3 rounded ${activeTab === tab.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    style={{ 
                      fontFamily: 'Lexend', 
                      fontWeight: 600, 
                      fontSize: '14px', 
                      color: activeTab === tab.id ? '#FFFFFF' : '#F4FFF3',
                      transition: 'background 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Dynamic Content Area - With loading state */}
      <div style={{ position: 'relative', flex: 1 }}>
        {isTabSwitching ? (
          <div className="pt-10">
            {activeTab === 'home' && <AdminHomeSkeleton />}
            {activeTab === 'finances' && <AdminFinanceSkeleton />}
            {activeTab === 'settings' && <AdminSettingsSkeleton />}
            {activeTab === 'user-mgt' && <AdminManagementSkeleton title="User Management" />}
            {activeTab === 'car-inventory' && <AdminManagementSkeleton title="Car Inventory" />}
            {activeTab === 'subscriptions' && <AdminSubscriptionsSkeleton />}
            {activeTab === 'cms' && <AdminCMSSkeleton />}
            {activeTab === 'customer-support' && <AdminPlaceholderSkeleton />}
          </div>
        ) : (
          <div style={{ opacity: 1, transition: 'opacity 0.3s' }}>
            {activeTab === 'home' && <AdminHomeContent />}
            {activeTab === 'finances' && <AdminFinanceContent />}
            {activeTab === 'user-mgt' && <AdminUserMgtContent />}
            {activeTab === 'car-inventory' && <PlaceholderContent title="Car Inventory" />}
            {activeTab === 'subscriptions' && <AdminSubscriptionsContent />}
            {activeTab === 'customer-support' && (
              <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] py-10">
                <CustomerSupportView userType="admin" />
              </div>
            )}
            {activeTab === 'cms' && <PlaceholderContent title="CMS" />}
            {activeTab === 'settings' && (
              <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] py-10">
                <AdminSettingsView />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderContent({ title }: { title: string }) {
  return (
    <>
      {/* Sub Navigation */}
      <div style={{ background: '#FFFFFF', boxShadow: '0px 5px 8px rgba(70, 78, 95, 0.02)', minHeight: '60px', display: 'flex', alignItems: 'center', width: '100%', marginBottom: '20px' }} className="px-4 sm:px-6 lg:px-0">
        <div className="max-w-[1500px] mx-auto px-0 sm:px-6 lg:px-[102px] w-full">
          <div style={{ display: 'flex', gap: '30px', overflowX: 'auto' }} className="pb-2 sm:pb-0">
            <div style={{ background: '#CCDED6', borderRadius: '6px', padding: '15px 33px', whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px', lineHeight: '15px', color: '#005C32' }}>{title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10 lg:pb-[90px]">
        <div style={{ background: '#FFFFFF', borderRadius: '14.32px', padding: '20px' }} className="sm:p-8 lg:p-[34px]">
          <h1 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: 'clamp(18px, 3vw, 22.912px)', lineHeight: '150%', letterSpacing: '-0.02em', color: '#060606', margin: '0' }}>{title}</h1>
          <p style={{ fontFamily: 'Lexend', fontSize: '14px', color: '#6B7280', marginTop: '20px' }}>Content for {title} coming soon...</p>
        </div>
      </div>
    </>
  );
}
