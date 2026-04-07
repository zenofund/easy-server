import { useState, useEffect } from 'react';
import { Menu, X, MapPin, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import brandLogo from 'figma:asset/dd4021e60093af15ba7287060ed81ec7ad84fff5.png';
import userAvatar from 'figma:asset/f77a7b555b924e5721574d1e5d638013bc02125d.png';

// Simple Bell icon component using SVG
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

import { getDashboardUrl } from '../utils/rbac';
import { getAvatarUrl, getInitials } from '../utils/avatarUtils';
import { UserAvatar } from './UserAvatar';
import { NotificationDropdown } from './NotificationDropdown';

export function Navigation({ isDashboard = false, currentPage = '' }: { isDashboard?: boolean; currentPage?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true); // Toggle state for Sign-In/Sign-Up
  const [dashboardLink, setDashboardLink] = useState('#buyer-dashboard');
  const [user, setUser] = useState<any>(null);
  const locationOptions = ['All Locations', 'Abuja', 'Lagos', 'Port Harcourt'];
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setDashboardLink(getDashboardUrl(parsedUser.role));
      } catch (e) {
        console.error('Error parsing user', e);
        setDashboardLink('#buyer-dashboard');
      }
    }

    const handleUserUpdate = (event: any) => {
      const updatedUserData = event.detail;
      if (updatedUserData) {
        setUser(updatedUserData);
      } else {
        // Fallback to localStorage if event detail is empty
        const localData = localStorage.getItem('user');
        if (localData) {
          setUser(JSON.parse(localData));
        }
      }
    };

    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    window.location.hash = '#home';
    window.location.reload();
  };

  // Sync toggle state with current page
  useEffect(() => {
    if (currentPage === 'sign-in') {
      setIsSignUp(false);
    } else if (currentPage === 'sign-up') {
      setIsSignUp(true);
    }
  }, [currentPage]);

  useEffect(() => {
    const syncLocationFromHash = () => {
      const hash = window.location.hash || '#home';
      const queryString = hash.includes('?') ? hash.split('?')[1] : '';
      const params = new URLSearchParams(queryString);
      const locationFromHash = params.get('location');
      if (locationFromHash) {
        setSelectedLocation(locationFromHash);
        localStorage.setItem('selectedLocation', locationFromHash);
        return;
      }
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        setSelectedLocation(savedLocation);
      } else {
        setSelectedLocation('All Locations');
      }
    };

    syncLocationFromHash();
    window.addEventListener('hashchange', syncLocationFromHash);
    return () => window.removeEventListener('hashchange', syncLocationFromHash);
  }, []);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocation', location);

    const hash = window.location.hash || '#home';
    const cleanHash = hash.replace('#', '');
    const [route, query = ''] = cleanHash.split('?');
    const params = new URLSearchParams(query);

    if (location === 'All Locations') {
      params.delete('location');
    } else {
      params.set('location', location);
    }

    const nextQuery = params.toString();
    const nextHash = `#buy${nextQuery ? `?${nextQuery}` : ''}`;
    if (route === 'buy' && window.location.hash === nextHash) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = nextHash;
    }
    setIsMobileMenuOpen(false);
  };
  
  const navLinks = isDashboard ? [
    { label: 'Buy a Car', href: '#buy' },
    { label: 'Sell a Car', href: '#sell-your-car' },
    { label: 'Car Sellers', href: '#sellers' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'News', href: '#news' },
  ] : [
    { label: 'Buy a Car', href: '#buy' },
    { label: 'Sell a Car', href: '#sell-your-car' },
    { label: 'Car Sellers', href: '#sellers' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'News', href: '#news' },
  ];
  
  return (
    <nav 
      className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full" 
      style={{ 
        height: '65px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-full w-full">
        <div className="flex items-center justify-between h-full relative w-full">
          {/* Logo - Clickable Home Link */}
          <a href="#home" className="flex items-center flex-shrink-0 z-10">
            <div className="w-32 sm:w-40 lg:w-[183px]" style={{ height: '49.65px' }}>
              <img
                src={brandLogo}
                alt="Huce Autos"
                className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          </a>
          
          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#060606] hover:text-brand-green transition-colors capitalize whitespace-nowrap py-1"
                style={{
                  fontFamily: 'Lexend',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '21px',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0 z-10">
            {isDashboard ? (
              // Dashboard Mode: Show Location, Bell Icon and User Avatar
              <div className="flex items-center gap-2">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2.5 px-3 py-2 border border-[#BC9C22] rounded-[11.62px] hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#999999]" strokeWidth={1} />
                        <span
                          className="text-[#999999]"
                          style={{
                            fontFamily: 'Lexend',
                            fontSize: '10.74px',
                            lineHeight: '13px',
                            fontWeight: 400,
                          }}
                        >
                          {selectedLocation}
                        </span>
                        <ChevronDown className="w-[18px] h-[18px] text-[#999999]" strokeWidth={1.5} />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8} className="min-w-[190px]">
                    {locationOptions.map((location) => (
                      <DropdownMenuItem
                        key={location}
                        onClick={() => handleLocationSelect(location)}
                        className="flex items-center justify-between"
                      >
                        <span>{location}</span>
                        {selectedLocation === location && <Check className="w-4 h-4 text-brand-green" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Bell Icon */}
                <NotificationDropdown />
                
                {/* User Avatar Dropdown */}
                <div className="relative">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex items-center justify-center transition-opacity hover:opacity-80 outline-none"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50px',
                          overflow: 'hidden'
                        }}
                      >
                        <UserAvatar 
                          firstName={user?.firstName} 
                          lastName={user?.lastName} 
                          avatar={user?.avatar}
                          className="w-full h-full"
                          fallbackClassName="text-sm font-semibold"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-40 p-0 mt-2 bg-transparent border-none shadow-none flex flex-col gap-1 overflow-visible"
                      sideOffset={5}
                    >
                      <DropdownMenuItem 
                        onClick={() => {
                          window.location.hash = dashboardLink;
                        }}
                        className="flex items-center justify-end px-3 py-1.5 cursor-pointer bg-white hover:bg-gray-50 rounded-lg transition-colors group outline-none border border-gray-100 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]"
                      >
                        <span className="text-sm font-medium text-gray-700 group-hover:text-brand-green transition-colors text-right">Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          handleLogout();
                        }}
                        className="flex items-center justify-end px-3 py-1.5 cursor-pointer bg-white hover:bg-red-50 rounded-lg transition-colors group outline-none border border-gray-100 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]"
                      >
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors text-right">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              // Regular Mode: Show Location Selector and Sign-In/Sign-Up
              <>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2.5 px-3 py-2 border border-[#BC9C22] rounded-[11.62px] hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#999999]" strokeWidth={1} />
                        <span
                          className="text-[#999999]"
                          style={{
                            fontFamily: 'Lexend',
                            fontSize: '10.74px',
                            lineHeight: '13px',
                            fontWeight: 400,
                          }}
                        >
                          {selectedLocation}
                        </span>
                        <ChevronDown className="w-[18px] h-[18px] text-[#999999]" strokeWidth={1.5} />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8} className="min-w-[190px]">
                    {locationOptions.map((location) => (
                      <DropdownMenuItem
                        key={location}
                        onClick={() => handleLocationSelect(location)}
                        className="flex items-center justify-between"
                      >
                        <span>{location}</span>
                        {selectedLocation === location && <Check className="w-4 h-4 text-brand-green" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Toggle Sign-In/Sign-Up */}
                <div 
                  className="relative rounded-[10px] p-[1.34px]"
                  style={{
                    background: '#F3F5F7',
                    width: '217px',
                    height: '38px',
                  }}
                >
                  <div className="flex h-full relative">
                    {/* Sign-In Button */}
                    <button
                      onClick={() => {
                        setIsSignUp(false);
                        window.location.hash = '#sign-in';
                      }}
                      className="transition-all duration-200 rounded-[1px] flex items-center justify-center"
                      style={{
                        width: '100.43px',
                        height: '33.45px',
                        background: !isSignUp ? '#BC9C22' : '#F3F5F7',
                        fontFamily: 'Lexend',
                        fontSize: '10.74px',
                        fontWeight: 500,
                        lineHeight: '150%',
                        letterSpacing: '-0.02em',
                        color: !isSignUp ? '#FFFFFF' : '#999999',
                      }}
                    >
                      Sign - In
                    </button>
                    
                    {/* Sign-Up Button */}
                    <button
                      onClick={() => {
                        setIsSignUp(true);
                        window.location.hash = '#sign-up';
                      }}
                      className="transition-all duration-200 rounded-[1px] flex items-center justify-center"
                      style={{
                        width: '113.88px',
                        height: '34.9px',
                        background: isSignUp ? '#BC9C22' : '#F3F5F7',
                        fontFamily: 'Lexend',
                        fontSize: '10.74px',
                        fontWeight: 500,
                        lineHeight: '150%',
                        letterSpacing: '-0.02em',
                        color: isSignUp ? '#FFFFFF' : '#999999',
                      }}
                    >
                      Sign - Up
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-brand-green transition-colors capitalize"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontFamily: 'Lexend',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                {link.label}
              </a>
            ))}
            
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#BC9C22] rounded-[11.62px] w-full justify-center">
                  <MapPin className="w-4 h-4 text-[#999999]" strokeWidth={1} />
                  <span className="text-[#999999]" style={{ fontFamily: 'Lexend', fontSize: '10.74px' }}>
                    {selectedLocation}
                  </span>
                  <ChevronDown className="w-[18px] h-[18px] text-[#999999]" strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" sideOffset={8} className="min-w-[220px]">
                {locationOptions.map((location) => (
                  <DropdownMenuItem
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className="flex items-center justify-between"
                  >
                    <span>{location}</span>
                    {selectedLocation === location && <Check className="w-4 h-4 text-brand-green" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Auth Toggle */}
            {isDashboard ? (
              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => {
                    window.location.hash = dashboardLink;
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-center rounded-lg border border-[#BC9C22] text-[#BC9C22] bg-white hover:bg-gray-50 transition-colors"
                  style={{
                    fontFamily: 'Lexend',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 text-center rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  style={{
                    fontFamily: 'Lexend',
                    fontSize: '15px',
                    fontWeight: 500,
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div 
                className="relative rounded-[10px] p-[1.34px] mx-auto"
                style={{
                  background: '#F3F5F7',
                  width: '247px',
                  height: '38px',
                }}
              >
                <div className="flex h-full relative">
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      window.location.hash = '#sign-in';
                      setIsMobileMenuOpen(false);
                    }}
                    className="transition-all duration-200 rounded-[1px] flex items-center justify-center"
                    style={{
                      width: '113.43px',
                      height: '33.45px',
                      background: !isSignUp ? '#BC9C22' : '#F3F5F7',
                      fontFamily: 'Lexend',
                      fontSize: '10.74px',
                      fontWeight: 500,
                      color: !isSignUp ? '#FFFFFF' : '#999999',
                    }}
                  >
                    Sign - In
                  </button>
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      window.location.hash = '#sign-up';
                      setIsMobileMenuOpen(false);
                    }}
                    className="transition-all duration-200 rounded-[1px] flex items-center justify-center"
                    style={{
                      width: '130.88px',
                      height: '34.9px',
                      background: isSignUp ? '#BC9C22' : '#F3F5F7',
                      fontFamily: 'Lexend',
                      fontSize: '10.74px',
                      fontWeight: 500,
                      color: isSignUp ? '#FFFFFF' : '#999999',
                    }}
                  >
                    Sign - Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
