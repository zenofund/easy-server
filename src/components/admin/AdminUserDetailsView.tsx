import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, ChevronRight, MessageSquare, UserMinus, Edit, Mail, Phone, Calendar, Clock, User, Loader2, UserCheck, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from 'sonner';
import api from '../../lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';
import { Modal } from '../ui/Modal';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface AdminUserDetailsViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string | null;
    offersSubmitted: number;
    totalPurchases: number;
    registrationDate: string;
    lastLogin?: string;
    status: 'ACTIVE' | 'PENDING' | 'DEACTIVATED';
    role?: string;
  };
  onBack: () => void;
}

type DetailTab = 'Offers' | 'Purchases' | 'Inspection' | 'Transaction History' | 'Ticket';

export function AdminUserDetailsView({ user: initialUser, onBack }: AdminUserDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('Offers');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(initialUser);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user && isEditModalOpen) {
      const [firstName = '', ...lastNameParts] = user.name.split(' ');
      setEditFormData({
        firstName,
        lastName: lastNameParts.join(' '),
        email: user.email,
        phone: user.phone
      });
    }
  }, [user, isEditModalOpen]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/admin/users/${initialUser.id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [initialUser.id]);

  useEffect(() => {
    const fetchTabData = async () => {
      setIsLoading(true);
      try {
        let endpoint = '';
        const params: any = {
          page: currentPage,
          limit: 10,
          search: searchQuery
        };

        switch (activeTab) {
          case 'Offers':
            endpoint = `/buyers/${user.id}/activities?type=OFFER`;
            break;
          case 'Purchases':
            endpoint = `/buyers/${user.id}/activities?type=PURCHASE`;
            break;
          case 'Inspection':
            endpoint = `/buyers/${user.id}/activities?type=INSPECTION`;
            break;
          case 'Transaction History':
            endpoint = `/admin/users/${user.id}/transactions`; // Placeholder for future transaction API
            break;
          case 'Ticket':
            endpoint = `/support/tickets?userId=${user.id}`;
            break;
        }

        if (endpoint) {
          const response = await api.get(endpoint, { params });
          if (response.data.data) {
            setTableData(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
          } else {
            setTableData([]);
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        setTableData([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchTabData, 300);
    return () => clearTimeout(debounceTimer);
  }, [activeTab, user.id, currentPage, searchQuery]);

  const handleDeactivate = async () => {
    setIsActionLoading('deactivate');
    try {
      const newStatus = user.status === 'DEACTIVATED' ? 'Active' : 'Deactivated';
      await api.patch(`/admin/users/${user.id}/status`, { status: newStatus });
      setUser(prev => ({ ...prev, status: newStatus === 'Active' ? 'ACTIVE' : 'DEACTIVATED' }));
      setIsDeactivateModalOpen(false);
      toast.success(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, {
        icon: <CheckCircle className="w-5 h-5 text-[#005C32]" />
      });
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error(error.response?.data?.error || 'Failed to update user status', {
        icon: <AlertCircle className="w-5 h-5 text-[#DC2626]" />
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleApproveSeller = async () => {
    setIsActionLoading('approve');
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: 'Active' });
      setUser(prev => ({ ...prev, status: 'ACTIVE' }));
      toast.success('Seller approved successfully', {
        icon: <CheckCircle className="w-5 h-5 text-[#005C32]" />
      });
    } catch (error: any) {
      console.error('Error approving seller:', error);
      toast.error(error.response?.data?.error || 'Failed to approve seller', {
        icon: <AlertCircle className="w-5 h-5 text-[#DC2626]" />
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error('Please enter a message content');
      return;
    }
    setIsActionLoading('message');
    try {
      await api.post(`/admin/users/${user.id}/message`, { content: messageContent });
      setMessageContent('');
      setIsMessageModalOpen(false);
      toast.success('Message sent successfully', {
        icon: <CheckCircle className="w-5 h-5 text-[#005C32]" />
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error || 'Failed to send message', {
        icon: <AlertCircle className="w-5 h-5 text-[#DC2626]" />
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleEditProfile = async () => {
    setIsActionLoading('edit');
    try {
      await api.patch(`/admin/users/${user.id}`, editFormData);
      setUser(prev => ({ 
        ...prev, 
        name: `${editFormData.firstName} ${editFormData.lastName}`,
        email: editFormData.email,
        phone: editFormData.phone
      }));
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully', {
        icon: <CheckCircle className="w-5 h-5 text-[#005C32]" />
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile', {
        icon: <AlertCircle className="w-5 h-5 text-[#DC2626]" />
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  const tabs: DetailTab[] = ['Offers', 'Purchases', 'Inspection', 'Transaction History', 'Ticket'];

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300" style={{ marginTop: '50px' }}>
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#8E98A8] hover:text-[#060606] transition-colors font-lexend text-sm whitespace-nowrap"
          >
            <ChevronLeft size={20} />
            <span className="font-bold">Back</span>
          </button>
          <h1 className="font-lexend font-extrabold text-xl sm:text-2xl text-[#060606] truncate">{user.name}</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          {user.role === 'SELLER' && user.status === 'PENDING' && (
            <Button 
              className="gap-2 font-lexend text-white bg-[#16a34a] hover:bg-[#15803d] rounded-lg px-6 h-12 w-full sm:w-auto border-none"
              onClick={handleApproveSeller}
              disabled={isActionLoading === 'approve'}
            >
              {isActionLoading === 'approve' ? <Loader2 className="animate-spin" size={18} /> : <UserCheck size={18} />}
              Approve Seller
            </Button>
          )}
          <Button 
            variant="outline" 
            className="gap-2 font-lexend text-[#060606] border-[#E2E8F9] hover:bg-gray-50 rounded-lg px-6 h-12 w-full sm:w-auto"
            onClick={() => setIsEditModalOpen(true)}
            disabled={isActionLoading === 'edit'}
          >
            <Edit size={18} />
            Edit Profile
          </Button>
          <Button 
            className="gap-2 font-lexend text-white bg-[#005C32] hover:bg-[#004b28] rounded-lg px-6 h-12 w-full sm:w-auto border-none"
            onClick={() => setIsMessageModalOpen(true)}
            disabled={isActionLoading === 'message'}
          >
            <MessageSquare size={18} />
            Send Message
          </Button>
          <Button 
            className="gap-2 font-lexend text-white rounded-lg px-6 h-12 w-full sm:w-auto border-none"
            style={{ backgroundColor: user.status === 'DEACTIVATED' ? '#16a34a' : '#DC2626' }}
            onClick={() => setIsDeactivateModalOpen(true)}
            disabled={isActionLoading === 'deactivate'}
          >
            {user.status === 'DEACTIVATED' ? <UserCheck size={18} /> : <UserMinus size={18} />}
            {user.status === 'DEACTIVATED' ? 'Activate User' : 'Deactivate User'}
          </Button>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F9] p-6 lg:p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Profile Image */}
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0">
            <UserAvatar 
              firstName={user.name.split(' ')[0]} 
              lastName={user.name.split(' ')[1] || ''} 
              avatar={user.avatar}
              className="w-full h-full text-4xl border-4 border-[#F8FAFC]"
            />
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 mb-8">
              <div>
                <h3 className="font-lexend font-extrabold text-[#060606] text-lg mb-1">{user.name}</h3>
                <div className="flex flex-col gap-1">
                  <p className="font-lexend text-[#8E98A8] text-[10px]">{user.email}</p>
                  <p className="font-lexend text-[#8E98A8] text-[10px]">{user.phone}</p>
                </div>
              </div>
              <div className="h-px lg:h-12 lg:w-px bg-[#E2E8F9]" />
              
              {/* Info Row */}
              <div className="flex flex-wrap items-center justify-between gap-y-6 flex-1 pr-12">
                <InfoItem label="ID" value={user.id.slice(0, 8)} icon={<User size={14} />} />
                <InfoItem label="Offers Submitted" value={user.offersSubmitted.toString()} />
                <InfoItem label="Total Purchases" value={user.totalPurchases.toString()} />
                <InfoItem label="Join Date" value={user.registrationDate} icon={<Calendar size={14} />} />
                <InfoItem label="Last Login" value={user.lastLogin || user.registrationDate} icon={<Clock size={14} />} />
                <InfoItem 
                  label="Status" 
                  value={user.status === 'ACTIVE' ? 'Active' : user.status === 'PENDING' ? 'Pending' : 'Deactivated'} 
                  isStatus 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="border-b border-[#E2E8F9] mb-8">
        <div className="flex gap-10 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 font-lexend text-sm font-medium transition-all relative whitespace-nowrap
                ${activeTab === tab ? 'text-[#060606]' : 'text-[#8E98A8] hover:text-[#060606]'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#060606] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <h2 className="font-lexend font-bold text-xl text-[#060606] whitespace-nowrap">{activeTab}</h2>
          
          <div className="relative w-full lg:w-[600px] lg:ml-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <Input 
              placeholder="Search here..." 
              className="pl-11 h-12 bg-white border-[#E2E8F9] rounded-xl font-lexend text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[14px] border border-[#E2E8F9] overflow-x-auto min-h-[400px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <Loader2 className="animate-spin text-[#005C32]" size={40} />
            </div>
          ) : null}
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="border-none">
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">ID</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Car Make</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Seller Name</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Amount</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Date</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Details</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 font-lexend text-[#8E98A8]">
                    No {activeTab.toLowerCase()} found
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((item, index) => (
                  <TableRow key={item.id || index} className="border-b border-[#F1F5F9] hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{(index + 1).toString().padStart(2, '0')}</TableCell>
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{item.car?.title || item.carMake || 'N/A'}</TableCell>
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{item.car?.seller?.firstName ? `${item.car.seller.firstName} ${item.car.seller.lastName}` : (item.sellerName || 'N/A')}</TableCell>
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">N{item.amount || item.offerAmount || '0'}</TableCell>
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{new Date(item.createdAt || item.offerDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">
                      <span className={item.inspectionStatus?.includes('Passed') ? 'text-[#005C32]' : ''}>
                        {item.inspectionStatus || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Accepted' || item.status === 'SUCCESS' ? 'bg-[#34D399]' : 'bg-[#F59E0B]'}`} />
                        <span className="font-lexend font-bold text-[#060606] text-sm">{item.status}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-center mt-8 border-t border-[#E2E8F9] pt-6 gap-2 sm:gap-6">
          <Button 
            variant="outline" 
            className="gap-2 font-lexend text-[#060606] border-[#E2E8F9] hover:bg-gray-50 rounded-lg px-3 sm:px-4 h-10 transition-all active:scale-95 disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
            <span className="text-xs sm:text-sm">Previous</span>
          </Button>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md font-lexend text-xs sm:text-sm transition-all
                  ${currentPage === page ? 'bg-[#060606] text-white font-semibold' : 'text-[#8E98A8] hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            className="gap-2 font-lexend text-[#060606] border-[#E2E8F9] hover:bg-gray-50 rounded-lg px-3 sm:px-4 h-10 transition-all active:scale-95 disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <span className="text-xs sm:text-sm">Next</span>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* Modals */}
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Profile"
        maxWidth="max-w-[742px]"
      >
        <div className="space-y-4 font-lexend">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input 
                value={editFormData.firstName}
                onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="First Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input 
                value={editFormData.lastName}
                onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input 
              value={editFormData.email}
              onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              value={editFormData.phone}
              onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone Number"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#005C32] hover:bg-[#004b28]"
              onClick={handleEditProfile}
              disabled={isActionLoading === 'edit'}
            >
              {isActionLoading === 'edit' ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Message Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title={`Message to ${user.name}`}
        maxWidth="max-w-[742px]"
      >
        <div className="space-y-4 font-lexend">
          <div className="space-y-2">
            <Label>Message Content</Label>
            <Textarea 
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#005C32] hover:bg-[#004b28]"
              onClick={handleSendMessage}
              disabled={isActionLoading === 'message' || !messageContent.trim()}
            >
              {isActionLoading === 'message' ? <Loader2 className="animate-spin" size={18} /> : 'Send Message'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Modal */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title={user.status === 'DEACTIVATED' ? 'Activate User' : 'Deactivate User'}
        maxWidth="max-w-[742px]"
      >
        <div className="space-y-4 font-lexend text-center">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${user.status === 'DEACTIVATED' ? 'bg-green-100' : 'bg-red-100'}`}>
            {user.status === 'DEACTIVATED' ? <UserCheck className="text-green-600" /> : <UserMinus className="text-red-600" />}
          </div>
          <p className="text-gray-600">
            Are you sure you want to {user.status === 'DEACTIVATED' ? 'activate' : 'deactivate'} <strong>{user.name}</strong>?
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeactivateModalOpen(false)}>Cancel</Button>
            <Button 
              className="font-lexend text-white border-none rounded-lg px-6 h-10"
              style={{ backgroundColor: user.status === 'DEACTIVATED' ? '#16a34a' : '#DC2626' }}
              onClick={handleDeactivate}
              disabled={isActionLoading === 'deactivate'}
            >
              {isActionLoading === 'deactivate' ? <Loader2 className="animate-spin" size={18} /> : (user.status === 'DEACTIVATED' ? 'Activate' : 'Deactivate')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoItem({ label, value, icon, isStatus }: { 
  label: string; 
  value: string; 
  icon?: React.ReactNode; 
  isStatus?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-lexend text-[#8E98A8] text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-[#8E98A8]">{icon}</span>}
        {isStatus ? (
          <div className="flex items-center gap-1.5 justify-start w-full">
            <div 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: value === 'Active' ? '#34D399' : '#DC2626' }}
            />
            <span 
              className="font-lexend font-bold text-sm"
              style={{ color: value === 'Active' ? '#005C32' : '#DC2626' }}
            >
              {value}
            </span>
          </div>
        ) : (
          <span className="font-lexend font-bold text-[#060606] text-sm whitespace-nowrap">{value}</span>
        )}
      </div>
    </div>
  );
}
