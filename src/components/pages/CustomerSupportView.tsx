import React, { useState, useEffect } from 'react';
import { UserAvatar } from '../UserAvatar';
import { SupportChatView } from './SupportChatView';
import { supportService, SupportTicket } from '../../services/support.service';
import { socketService } from '../../services/socket.service';
import { toast } from 'sonner';
import { AdminPlaceholderSkeleton } from '../ui/SkeletonLoader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Modal } from '../ui/Modal';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

interface Ticket {
  id: string;
  receivedDate: string;
  customerName: string;
  issueType: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedRep: string;
  lastResponse: string;
  status: 'Resolved' | 'Pending' | 'Open';
}

interface CustomerSupportViewProps {
  userType?: 'buyer' | 'seller' | 'admin';
}

export function CustomerSupportView({ userType = 'seller' }: CustomerSupportViewProps) {
  const [activeTab, setActiveTab] = useState<'All Ticket' | 'Open Ticket' | 'Closed Ticket'>('All Ticket');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'MEDIUM', initialMessage: '' });
  const [isCreating, setIsCreating] = useState(false);

  const fetchTickets = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await supportService.getTickets(page, 10, activeTab, searchQuery);
      setTickets(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTickets(newPage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);

    // Socket.io integration for real-time ticket updates
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    const unsubNewTicket = socketService.subscribe('new_support_ticket', (newTicket: SupportTicket) => {
      if (userType === 'admin') {
        setTickets(prev => {
          if (prev.some(t => t.id === newTicket.id)) return prev;
          return [newTicket, ...prev];
        });
        toast.info(`New support ticket: ${newTicket.subject}`);
      }
    });

    const unsubStatusUpdate = socketService.subscribe('support_ticket_status_updated', ({ ticketId, status }: { ticketId: string, status: string }) => {
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: status as any } : t));
      if (userType !== 'admin') {
        toast.info(`Ticket status updated to ${status}`);
      }
    });

    return () => {
      mq.removeEventListener('change', update);
      unsubNewTicket();
      unsubStatusUpdate();
    };
  }, [userType]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.initialMessage) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsCreating(true);
      const ticket = await supportService.createTicket(newTicket);
      toast.success('Support ticket created successfully');
      setIsCreateModalOpen(false);
      setNewTicket({ subject: '', priority: 'MEDIUM', initialMessage: '' });
      setTickets(prev => [ticket, ...prev]);
      
      // Open the chat for the new ticket
      setSelectedTicketId(ticket.id);
      setShowChat(true);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create support ticket');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      await supportService.updateStatus(ticketId, status);
      toast.success(`Ticket status updated to ${status}`);
      fetchTickets(pagination.page);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  const tabs = ['All Ticket', 'Open Ticket', 'Closed Ticket'] as const;

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: isMobile ? '12px 8px' : '16px 8px',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: '500',
    color: '#999999',
    whiteSpace: 'nowrap'
  };

  const tdStyle: React.CSSProperties = {
    padding: isMobile ? '16px 8px' : '24px 8px',
    fontSize: isMobile ? '13px' : '14px',
    color: '#666666',
    whiteSpace: 'nowrap'
  };

  if (showChat) {
    return <SupportChatView 
      onBack={() => {
        setShowChat(false);
        setSelectedTicketId(null);
        fetchTickets();
      }} 
      isMobile={isMobile} 
      userType={userType} 
      ticketId={selectedTicketId || undefined}
    />;
  }

  return (
    <>
      <h2 style={{ 
        fontWeight: 'bold', 
        fontSize: isMobile ? '20px' : '24px', 
        color: '#000000', 
        marginBottom: isMobile ? '24px' : '40px' 
      }}>
        Customer Support
      </h2>

      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'flex-start',
        marginBottom: isMobile ? '32px' : '48px',
        gap: isMobile ? '20px' : '24px'
      }}>
        <div style={{ textAlign: isMobile ? 'left' : 'left' }}>
          <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', marginBottom: '12px' }}>
            Hi {user?.firstName || (userType === 'admin' ? 'Admin' : 'Victor')}!
          </h3>
          <p style={{ color: '#999999', fontSize: isMobile ? '14px' : '16px' }}>
            {userType === 'admin' 
              ? 'Manage and respond to customer support tickets here.'
              : 'Ask us anything or share your Review with us!'}
          </p>
        </div>

        {/* Start Conversation Card - Hidden for Admins */}
        {userType !== 'admin' && (
          <div style={{ 
            background: '#FFFFFF',
            border: '1px solid #E2E8F9',
            borderRadius: '16px',
            padding: isMobile ? '16px' : '24px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '32px',
            minWidth: isMobile ? 'auto' : '300px',
            position: 'relative'
          }}>
            {/* Vertical Divider - Hidden on mobile or replaced by spacing */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                left: '0',
                top: '20%',
                bottom: '20%',
                width: '1px',
                background: '#E2E8F9',
                marginLeft: '-32px'
              }} />
            )}

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', marginBottom: '16px' }}>Start a conversation</h4>
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                {[1, 2, 3, 4].map((i) => (
                  <UserAvatar 
                    key={i}
                    firstName={`Support`} 
                    lastName={`${i}`} 
                    avatar={null}
                    className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} border-2 border-white -ml-3 first:ml-0`}
                  />
                ))}
              </div>
              <button 
                onClick={() => {
                  console.log('Button clicked - current state:', isCreateModalOpen);
                  setIsCreateModalOpen(true);
                  console.log('Button clicked - state after set:', true);
                }}
                style={{
                  background: '#005C32',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: isMobile ? '10px 20px' : '12px 24px',
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                Send us a message
              </button>
            </div>

            <div style={{ 
              borderTop: isMobile ? '1px solid #E2E8F9' : 'none',
              paddingTop: isMobile ? '16px' : '0'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Our reply time</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#999999', fontSize: '12px' }}>
                <ClockIcon />
                <span>Under 5 minutes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '20px' : '32px', 
        borderBottom: '1px solid #F0F0F0',
        marginBottom: isMobile ? '24px' : '32px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 0',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '500',
              color: activeTab === tab ? '#005C32' : '#999999',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #005C32' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Section Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        marginBottom: '24px',
        gap: isMobile ? '16px' : '0'
      }}>
        <h3 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold' }}>All Tickets({pagination.total})</h3>
        <div style={{ position: 'relative', width: isMobile ? '100%' : '300px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #E2E8F9',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <AdminPlaceholderSkeleton />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                <th style={{ ...thStyle, width: '60px' }}>ID</th>
                <th style={thStyle}>Received Date</th>
                <th style={thStyle}>{userType === 'seller' ? 'Customer Name' : 'Sender Name'}</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Last Update</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#999999' }}>
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ ...tdStyle, width: '60px' }}>{ticket.id.substring(0, 8)}</td>
                    <td style={tdStyle}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>{ticket.user ? `${ticket.user.firstName} ${ticket.user.lastName}` : (user?.firstName + ' ' + user?.lastName)}</td>
                    <td style={tdStyle}>{ticket.subject}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: ticket.priority === 'HIGH' ? '#FEE2E2' : ticket.priority === 'MEDIUM' ? '#FEF3C7' : '#F3F4F6',
                        color: ticket.priority === 'HIGH' ? '#991B1B' : ticket.priority === 'MEDIUM' ? '#92400E' : '#374151'
                      }}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: ticket.status === 'OPEN' ? '#ECFDF5' : ticket.status === 'PENDING' ? '#FFFBEB' : '#F3F4F6',
                        color: ticket.status === 'OPEN' ? '#065F46' : ticket.status === 'PENDING' ? '#92400E' : '#374151'
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={tdStyle}>{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSelectedTicketId(ticket.id);
                            setShowChat(true);
                          }}
                          style={{
                            background: '#F0F9F4',
                            color: '#005C32',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          View Chat
                        </button>
                        {userType === 'admin' && ticket.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'RESOLVED')}
                            style={{
                              background: '#FEE2E2',
                              color: '#991B1B',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: isMobile ? '8px' : '24px',
          marginTop: '40px',
          paddingBottom: '40px'
        }}>
          <button 
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '8px' : '10px 16px',
              borderRadius: '8px',
              border: pagination.page === 1 ? '1px solid #E2E8F9' : '1px solid #005C32',
              background: 'none',
              color: pagination.page === 1 ? '#999999' : '#005C32',
              fontFamily: 'Lexend',
              fontSize: '14px',
              fontWeight: 500,
              cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
            }}>
            <ArrowLeftIcon />
            {!isMobile && 'Previous'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {(() => {
              const pages = [];
              const { page, totalPages } = pagination;
              
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (page <= 4) {
                  for (let i = 1; i <= 5; i++) pages.push(i);
                  pages.push('...');
                  pages.push(totalPages);
                } else if (page >= totalPages - 3) {
                  pages.push(1);
                  pages.push('...');
                  for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  pages.push('...');
                  for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                  pages.push('...');
                  pages.push(totalPages);
                }
              }

              return pages.map((p, i) => (
                <button
                  key={i}
                  disabled={p === '...'}
                  onClick={() => typeof p === 'number' && handlePageChange(p)}
                  style={{
                    width: isMobile ? '32px' : '40px',
                    height: isMobile ? '32px' : '40px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Lexend',
                    fontSize: '14px',
                    fontWeight: 500,
                    background: pagination.page === p ? '#005C32' : 'none',
                    color: pagination.page === p ? '#FFFFFF' : (p === '...' ? '#999999' : '#060606'),
                    border: pagination.page === p ? 'none' : 'none',
                    cursor: p === '...' ? 'default' : 'pointer'
                  }}
                >
                  {p}
                </button>
              ));
            })()}
          </div>

          <button 
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '8px' : '10px 16px',
              borderRadius: '8px',
              border: pagination.page === pagination.totalPages ? '1px solid #E2E8F9' : '1px solid #005C32',
              background: 'none',
              color: pagination.page === pagination.totalPages ? '#999999' : '#005C32',
              fontFamily: 'Lexend',
              fontSize: '14px',
              fontWeight: 500,
              cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer'
            }}>
            {!isMobile && 'Next'}
            <ArrowRightIcon />
          </button>
        </div>
      )}

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Support Ticket"
        maxWidth="max-w-[742px]"
        padding="p-4"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C32]"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="e.g., Payment Issue, Car Dispute"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C32]"
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Message</label>
              <textarea
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C32] min-h-[100px]"
                value={newTicket.initialMessage}
                onChange={(e) => setNewTicket({ ...newTicket, initialMessage: e.target.value })}
                placeholder="Describe your issue in detail..."
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 text-sm font-medium text-white bg-[#005C32] rounded-md hover:bg-[#004d2a] disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </form>
      </Modal>
    </>
  );
}
