import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/Spinner';
import api from '../../lib/api';
import { getDashboardUrl } from '../../utils/rbac';

export function PaystackCallback() {
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    let toastId: string | number;

    const verifyPayment = async () => {
      // Get reference from search params or hash params
      const searchParams = new URLSearchParams(window.location.search);
      let reference = searchParams.get('reference');

      if (!reference) {
        const hash = window.location.hash;
        if (hash.includes('?')) {
          const hashParams = new URLSearchParams(hash.split('?')[1]);
          reference = hashParams.get('reference');
        }
      }

      if (!reference) {
        toast.error('No reference found');
        window.location.hash = getDashboardUrl(localStorage.getItem('userRole') || 'BUYER');
        return;
      }

      // Show graceful loading toast
      toastId = toast.loading('Verifying your payment...', {
        description: 'Please wait while we process your transaction.'
      });

      try {
        const response = await api.get(`/wallet/paystack/verify?reference=${reference}`);
        
        // Ensure status is explicitly 'success'
        if (response.data && response.data.status === 'success') {
          toast.success('Payment Verified!', {
            id: toastId,
            description: response.data.message || 'Your transaction has been processed successfully.'
          });
          setVerifying(false);
          // Clear URL parameters to prevent re-verification on refresh
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash.split('?')[0]);
          
          setTimeout(() => {
            const userRole = localStorage.getItem('userRole');
            window.location.hash = getDashboardUrl(userRole || 'BUYER');
          }, 1500);
        } else {
          // If status is anything other than 'success', show error
          const errorMessage = response.data?.message || 'We could not verify your payment.';
          const detailedStatus = response.data?.status ? ` (Status: ${response.data.status})` : '';
          
          toast.error('Verification Failed', {
            id: toastId,
            description: `${errorMessage}${detailedStatus}`
          });
          setVerifying(false);
          
          // Clear URL parameters even on failure
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash.split('?')[0]);
          
          // Give more time for errors
          setTimeout(() => {
            const userRole = localStorage.getItem('userRole');
            window.location.hash = getDashboardUrl(userRole || 'BUYER');
          }, 4000);
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        toast.error('Verification Error', {
          id: toastId,
          description: error.response?.data?.error || 'An error occurred during verification.'
        });
        setVerifying(false);
        setTimeout(() => {
          const userRole = localStorage.getItem('userRole');
          window.location.hash = getDashboardUrl(userRole || 'BUYER');
        }, 3000);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {verifying ? 'Verifying your payment...' : 'Verification complete'}
        </h2>
        <p className="text-gray-500">Please wait while we process your transaction.</p>
      </div>
    </div>
  );
}
