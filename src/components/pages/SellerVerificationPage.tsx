import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

export function SellerVerificationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'UNVERIFIED' | 'PENDING' | 'REJECTED'>('UNVERIFIED');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // Initialize status from local storage
  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.sellerProfile) {
          setStatus(user.sellerProfile.identityStatus || 'UNVERIFIED');
          setRejectionReason(user.sellerProfile.rejectionReason || null);
        }
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a document to upload');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await api.post('/sellers/verify-identity', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message);
      setStatus('PENDING');

      // Update local storage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.sellerProfile) {
          user.sellerProfile.identityStatus = 'PENDING';
          user.sellerProfile.rejectionReason = null;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (error: any) {
      console.error('Verification upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToDashboard = () => {
    window.location.hash = '#seller-dashboard';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-[#E2E8F0]">
        
        {status === 'PENDING' ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#E8F4EE] mb-6">
              <CheckCircle className="h-8 w-8 text-[#005C32]" />
            </div>
            <h2 className="text-2xl font-bold text-[#060606] mb-2" style={{ fontFamily: 'Lexend' }}>
              Verification Pending
            </h2>
            <p className="text-[#6B7280] mb-8" style={{ fontFamily: 'Lexend' }}>
              Thank you for submitting your identity document. Our team is currently reviewing it. This usually takes 1-2 business days.
            </p>
            <button
              onClick={handleContinueToDashboard}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005C32] hover:bg-[#004A28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005C32] transition-colors"
              style={{ fontFamily: 'Lexend' }}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#060606] mb-2" style={{ fontFamily: 'Lexend' }}>
                Verify Your Identity
              </h2>
              <p className="text-[#6B7280]" style={{ fontFamily: 'Lexend' }}>
                Please upload a valid government-issued ID to start selling cars on Huce Autos.
              </p>
            </div>

            {status === 'REJECTED' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800" style={{ fontFamily: 'Lexend' }}>
                      Previous Submission Rejected
                    </h3>
                    <div className="mt-2 text-sm text-red-700" style={{ fontFamily: 'Lexend' }}>
                      <p>{rejectionReason || 'Your document was not accepted. Please upload a clearer image or a different valid ID.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 text-center hover:bg-[#F8F9FA] transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-[#E8F4EE] rounded-full">
                      <Upload className="w-6 h-6 text-[#005C32]" />
                    </div>
                    <div className="text-sm text-[#060606]" style={{ fontFamily: 'Lexend' }}>
                      {file ? (
                        <span className="font-medium text-[#005C32]">{file.name}</span>
                      ) : (
                        <>
                          <span className="font-medium text-[#005C32]">Click to upload</span> or drag and drop
                        </>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280]" style={{ fontFamily: 'Lexend' }}>
                      JPEG, PNG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !file}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                    isSubmitting || !file
                      ? 'bg-[#A0AEC0] cursor-not-allowed'
                      : 'bg-[#BC9C22] hover:bg-[#A68A1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC9C22]'
                  }`}
                  style={{ fontFamily: 'Lexend' }}
                >
                  {isSubmitting ? 'Uploading...' : 'Submit Document'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
