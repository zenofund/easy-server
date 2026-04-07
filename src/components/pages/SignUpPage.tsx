import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import signUpImage from 'figma:asset/82070ab6e6d2779504e4fecb52bba5d0ece6bb23.png';
import api from '../../lib/api';
import { toast } from 'sonner';
import { TermsModal } from '../modals/TermsModal';
import { Spinner } from '../ui/Spinner';

export function SignUpPage() {
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form');
  const [userType, setUserType] = useState<'buyer' | 'seller'>('seller');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carLotName, setCarLotName] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Check for verification mode on mount and hash change
  useEffect(() => {
    const checkVerificationMode = () => {
      const hash = window.location.hash;
      // Robust parsing of hash query parameters
      const queryPart = hash.includes('?') ? hash.split('?')[1] : '';
      const params = new URLSearchParams(queryPart);
      const verifyEmail = params.get('verify');
      
      if (verifyEmail) {
        const decodedEmail = decodeURIComponent(verifyEmail);
        setEmail(decodedEmail);
        setStep('verification');
      }
    };

    checkVerificationMode();
    window.addEventListener('hashchange', checkVerificationMode);
    
    // Safety check: sometimes hash changes don't trigger listeners immediately in all browsers
    const timer = setTimeout(checkVerificationMode, 100);
    
    return () => {
      window.removeEventListener('hashchange', checkVerificationMode);
      clearTimeout(timer);
    };
  }, []);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    const isValid = val.length >= 8 && /[A-Za-z]/.test(val) && /\d/.test(val);
    setIsPasswordValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast.error('Password must be at least 8 characters and include both letters and numbers');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please accept the Terms & Conditions to proceed');
      return;
    }
    setIsLoading(true);

    try {
      // Split full name into first and last name
      const names = fullName.trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || '';

      const payload = {
        email,
        password,
        firstName,
        lastName,
        role: userType === 'seller' ? 'SELLER' : 'BUYER',
        ...(userType === 'seller' && {
          sellerProfile: {
            carLotName: carLotName.trim(),
            address: address.trim()
          }
        })
      };

      await api.post('/auth/register', payload);
      
      toast.success('Account created successfully! Please verify your email.');
      setStep('verification');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error 
        ? (typeof error.response.data.error === 'string' 
            ? error.response.data.error 
            : JSON.stringify(error.response.data.error))
        : 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(digit => !digit)) {
      toast.error('Please enter the full verification code');
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post('/auth/verify-email', {
        email,
        code: otp.join('')
      });

      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Email verified successfully!');
      setStep('success');
      
      // Auto-redirect after a delay
      setTimeout(() => {
        // Redirect based on role
        if (response.data.user.role === 'ADMIN') {
          window.location.hash = '#admin';
        } else if (response.data.user.role === 'SELLER') {
          window.location.hash = '#seller-dashboard';
        } else {
          window.location.hash = '#buyer-dashboard';
        }
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to verify email. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('New verification code sent to your email');
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.response?.data?.error || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Sign up with Google');
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding using Nominatim (OpenStreetMap)
          // Adding a User-Agent is good practice for Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en'
              }
            }
          );
          const data = await response.json();

          if (data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || '';
            const state = data.address.state || '';
            
            let formattedAddress = '';
            if (city && state) {
              formattedAddress = `${city}, ${state}`;
            } else {
              formattedAddress = city || state || data.display_name || '';
            }

            if (formattedAddress) {
              setAddress(formattedAddress);
              toast.success('Location updated successfully');
            } else {
              toast.error('Could not determine your address');
            }
          } else if (data.display_name) {
            setAddress(data.display_name);
            toast.success('Location updated successfully');
          } else {
            toast.error('Could not determine your address');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          toast.error('Failed to retrieve address. Please enter it manually.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please enable permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable');
            break;
          case error.TIMEOUT:
            toast.error('The request to get your location timed out');
            break;
          default:
            toast.error('An error occurred while retrieving location');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="bg-white overflow-x-hidden min-h-screen">
      {/* Auth Section */}
      <div className="w-full">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:min-h-[900px]">
          {/* Left Side - Image (Desktop Only) */}
          <div
            className="hidden lg:block lg:w-[50%] relative"
            style={{
              background: `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${signUpImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Huce Autos Logo */}
            <div className="absolute bottom-24 left-12">
              <h2
                className="mb-2"
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 600,
                  fontSize: '28px',
                  lineHeight: '35px',
                  color: '#FFFFFF',
                }}
              >
                HUCE AUTOS
              </h2>
              <p
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 300,
                  fontSize: '10px',
                  lineHeight: '13px',
                  color: '#FFFFFF',
                }}
              >
                Drive with Confidence
              </p>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="w-full lg:w-[50%] flex justify-center px-4 py-8 lg:pt-[120px] lg:pb-12">
            <div className="w-full max-w-[400px]">
              {step !== 'success' && (
                <div className="mb-6">
                  {step === 'verification' && (
                    <button
                      onClick={() => setStep('form')}
                      className="flex items-center gap-2 text-[#6B7280] hover:text-[#060606] transition-colors mb-6"
                    >
                      <ArrowLeft size={20} />
                      <span
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '20px',
                        }}
                      >
                        Back
                      </span>
                    </button>
                  )}
                  <h1
                    className="mb-3"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 600,
                      fontSize: 'clamp(28px, 4vw, 36px)',
                      lineHeight: '1.2',
                      color: '#060606',
                    }}
                  >
                    {step === 'form' ? 'Sign Up' : 'Verification Code'}
                  </h1>
                  <p
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6B7280',
                    }}
                  >
                    {step === 'form' 
                      ? 'Create an account to continue!' 
                      : `We sent a code to ${email}. Enter it below.`}
                  </p>
                </div>
              )}

              {step === 'form' ? (
                <>
                  {/* User Type Switcher */}
                  <div
                    className="flex p-1 rounded-lg mb-6"
                style={{
                  background: '#F3F5F7',
                }}
              >
                <button
                  type="button"
                  onClick={() => setUserType('buyer')}
                  className="flex-1 py-2 rounded-md border-none cursor-pointer transition-all"
                  style={{
                    background: userType === 'buyer' ? '#FFFFFF' : 'transparent',
                    fontFamily: 'Lexend',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: userType === 'buyer' ? '#060606' : '#6B7280',
                  }}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('seller')}
                  className="flex-1 py-2 rounded-md border-none cursor-pointer transition-all"
                  style={{
                    background: userType === 'seller' ? '#BC9C22' : 'transparent',
                    fontFamily: 'Lexend',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: userType === 'seller' ? '#FFFFFF' : '#6B7280',
                  }}
                >
                  Seller
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#060606',
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="w-full px-4 py-3.5 border border-[#E2E8F9] rounded-lg outline-none focus:border-[#005C32] transition-colors"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 300,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6B7280',
                    }}
                  />
                </div>

                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#060606',
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter Email"
                    className="w-full px-4 py-3.5 border border-[#E2E8F9] rounded-lg outline-none focus:border-[#005C32] transition-colors"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 300,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6B7280',
                    }}
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-2"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#060606',
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your Phone Number"
                    className="w-full px-4 py-3.5 border border-[#E2E8F9] rounded-lg outline-none focus:border-[#005C32] transition-colors"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 300,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6B7280',
                    }}
                  />
                </div>

                {/* Seller-specific fields */}
                {userType === 'seller' && (
                  <>
                    {/* Car Lot Name Field */}
                    <div>
                      <label
                        htmlFor="carLotName"
                        className="block mb-2"
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#060606',
                        }}
                      >
                        Name of Car Lot
                      </label>
                      <input
                        id="carLotName"
                        type="text"
                        value={carLotName}
                        onChange={(e) => setCarLotName(e.target.value)}
                        placeholder="Enter Car Lot Name"
                        className="w-full px-4 py-3.5 border border-[#E2E8F9] rounded-lg outline-none focus:border-[#005C32] transition-colors"
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 300,
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#6B7280',
                        }}
                      />
                    </div>

                    {/* Address Field with Locate Me */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block mb-2"
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#060606',
                        }}
                      >
                        Address
                      </label>
                      <div className="relative">
                        <input
                          id="address"
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter Address"
                          className="w-full px-4 py-3.5 pr-28 border border-[#E2E8F9] rounded-lg outline-none focus:border-[#005C32] transition-colors"
                          style={{
                            fontFamily: 'Lexend',
                            fontWeight: 300,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#6B7280',
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleLocateMe}
                          disabled={isLocating}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 border border-[#E2E8F9] rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5"
                          style={{
                            fontFamily: 'Lexend',
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#060606',
                            opacity: isLocating ? 0.7 : 1,
                            cursor: isLocating ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isLocating ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Locating...</span>
                            </>
                          ) : (
                            'Locate Me'
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#060606',
                    }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="Enter Password"
                      className="w-full px-4 py-3.5 pr-12 border border-[#E2E8F9] rounded-lg outline-none focus:border-[#005C32] transition-colors"
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 300,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#6B7280',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-0 border-none bg-transparent cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff size={18} color="#6B7280" />
                      ) : (
                        <Eye size={18} color="#6B7280" />
                      )}
                    </button>
                  </div>

                  {/* Password Requirement */}
                  <div
                    className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-md transition-all duration-300"
                    style={{
                      background: isPasswordValid ? 'rgba(107, 114, 128, 0.1)' : 'rgba(0, 92, 50, 0.1)',
                    }}
                  >
                    <CheckCircle 
                      size={12} 
                      color={isPasswordValid ? '#6B7280' : '#005C32'} 
                      strokeWidth={1.5} 
                    />
                    <span
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 300,
                        fontSize: '10px',
                        lineHeight: '14px',
                        color: isPasswordValid ? '#6B7280' : '#005C32',
                      }}
                    >
                      8+ Alphanumeric Characters
                    </span>
                  </div>
                </div>

                {/* Forgot Password (right aligned) */}
                <div className="text-right">
                  <a
                    href="#forgot-password"
                    className="inline"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 300,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6B7280',
                      textDecoration: 'none',
                    }}
                  >
                    Forgot Password
                  </a>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm font-lexend font-light text-gray-600">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-green-700 font-medium hover:underline focus:outline-none"
                    >
                      Terms & Conditions
                    </button>
                    {' '}and Privacy Policy.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg border-none cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  style={{
                    background: '#005C32',
                    fontFamily: 'Lexend',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: '#FFFFFF',
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" variant="white" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-[#E2E8F9]" />
                <span
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                  }}
                >
                  Or
                </span>
                <div className="flex-1 h-px bg-[#E2E8F9]" />
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 py-3.5 border border-[#E2E8F9] rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                    fill="#EA4335"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#060606',
                  }}
                >
                  Continue with Google
                </span>
              </button>

              {/* Sign In Link */}
              <p
                className="text-center mt-8"
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#6B7280',
                }}
              >
                Don't have an account?{' '}
                <a
                  href="#sign-in"
                  className="hidden lg:inline"
                  style={{
                    color: '#005C32',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Sign In
                </a>
                <span
                  className="lg:hidden"
                  style={{
                    color: '#005C32',
                    fontWeight: 500,
                  }}
                >
                  Sign In
                </span>
              </p>
                </>
              ) : step === 'verification' ? (
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-2xl border border-[#D1D5DB] rounded-lg outline-none focus:border-[#005C32] focus:ring-1 focus:ring-[#005C32] transition-all bg-white shadow-sm"
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 500,
                          color: '#060606',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-lg border-none cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    style={{
                      background: '#005C32',
                      fontFamily: 'Lexend',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                    }}
                  >
                    {isLoading ? <Spinner size="sm" variant="white" /> : 'Verify Email'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isResending}
                      className="text-sm hover:underline disabled:opacity-50"
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        color: '#005C32',
                      }}
                    >
                      {isResending ? 'Resending...' : "Didn't receive code? Resend"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 bg-white shadow-lg" style={{ borderRadius: '24px' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#22C55E' }}>
                      <CheckCircle size={24} color="#FFFFFF" />
                    </div>
                  </div>
                  <h2
                    className="mb-4"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 600,
                      fontSize: '24px',
                      lineHeight: '30px',
                      color: '#060606',
                    }}
                  >
                    Success Account Created
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6B7280',
                    }}
                  >
                    Your account has been successfully verified. Redirecting you to your dashboard...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setShowTermsModal(false);
        }}
      />
    </div>
  );
}
