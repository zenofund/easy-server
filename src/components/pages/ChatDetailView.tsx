import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from '../ui/Spinner';
import { UserAvatar } from '../UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { messageService, BackendMessage } from '../../services/message.service';
import { socketService } from '../../services/socket.service';
import { toast } from 'sonner';
import { getAvatarUrl } from '../../utils/avatarUtils';

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
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

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  senderName?: string;
  senderRole?: string;
  avatarUrl?: string;
}

interface ChatDetailViewProps {
  onBack: () => void;
  contactId: string;
  contactName: string;
  contactRole?: string;
  userType?: 'buyer' | 'seller';
}

export function ChatDetailView({ onBack, contactId, contactName, contactRole, userType = 'seller' }: ChatDetailViewProps) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChatHistory = async (isInitial = false) => {
      try {
        if (isInitial) setIsLoading(true);
        const allMessages = await messageService.getMessages();
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = userData.id;

        // Filter messages between current user and contactId
        const chatMessages = allMessages.filter(msg => 
          (msg.senderId === currentUserId && msg.receiverId === contactId) ||
          (msg.senderId === contactId && msg.receiverId === currentUserId)
        ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const formattedMessages: Message[] = chatMessages.map(msg => ({
          id: msg.id,
          text: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: msg.senderId === currentUserId ? 'me' : 'other',
          senderName: msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName}` : contactName,
          senderRole: msg.sender?.role || contactRole,
          avatarUrl: getAvatarUrl(msg.sender?.avatar)
        }));

        setMessages(prev => {
          // Only update if messages actually changed to avoid unnecessary re-renders
          if (JSON.stringify(prev) === JSON.stringify(formattedMessages)) return prev;
          return formattedMessages;
        });

        // Mark unread messages as read
        const unreadMessages = chatMessages.filter(msg => msg.receiverId === currentUserId && !msg.read);
        if (unreadMessages.length > 0) {
          await Promise.all(unreadMessages.map(msg => messageService.markAsRead(msg.id)));
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        if (isInitial) toast.error('Failed to load chat history');
      } finally {
        if (isInitial) setIsLoading(false);
      }
    };

    fetchChatHistory(true);

    // Socket.io real-time updates
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    const unsubscribe = socketService.subscribe('new_message', (newMessage: BackendMessage) => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = userData.id;

      // Only add if it's from the person we're chatting with
      if (newMessage.senderId === contactId || newMessage.receiverId === contactId) {
        const formattedNewMsg: Message = {
          id: newMessage.id,
          text: newMessage.content,
          timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: newMessage.senderId === currentUserId ? 'me' : 'other',
          senderName: newMessage.sender?.firstName ? `${newMessage.sender.firstName} ${newMessage.sender.lastName}` : contactName,
          senderRole: newMessage.sender?.role || contactRole,
          avatarUrl: newMessage.sender?.avatar
        };

        setMessages(prev => {
          if (prev.some(m => m.id === formattedNewMsg.id)) return prev;
          return [...prev, formattedNewMsg];
        });

        if (newMessage.receiverId === currentUserId) {
          messageService.markAsRead(newMessage.id);
        }
      }
    });

    // Set up polling as a fallback every 15 seconds instead of 5
    const interval = setInterval(() => fetchChatHistory(false), 15000);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [contactId, contactName, contactRole]);

  const handleSend = async () => {
    if (inputText.trim() && !isSending) {
      if (!contactId) {
        toast.error('Cannot send message: recipient not identified');
        return;
      }
      setIsSending(true);
      try {
        const newMessage = await messageService.sendMessage({
          receiverId: contactId,
          content: inputText.trim()
        });

        const formattedNewMsg: Message = {
          id: newMessage.id,
          text: newMessage.content,
          timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'me'
        };

        setMessages(prev => [...prev, formattedNewMsg]);
        setInputText('');
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px 24px', 
        borderBottom: '1px solid #F0F0F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        <button 
          onClick={onBack}
          style={{ 
            position: 'absolute', 
            left: '24px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            transition: 'all 0.2s'
          }}
          className="active:scale-[0.98]"
        >
          <ArrowLeftIcon />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ 
            fontFamily: 'Lexend', 
            fontWeight: 600, 
            fontSize: '18px', 
            color: '#000000',
            margin: 0
          }}>
            {contactName}
          </h3>
          {contactRole && (
            <span style={{ 
              fontFamily: 'Lexend', 
              fontSize: '14px', 
              color: '#999999' 
            }}>
              {contactRole}
            </span>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spinner size="lg" />
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <div 
                key={msg.id}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexDirection: msg.sender === 'me' ? 'row-reverse' : 'row' }}>
                  {msg.sender === 'other' && (
                    <UserAvatar 
                      firstName={msg.senderName.split(' ')[0]} 
                      lastName={msg.senderName.split(' ')[1] || ''} 
                      avatar={msg.avatarUrl}
                      className="w-8 h-8"
                    />
                  )}
                  <div style={{ 
                    padding: '12px 16px', 
                    borderRadius: msg.sender === 'me' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    backgroundColor: msg.sender === 'me' ? '#005C32' : '#F3F4F6',
                    color: msg.sender === 'me' ? '#FFFFFF' : '#000000',
                    maxWidth: '80%',
                    fontFamily: 'Lexend',
                    fontSize: '14px',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                </div>
                <span style={{ 
                  fontFamily: 'Lexend', 
                  fontSize: '12px', 
                  color: '#999999',
                  marginRight: msg.sender === 'me' ? '8px' : 0,
                  marginLeft: msg.sender === 'other' ? '40px' : 0
                }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999999', fontFamily: 'Lexend' }}>
            No messages yet. Start a conversation!
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: '24px', borderTop: '1px solid #F0F0F0' }}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            backgroundColor: '#F9FAFB',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB'
          }}
        >
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'all 0.2s' }} className="active:scale-[0.98]">
            <AttachmentIcon />
          </button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            disabled={isSending}
            style={{ 
              flex: 1, 
              background: 'none', 
              border: 'none', 
              outline: 'none',
              fontFamily: 'Lexend',
              fontSize: '14px',
              color: '#000000'
            }}
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isSending}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: inputText.trim() && !isSending ? 'pointer' : 'not-allowed', 
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              opacity: inputText.trim() && !isSending ? 1 : 0.5
            }} 
            className="active:scale-[0.98]"
          >
            {isSending ? <Spinner size="sm" /> : <SendIcon />}
          </button>
        </form>
      </div>
    </div>
  );
}
