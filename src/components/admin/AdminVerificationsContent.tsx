import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import api from '../../lib/api';
import { FileText, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';

interface PendingSeller {
  id: string;
  userId: string;
  companyName: string | null;
  documents: string | null;
  identityStatus: 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    createdAt: string;
  };
}

export function AdminVerificationsContent() {
  const [sellers, setSellers] = useState<PendingSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const fetchPendingSellers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/sellers/pending-verification');
      setSellers(data);
    } catch (error: any) {
      toast.error('Failed to load pending verifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const handleVerify = async (sellerId: string, status: 'APPROVED' | 'REJECTED') => {
    if (status === 'REJECTED' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingId(sellerId);
      await api.patch(`/admin/sellers/${sellerId}/verify`, {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : undefined
      });
      
      toast.success(`Seller document ${status.toLowerCase()} successfully`);
      setRejectingId(null);
      setRejectionReason('');
      await fetchPendingSellers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.response?.data?.error || `Failed to ${status.toLowerCase()} document`);
    } finally {
      setProcessingId(null);
    }
  };

  const viewDocument = (url: string | null) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('No document URL available');
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10 lg:pb-[90px] pt-8">
      <div className="bg-white rounded-[14.32px] p-6 sm:p-8 lg:p-[34px] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-lexend font-semibold text-[22px] text-[#060606] mb-2">Seller Verifications</h1>
            <p className="font-lexend text-[#666666] text-sm">Review and approve seller identity documents.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#F4FFF3] px-4 py-2 rounded-lg border border-[#005C32]/20">
            <AlertCircle size={20} className="text-[#005C32]" />
            <span className="font-lexend font-medium text-[#005C32] text-sm">
              {sellers.length} Pending
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005C32]"></div>
          </div>
        ) : sellers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <CheckCircle size={48} className="text-gray-300 mb-4" />
            <h3 className="font-lexend font-medium text-lg text-gray-900 mb-1">All Caught Up!</h3>
            <p className="font-lexend text-gray-500 text-sm text-center">There are no pending seller verifications to review.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {sellers.map((seller) => (
              <div key={seller.id} className="border border-gray-100 rounded-xl p-6 hover:border-[#005C32]/20 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#F4FFF3] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-lexend font-semibold text-[#005C32] text-lg">
                          {seller.user.firstName.charAt(0)}{seller.user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-lexend font-medium text-lg text-gray-900">
                          {seller.user.firstName} {seller.user.lastName}
                        </h3>
                        <p className="font-lexend text-sm text-gray-500">
                          {seller.user.email} • {seller.user.phone || 'No phone'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-lexend text-xs text-gray-500 mb-1">Company Name</p>
                        <p className="font-lexend text-sm font-medium text-gray-900">{seller.companyName || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-lexend text-xs text-gray-500 mb-1">Registered On</p>
                        <p className="font-lexend text-sm font-medium text-gray-900">
                          {new Date(seller.user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {rejectingId === seller.id && (
                      <div className="mb-6 bg-red-50 rounded-lg p-4 border border-red-100">
                        <label className="block font-lexend text-sm font-medium text-red-800 mb-2">
                          Reason for Rejection
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Please explain why the document is being rejected..."
                          className="w-full px-3 py-2 border border-red-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 font-lexend text-sm mb-3"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleVerify(seller.id, 'REJECTED')}
                            disabled={processingId === seller.id || !rejectionReason.trim()}
                            className="bg-red-600 hover:bg-red-700 text-white font-lexend text-sm py-1.5 px-4 h-auto"
                          >
                            {processingId === seller.id ? 'Processing...' : 'Confirm Rejection'}
                          </Button>
                          <Button 
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason('');
                            }}
                            variant="outline"
                            className="font-lexend text-sm py-1.5 px-4 h-auto border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <Button 
                      onClick={() => viewDocument(seller.documents)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 font-lexend border-gray-200 text-gray-700 hover:bg-gray-50 h-11"
                    >
                      <FileText size={18} />
                      View Document
                    </Button>
                    
                    {rejectingId !== seller.id && (
                      <>
                        <Button 
                          onClick={() => handleVerify(seller.id, 'APPROVED')}
                          disabled={processingId === seller.id}
                          className="w-full flex items-center justify-center gap-2 bg-[#005C32] hover:bg-[#004b29] text-white font-lexend h-11"
                        >
                          <CheckCircle size={18} />
                          Approve
                        </Button>
                        
                        <Button 
                          onClick={() => setRejectingId(seller.id)}
                          disabled={processingId === seller.id}
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-lexend h-11"
                        >
                          <XCircle size={18} />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
