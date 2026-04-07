import { useState } from 'react';
import { Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import signInImage from 'figma:asset/82070ab6e6d2779504e4fecb52bba5d0ece6bb23.png';
import api from '../../lib/api';
import { toast } from 'sonner';
import { Spinner } from '../ui/Spinner';

export function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validatePassword = (pass: string) => {
    return pass.length >= 8 && /[A-Za-z]/.test(pass) && /\d/.test(pass);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setIsPasswordValid(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Signed in successfully!');
      
      // Redirect based on role
      if (response.data.user.role === 'ADMIN') {
        window.location.hash = '#admin';
      } else if (response.data.user.role === 'SELLER') {
        window.location.hash = '#seller-dashboard';
      } else {
        window.location.hash = '#buyer-dashboard';
      }
      window.location.reload();

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle unverified user
      if (error.response?.status === 403 && error.response?.data?.unverified) {
        toast.info('Please verify your email to continue');
        // Small delay to ensure the toast is seen and state is clear
        setTimeout(() => {
          window.location.hash = `#sign-up?verify=${encodeURIComponent(email)}`;
        }, 100);
        return;
      }
      
      // Handle pending or deactivated user
      if (error.response?.status === 403 && error.response?.data?.status) {
        toast.error(error.response.data.error);
        return;
      }

      const errorMessage = error.response?.data?.error || 'Failed to sign in. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
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
              background: `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${signInImage})`,
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

          {/* Right Side - Sign In Form */}
          <div className="w-full lg:w-[50%] flex justify-center px-4 py-8 lg:pt-[120px] lg:pb-12">
            <div className="w-full max-w-[400px]">
              {/* Title Section */}
              <div className="mb-6">
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
                  Sign In
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
                  Welcome back to continue!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Forgot Password */}
                <div className="text-right">
                  <a
                    href="#forgot-password"
                    className="hidden lg:inline"
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
                  <span
                    className="lg:hidden"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 300,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6B7280',
                    }}
                  >
                    Forgot Password
                  </span>
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
                      <span>Signing In...</span>
                    </>
                  ) : (
                    'Proceed'
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

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
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

              {/* Sign Up Link */}
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
                  href="#sign-up"
                  className="hidden lg:inline"
                  style={{
                    color: '#005C32',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Sign Up
                </a>
                <span
                  className="lg:hidden"
                  style={{
                    color: '#005C32',
                    fontWeight: 500,
                  }}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
