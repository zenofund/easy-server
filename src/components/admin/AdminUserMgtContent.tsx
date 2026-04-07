import { Search, ListFilter, ChevronLeft, ChevronRight, Loader2, MessageSquare, UserMinus, Edit, MoreVertical, UserCheck, CheckCircle, AlertCircle, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { toast } from 'sonner';
import { UserAvatar } from '../UserAvatar';
import { AdminUserDetailsView } from './AdminUserDetailsView';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { SkeletonLoader } from "../ui/SkeletonLoader";
import { Modal } from "../ui/Modal";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

type SubTab = 'Buyers' | 'Sellers' | 'Inspector' | 'Staff' | 'Admin';

interface UserData {
  id: string;
  name: string;
  role?: string;
  businessName?: string;
  officeName?: string;
  email: string;
  phone: string;
  offersSubmitted: number;
  totalPurchases: number;
  totalListings?: number;
  totalInspections?: number;
  registrationDate: string;
  status: 'ACTIVE' | 'PENDING' | 'DEACTIVATED';
  avatar?: string | null;
}

export function AdminUserMgtContent() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Buyers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Deactivated'>('All');
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [createFormData, setCreateFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'BUYER'
  });

  useEffect(() => {
    if (selectedUser && isEditModalOpen) {
      const [firstName = '', ...lastNameParts] = selectedUser.name.split(' ');
      setEditFormData({
        firstName,
        lastName: lastNameParts.join(' '),
        email: selectedUser.email,
        phone: selectedUser.phone
      });
    }
  }, [selectedUser, isEditModalOpen]);

  const itemsPerPage = 10;

  const handleDeactivate = async (user: UserData) => {
    setActionLoading('deactivate');
    try {
      const newStatus = user.status === 'DEACTIVATED' ? 'Active' : 'Deactivated';
      await api.patch(`/admin/users/${user.id}/status`, { 
        status: newStatus
      });
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: newStatus === 'Active' ? 'ACTIVE' : 'DEACTIVATED' } : u
      ));
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
      setActionLoading(null);
    }
  };

  const handleApproveSeller = async (user: UserData) => {
    setActionLoading('approve');
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: 'Active' });
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: 'ACTIVE' } : u
      ));
      toast.success('Seller approved successfully', {
        icon: <CheckCircle className="w-5 h-5 text-[#005C32]" />
      });
    } catch (error: any) {
      console.error('Error approving seller:', error);
      toast.error(error.response?.data?.error || 'Failed to approve seller', {
        icon: <AlertCircle className="w-5 h-5 text-[#DC2626]" />
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async (userId: string, content: string) => {
    if (!content.trim()) {
      toast.error('Please enter a message content');
      return;
    }
    setActionLoading('message');
    try {
      await api.post(`/admin/users/${userId}/message`, { content });
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
      setActionLoading(null);
    }
  };

  const handleEditUser = async (userId: string, data: any) => {
    setActionLoading('edit');
    try {
      await api.patch(`/admin/users/${userId}`, data);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, name: `${data.firstName} ${data.lastName}`, email: data.email, phone: data.phone } : u
      ));
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
      setActionLoading(null);
    }
  };

  const handleCreateUser = async () => {
    const { firstName, lastName, email, password, role } = createFormData;
    if (!firstName || !lastName || !email || !password || !role) {
      toast.error('Please fill in all required fields');
      return;
    }

    setActionLoading('create');
    try {
      await api.post('/admin/users', createFormData);
      setIsCreateModalOpen(false);
      setCreateFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'BUYER'
      });
      // Refresh user list
      const response = await api.get('/admin/users', {
        params: {
          role: activeSubTab,
          status: statusFilter,
          search: searchQuery,
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setUsers(response.data.users);
      setTotalUsers(response.data.pagination.total);
      
      toast.success('User created successfully', {
        icon: <CheckCircle className="w-5 h-5 text-[#005C32]" />
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.error || 'Failed to create user', {
        icon: <AlertCircle className="w-5 h-5 text-[#DC2626]" />
      });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubTab, statusFilter, searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/admin/users', {
          params: {
            role: activeSubTab,
            status: statusFilter,
            search: searchQuery,
            page: currentPage,
            limit: itemsPerPage
          }
        });
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.total);
      } catch (error) {
        console.error('Error fetching admin users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [activeSubTab, statusFilter, searchQuery, currentPage]);

  if (selectedUser && !isEditModalOpen && !isMessageModalOpen && !isDeactivateModalOpen) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-24 sm:pb-10 w-full">
        <AdminUserDetailsView 
          user={selectedUser} 
          onBack={() => setSelectedUser(null)} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Sub Navigation */}
      <div style={{ background: '#FFFFFF', boxShadow: '0px 5px 8px rgba(70, 78, 95, 0.02)', minHeight: '60px', display: 'flex', alignItems: 'center', width: '100%', marginBottom: '40px' }} className="px-4 sm:px-6 lg:px-0">
        <div className="max-w-[1500px] mx-auto px-0 sm:px-6 lg:px-[92px] w-full">
          <div className="flex gap-2 sm:gap-[30px] overflow-x-auto no-scrollbar pb-1">
            {(['Buyers', 'Sellers', 'Inspector', 'Staff', 'Admin'] as SubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                style={{
                  background: activeSubTab === tab ? '#CCDED6' : 'transparent',
                }}
                className="px-3 sm:px-6 py-2.5 rounded-md border-none cursor-pointer transition-all duration-200"
              >
                <span className={`font-lexend font-medium text-sm
                  ${activeSubTab === tab ? 'text-[#060606]' : 'text-[#6B7280]'}`}>
                  {tab}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-24 sm:pb-10 w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-12 w-full lg:w-auto">
            <h1 className="font-lexend font-semibold text-[24px] text-[#060606] whitespace-nowrap">
              {activeSubTab} ({totalUsers})
            </h1>
            
            <div className="relative w-full md:max-w-[600px]">
              <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] z-10" 
                size={20} 
              />
              <Input 
                placeholder="Search here..." 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F9',
                  borderRadius: '12px',
                  paddingLeft: '48px',
                  fontFamily: 'Lexend',
                  fontSize: '15px',
                  color: '#64748B',
                  height: '52px'
                }}
                className="w-full focus-visible:ring-1 focus-visible:ring-[#005C32] placeholder:text-[#94A3B8] shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto self-start lg:self-auto">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="h-11 px-4 gap-2 bg-[#005C32] hover:bg-[#004b28] text-white font-lexend rounded-lg cursor-pointer active:scale-95 transition-all"
            >
              <UserPlus size={18} />
              Create User
            </Button>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button 
                  type="button"
                  variant="outline" 
                  className="h-11 px-4 gap-2 border-[#E2E8F9] text-gray-600 font-lexend rounded-lg cursor-pointer active:scale-95 transition-all"
                >
                  <ListFilter size={18} />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] rounded-xl border-[#E2E8F9] shadow-xl font-lexend p-2 bg-white">
                <DropdownMenuItem 
                  onClick={() => setStatusFilter(statusFilter === 'Active' ? 'All' : 'Active')} 
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors ${
                    statusFilter === 'Active' ? 'bg-[#F0FDF4] text-[#005C32]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#34D399', flexShrink: 0 }} />
                  <span className="font-medium text-sm">Active</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')} 
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors ${
                    statusFilter === 'Pending' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#F59E0B', flexShrink: 0 }} />
                  <span className="font-medium text-sm">Pending</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter(statusFilter === 'Deactivated' ? 'All' : 'Deactivated')} 
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors ${
                    statusFilter === 'Deactivated' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#DC2626', flexShrink: 0 }} />
                  <span className="font-medium text-sm">Deactivated</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Section */}
        <div 
          className="bg-white rounded-[14px] border border-[#E2E8F9] overflow-x-auto relative min-h-[400px]"
          style={{ marginTop: '50px' }}
        >
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">ID</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">
                  {activeSubTab === 'Sellers' ? 'Sellers Name' : activeSubTab === 'Buyers' ? 'Buyers Name' : activeSubTab === 'Inspector' ? 'Inspector Name' : activeSubTab === 'Staff' ? 'Staff Name' : 'Admin Name'}
                </TableHead>
                {activeSubTab === 'Sellers' && (
                  <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Business Name</TableHead>
                )}
                {activeSubTab === 'Inspector' && (
                  <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Office Name</TableHead>
                )}
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Email Address</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Phone Number</TableHead>
                {activeSubTab === 'Sellers' ? (
                  <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Total Listing</TableHead>
                ) : activeSubTab === 'Inspector' ? (
                  <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">All Inspections</TableHead>
                ) : activeSubTab === 'Staff' || activeSubTab === 'Admin' ? (
                  null
                ) : (
                  <>
                    <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Offers Submitted</TableHead>
                    <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Total Purchases</TableHead>
                  </>
                )}
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Join Date</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-lexend font-semibold text-[#8E98A8] text-xs py-5 px-6 uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, rowIndex) => (
                  <TableRow key={rowIndex} className="border-b border-[#F1F5F9]">
                    <TableCell className="py-4 px-6">
                      <SkeletonLoader className="h-4 w-12" />
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <SkeletonLoader className="w-8 h-8 rounded-full" />
                        <SkeletonLoader className="h-4 w-24" />
                      </div>
                    </TableCell>
                    {(activeSubTab === 'Sellers' || activeSubTab === 'Inspector') && (
                      <TableCell className="py-4 px-6">
                        <SkeletonLoader className="h-4 w-24" />
                      </TableCell>
                    )}
                    <TableCell className="py-4 px-6">
                      <SkeletonLoader className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <SkeletonLoader className="h-4 w-24" />
                    </TableCell>
                    {activeSubTab === 'Sellers' || activeSubTab === 'Inspector' ? (
                      <TableCell className="py-4 px-6">
                        <SkeletonLoader className="h-4 w-12" />
                      </TableCell>
                    ) : (
                      <>
                        <TableCell className="py-4 px-6">
                          <SkeletonLoader className="h-4 w-12" />
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <SkeletonLoader className="h-4 w-12" />
                        </TableCell>
                      </>
                    )}
                    <TableCell className="py-4 px-6">
                      <SkeletonLoader className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <SkeletonLoader className="w-2 h-2 rounded-full" />
                        <SkeletonLoader className="h-4 w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <SkeletonLoader className="h-4 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id} className="border-b border-[#F1F5F9] hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.id.slice(0, 8)}</TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <UserAvatar 
                          firstName={user.name.split(' ')[0]} 
                          lastName={user.name.split(' ')[1] || ''} 
                          avatar={user.avatar}
                          className="w-8 h-8"
                          fallbackClassName="text-xs"
                        />
                        <div className="flex flex-col">
                          <span 
                            className="font-lexend font-bold text-[#060606] text-sm whitespace-nowrap cursor-pointer hover:text-[#005C32] transition-colors"
                            onClick={() => setSelectedUser(user)}
                          >
                            {user.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    {activeSubTab === 'Sellers' && (
                      <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.businessName}</TableCell>
                    )}
                    {activeSubTab === 'Inspector' && (
                      <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.officeName}</TableCell>
                    )}
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.email}</TableCell>
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.phone}</TableCell>
                    {activeSubTab === 'Sellers' ? (
                      <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.totalListings}</TableCell>
                    ) : activeSubTab === 'Inspector' ? (
                      <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.totalInspections}</TableCell>
                    ) : activeSubTab === 'Staff' || activeSubTab === 'Admin' ? (
                      null
                    ) : (
                      <>
                        <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.offersSubmitted}</TableCell>
                        <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.totalPurchases}</TableCell>
                      </>
                    )}
                    <TableCell className="font-lexend font-bold text-[#060606] text-sm py-4 px-6">{user.registrationDate}</TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '9999px', 
                          backgroundColor: user.status === 'ACTIVE' ? '#34D399' : user.status === 'PENDING' ? '#F59E0B' : '#DC2626' 
                        }} />
                        <span className="font-lexend font-bold text-[#060606] text-sm">
                          {user.status === 'ACTIVE' ? 'Active' : user.status === 'PENDING' ? 'Pending' : 'Deactivated'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] font-lexend bg-white">
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit size={14} className="text-blue-600" />
                            <span>Edit Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                              setIsMessageModalOpen(true);
                            }}
                          >
                            <MessageSquare size={14} className="text-green-600" />
                            <span>Send Message</span>
                          </DropdownMenuItem>
                          {activeSubTab === 'Sellers' && user.status === 'PENDING' && (
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveSeller(user);
                              }}
                            >
                              <UserCheck size={14} className="text-[#16a34a]" />
                              <span>Approve Seller</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className={`flex items-center gap-2 cursor-pointer ${user.status === 'DEACTIVATED' ? 'text-green-600' : 'text-red-600'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                              setIsDeactivateModalOpen(true);
                            }}
                          >
                            {user.status === 'DEACTIVATED' ? (
                              <>
                                <UserCheck size={14} />
                                <span>Activate</span>
                              </>
                            ) : (
                              <>
                                <UserMinus size={14} />
                                <span>Deactivate</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={activeSubTab === 'Buyers' ? 10 : (activeSubTab === 'Staff' || activeSubTab === 'Admin') ? 8 : 10} className="text-center py-10 text-gray-500 font-lexend">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-center mt-8 border-t border-[#E2E8F9] pt-6 gap-2 sm:gap-6">
          <Button 
            variant="outline" 
            className="gap-2 font-lexend text-[#060606] border-[#E2E8F9] hover:bg-gray-50 rounded-lg px-3 sm:px-4 h-10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft size={18} />
            <span className="text-xs sm:text-sm">Previous</span>
          </Button>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Only show first page, last page, and current page +/- 1
              if (
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={isLoading}
                    className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md font-lexend text-xs sm:text-sm transition-all
                      ${currentPage === page ? 'bg-[#060606] text-white font-semibold' : 'text-[#8E98A8] hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                );
              } else if (
                (page === currentPage - 2 && page > 1) || 
                (page === currentPage + 2 && page < totalPages)
              ) {
                return <span key={page} className="text-[#8E98A8]">...</span>;
              }
              return null;
            })}
          </div>

          <Button 
            variant="outline" 
            className="gap-2 font-lexend text-[#060606] border-[#E2E8F9] hover:bg-gray-50 rounded-lg px-3 sm:px-4 h-10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || isLoading}
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
              onClick={() => selectedUser && handleEditUser(selectedUser.id, editFormData)}
              disabled={actionLoading === 'edit'}
            >
              {actionLoading === 'edit' ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        maxWidth="max-w-[742px]"
      >
        <div className="space-y-4 font-lexend">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name <span className="text-red-500">*</span></Label>
              <Input 
                value={createFormData.firstName}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="First Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name <span className="text-red-500">*</span></Label>
              <Input 
                value={createFormData.lastName}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last Name"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email Address <span className="text-red-500">*</span></Label>
            <Input 
              value={createFormData.email}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              value={createFormData.phone}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone Number"
            />
          </div>
          <div className="space-y-2 relative">
            <Label>Password <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input 
                value={createFormData.password}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role <span className="text-red-500">*</span></Label>
            <select
              value={createFormData.role}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full h-11 px-3 bg-white border border-[#E2E8F9] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005C32] font-lexend text-sm"
            >
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
              <option value="INSPECTOR">Inspector</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#005C32] hover:bg-[#004b28]"
              onClick={handleCreateUser}
              disabled={actionLoading === 'create'}
            >
              {actionLoading === 'create' ? <Loader2 className="animate-spin" size={18} /> : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Message Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title={`Message to ${selectedUser?.name}`}
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
              onClick={() => selectedUser && handleSendMessage(selectedUser.id, messageContent)}
              disabled={actionLoading === 'message' || !messageContent.trim()}
            >
              {actionLoading === 'message' ? <Loader2 className="animate-spin" size={18} /> : 'Send Message'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Modal */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title={selectedUser?.status === 'DEACTIVATED' ? 'Activate User' : 'Deactivate User'}
        maxWidth="max-w-[742px]"
      >
        <div className="space-y-4 font-lexend text-center">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${selectedUser?.status === 'DEACTIVATED' ? 'bg-green-100' : 'bg-red-100'}`}>
            {selectedUser?.status === 'DEACTIVATED' ? <UserCheck className="text-green-600" /> : <UserMinus className="text-red-600" />}
          </div>
          <p className="text-gray-600">
            Are you sure you want to {selectedUser?.status === 'DEACTIVATED' ? 'activate' : 'deactivate'} <strong>{selectedUser?.name}</strong>?
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeactivateModalOpen(false)}>Cancel</Button>
            <Button 
              className="font-lexend text-white border-none rounded-lg px-6 h-10"
              style={{ backgroundColor: selectedUser?.status === 'DEACTIVATED' ? '#16a34a' : '#DC2626' }}
              onClick={() => selectedUser && handleDeactivate(selectedUser)}
              disabled={actionLoading === 'deactivate'}
            >
              {actionLoading === 'deactivate' ? <Loader2 className="animate-spin" size={18} /> : (selectedUser?.status === 'DEACTIVATED' ? 'Activate' : 'Deactivate')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
