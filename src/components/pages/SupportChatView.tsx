import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '../ui/Spinner';
import { UserAvatar } from '../UserAvatar';
import { supportService, SupportMessage, SupportTicket } from '../../services/support.service';
import { socketService } from '../../services/socket.service';
import { toast } from 'sonner';
import { getAvatarUrl } from '../../utils/avatarUtils';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const AttachmentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const DoubleCheckIcon = ({ color = "#FFFFFF" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 13 10 16 18 8" />
    <polyline points="2 13 5 16 13 8" />
  </svg>
);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  senderName?: string;
  senderRole?: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  avatar?: string;
}

interface SupportChatViewProps {
  onBack: () => void;
  isMobile?: boolean;
  userType?: 'buyer' | 'seller' | 'admin';
  ticketId?: string;
}

export function SupportChatView({ onBack, isMobile, userType = 'seller', ticketId }: SupportChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = userType === 'admin';

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!ticketId) return;
      try {
        setIsLoading(true);
        const data = await supportService.getTicketDetails(ticketId);
        setTicket(data);
        
        if (data.messages) {
          const formattedMessages: Message[] = data.messages.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.isAdmin ? 'support' : 'user',
            senderName: msg.isAdmin 
              ? (isAdmin ? 'Me' : 'Support Team') 
              : (isAdmin ? `${data.user?.firstName || 'Customer'}` : 'Me'),
            senderRole: msg.isAdmin ? 'Customer Support' : 'Customer',
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
            avatar: null
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        toast.error('Failed to load ticket conversation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetails();

    // Socket.io integration
    if (ticketId) {
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token);
        socketService.joinTicket(ticketId);
      }

      const unsubscribe = socketService.subscribe('new_support_message', (newMessage: SupportMessage) => {
        if (newMessage.ticketId === ticketId) {
          const isFromMe = isAdmin ? newMessage.isAdmin : !newMessage.isAdmin;
          
          const formattedNewMsg: Message = {
            id: newMessage.id,
            text: newMessage.content,
            sender: newMessage.isAdmin ? 'support' : 'user',
            senderName: newMessage.isAdmin 
              ? (isAdmin ? 'Me' : 'Support Team') 
              : (isAdmin ? (ticket?.user ? `${ticket.user.firstName}` : 'Customer') : 'Me'),
            senderRole: newMessage.isAdmin ? 'Customer Support' : 'Customer',
            timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
            avatar: null
          };

          setMessages(prev => {
            if (prev.some(m => m.id === formattedNewMsg.id)) return prev;
            return [...prev, formattedNewMsg];
          });
        }
      });

      return () => {
        socketService.leaveTicket(ticketId);
        unsubscribe();
      };
    }
  }, [ticketId]);

  const suggestedTopics = userType === 'seller' 
    ? ['Car Dispute', 'Payment Issues', 'Technical Issue', 'Inspection Issue']
    : ['Buying Process', 'Payment Options', 'Verification Status', 'Report Listing'];

  const handleSend = async () => {
    if (inputText.trim() && !isSending && ticketId) {
      setIsSending(true);
      try {
        const newMessage = await supportService.sendMessage(ticketId, inputText.trim());
        
        const formattedNewMsg: Message = {
          id: newMessage.id,
          text: newMessage.content,
          sender: isAdmin ? 'support' : 'user',
          senderName: isAdmin ? 'Support Team' : 'Me',
          senderRole: isAdmin ? 'Customer Support' : 'Customer',
          timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          avatar: null
        };

        setMessages(prev => [...prev, formattedNewMsg]);
        setInputText('');
      } catch (error) {
        console.error('Error sending support message:', error);
        toast.error('Failed to send message');
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'Lexend',
      minHeight: isMobile ? 'calc(100vh - 120px)' : '700px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ padding: isMobile ? '16px' : '24px', borderBottom: '1px solid #F0F0F0' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#666666',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '4px 0',
            marginBottom: '16px'
          }}
        >
          <BackIcon />
          <span>Back</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{ticket?.subject || 'Support Ticket'}</h3>
          {isAdmin && ticket?.user && (
            <p style={{ fontSize: '13px', color: '#666666', margin: '0 0 8px 0' }}>
              Customer: {ticket.user.firstName} {ticket.user.lastName}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#999999', margin: '0 0 12px 0' }}>Ticket ID: {ticketId?.substring(0, 8)}</p>
          <p style={{ fontSize: '12px', color: '#CCCCCC', margin: 0 }}>{ticket ? new Date(ticket.createdAt).toLocaleDateString() : ''}</p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          padding: isMobile ? '16px' : '24px',
          overflowY: 'auto',
          gap: '16px',
          background: '#FFFFFF'
        }}
      >
        {isLoading ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <p style={{ color: '#CCCCCC', fontSize: '14px', marginBottom: '24px' }}>Start a conversation....</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {suggestedTopics.map((topic) => (
                <button
                  key={topic}
                  style={{
                    background: '#F0F9F4',
                    color: '#005C32',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = isAdmin ? msg.sender === 'support' : msg.sender === 'user';
            
            return (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'row',
                  justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start', 
                  gap: '12px',
                  width: '100%'
                }}
              >
                {!isMyMessage && (
                  <div style={{ position: 'relative' }}>
                    <UserAvatar 
                      firstName={msg.senderName.split(' ')[0]} 
                      lastName={msg.senderName.split(' ')[1] || ''} 
                      avatar={msg.avatar}
                      className="w-8 h-8"
                    />
                  </div>
                )}

                <div style={{ 
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMyMessage ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{ 
                    padding: '12px 16px',
                    borderRadius: isMyMessage ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isMyMessage ? '#005C32' : '#F5F5F5',
                    color: isMyMessage ? '#FFFFFF' : '#333333',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    position: 'relative'
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    marginTop: '4px',
                    fontSize: '10px',
                    color: '#999999'
                  }}>
                    <span>{msg.timestamp}</span>
                    {isMyMessage && <DoubleCheckIcon color={msg.status === 'read' ? '#005C32' : '#999999'} />}
                  </div>
                </div>

                {isMyMessage && (
                  <div style={{ position: 'relative' }}>
                    <UserAvatar 
                      firstName={msg.senderName.split(' ')[0]} 
                      lastName={msg.senderName.split(' ')[1] || ''} 
                      avatar={msg.avatar}
                      className="w-8 h-8"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: isMobile ? '16px' : '24px', 
        borderTop: '1px solid #F0F0F0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <input 
          type="text" 
          placeholder="Start typing..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: '#333333'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <AttachmentIcon />
          </button>
          <button 
            onClick={handleSend}
            disabled={isSending}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: isSending ? 'not-allowed' : 'pointer', 
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSending ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
            className="active:scale-[0.98]"
          >
            {isSending ? <Spinner size="sm" /> : <SendIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
