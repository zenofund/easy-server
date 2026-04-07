import { useState } from 'react';
import { Loader2, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '../ui/Spinner';
import api from '../../lib/api';
import signInImage from 'figma:asset/82070ab6e6d2779504e4fecb52bba5d0ece6bb23.png';

type Step = 'email' | 'otp' | 'new-password' | 'success';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('otp');
      toast.success('Verification code sent to your email');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.error || 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Verification code resent to your email');
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.response?.data?.error || 'Failed to resend code');
    } finally {
      setIsResending(false);
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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(digit => !digit)) {
      toast.error('Please enter the full verification code');
      return;
    }
    // We don't verify separately on the backend here, we'll verify during password reset
    // but to match UI flow, we'll just move to next step. 
    // Actually, a better UX is to verify code before showing password fields.
    // However, our backend reset-password endpoint takes the code.
    setStep('new-password');
  };

  const handlePasswordChange = (val: string) => {
    setNewPassword(val);
    const isValid = val.length >= 8 && /[A-Za-z]/.test(val) && /\d/.test(val);
    setIsPasswordValid(isValid);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast.error('Password must be at least 8 characters and include both letters and numbers');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        code: otp.join(''),
        newPassword
      });
      setStep('success');
      toast.success('Password updated successfully');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white overflow-x-hidden min-h-screen">
      <div className="w-full">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:min-h-[900px]">
          <div
            className="hidden lg:block lg:w-[50%] relative"
            style={{
              background: `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${signInImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
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
          <div className="w-full lg:w-[50%] flex justify-center px-4 py-8 lg:pt-[120px] lg:pb-12">
            <div className="w-full max-w-[400px]">
              <div className="mb-6">
                {step !== 'success' && (
                  <button
                    onClick={() => {
                      if (step === 'email') window.location.hash = '#sign-in';
                      if (step === 'otp') setStep('email');
                      if (step === 'new-password') setStep('otp');
                    }}
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
                  {step === 'email' && 'Forgot Password?'}
                  {step === 'otp' && 'Verification Code'}
                  {step === 'new-password' && 'Reset Password'}
                  {step === 'success' && 'Password Updated!'}
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
                  {step === 'email' && 'Enter your email address to receive a verification code.'}
                  {step === 'otp' && `We sent a code to ${email}. Enter it below.`}
                  {step === 'new-password' && 'Create a new secure password for your account.'}
                  {step === 'success' && 'Your password has been successfully updated.'}
                </p>
              </div>
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#060606',
                      }}
                    >
                      Email Address
                    </label>
                    <input
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
                    {isLoading ? <Spinner size="sm" variant="white" /> : 'Send Code'}
                  </button>
                </form>
              )}
              {step === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
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
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? <Spinner size="sm" variant="white" /> : 'Verify Code'}
                  </button>
                </form>
              )}
              {step === 'new-password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#060606',
                      }}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
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
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#060606',
                      }}
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-0 border-none bg-transparent cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} color="#6B7280" />
                        ) : (
                          <Eye size={18} color="#6B7280" />
                        )}
                      </button>
                    </div>
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
                    {isLoading ? <Spinner size="sm" variant="white" /> : 'Update Password'}
                  </button>
                </form>
              )}
              {step === 'success' && (
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
                    Password Updated!
                  </h2>
                  <p
                    className="mb-8"
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#6B7280',
                    }}
                  >
                    Your password has been successfully updated. You can now sign in with your new password.
                  </p>
                  <button
                    onClick={() => window.location.hash = '#sign-in'}
                    className="w-full py-3.5 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      background: '#005C32',
                      fontFamily: 'Lexend',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                    }}
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
