import React, { useEffect, useState } from 'react';
import { messageService, BackendMessage } from '../../services/message.service';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { Spinner } from '../ui/Spinner';
import { UserAvatar } from '../UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl } from '../../utils/avatarUtils';

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  preview: string;
  timestamp: string;
  avatarUrl: string;
  isOnline: boolean;
  unreadCount?: number;
  lastMessageAt: string;
  otherUser?: {
    id: string;
    firstName: string;
    lastName: string;
    role?: string;
    avatar?: string;
  };
}

interface MessagesViewProps {
  onSeeMore: (message: Message) => void;
  userType?: 'buyer' | 'seller';
}

export function MessagesView({ onSeeMore, userType = 'seller' }: MessagesViewProps) {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async (isInitial = false) => {
      try {
        if (isInitial) setIsLoading(true);
        const allMessages = await messageService.getMessages();
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = userData.id;

        // Group messages by the other person in the conversation
        const conversationMap = new Map<string, BackendMessage[]>();
        
        allMessages.forEach(msg => {
          const otherId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
          if (!conversationMap.has(otherId)) {
            conversationMap.set(otherId, []);
          }
          conversationMap.get(otherId)?.push(msg);
        });

        const formattedConversations: Message[] = Array.from(conversationMap.entries()).map(([otherId, messages]) => {
          const lastMsg = messages[0]; // messages are ordered by createdAt desc from backend
          const otherUser = lastMsg.senderId === currentUserId ? lastMsg.receiver : lastMsg.sender;
          
          return {
            id: lastMsg.id,
            senderId: otherId,
            senderName: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User',
            senderRole: otherUser?.role || (userType === 'buyer' ? 'Seller' : 'Buyer'),
            preview: lastMsg.content,
            timestamp: new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatarUrl: getAvatarUrl(otherUser?.avatar),
            isOnline: false, // This would require WebSockets for real-time status
            unreadCount: messages.filter(m => m.receiverId === currentUserId && !m.read).length,
            lastMessageAt: lastMsg.createdAt,
            otherUser: otherUser ? {
              id: otherUser.id,
              firstName: otherUser.firstName,
              lastName: otherUser.lastName,
              role: otherUser.role,
              avatar: otherUser.avatar
            } : undefined
          };
        }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

        setConversations(prev => {
          // Only update if data actually changed
          if (JSON.stringify(prev) === JSON.stringify(formattedConversations)) return prev;
          return formattedConversations;
        });
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        if (isInitial) setIsLoading(false);
      }
    };

    fetchConversations(true);

    // Set up polling for new messages every 10 seconds without reloading UI
    const interval = setInterval(() => fetchConversations(false), 10000);
    return () => clearInterval(interval);
  }, [userType]);

  if (isLoading) {
    return (
      <div style={{ width: '100%' }}>
        <h2 style={{ fontFamily: 'Lexend', fontWeight: 'bold', fontSize: '24px', color: '#000000', marginBottom: '32px' }}>
          Messages
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F0F0F0', gap: '16px' }}>
              <SkeletonLoader className="w-12 h-12 rounded-full" />
              <div style={{ flex: 1, spaceY: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <SkeletonLoader className="h-5 w-32" />
                  <SkeletonLoader className="h-4 w-16" />
                </div>
                <SkeletonLoader className="h-4 w-3/4" />
              </div>
              <SkeletonLoader className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <h2 style={{ 
        fontFamily: 'Lexend', 
        fontWeight: 'bold', 
        fontSize: '24px', 
        color: '#000000', 
        marginBottom: '32px' 
      }}>
        Messages
      </h2>

      {/* Messages List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {conversations.length > 0 ? (
          conversations.map((message, index) => (
            <div 
              key={message.senderId}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px 0',
                borderBottom: index === conversations.length - 1 ? 'none' : '1px solid #F0F0F0',
                gap: '16px'
              }}
            >
              {/* Avatar with status */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <UserAvatar 
                  firstName={message.senderName.split(' ')[0]} 
                  lastName={message.senderName.split(' ')[1] || ''} 
                  avatar={message.avatarUrl}
                  className="w-12 h-12 border-2 border-black"
                />
                {message.isOnline && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '2px', 
                    right: '2px', 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: '#22C55E', 
                    border: '2px solid #FFFFFF', 
                    borderRadius: '50%' 
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ 
                    fontFamily: 'Lexend', 
                    fontWeight: message.unreadCount ? 700 : 600, 
                    fontSize: '16px', 
                    color: '#000000' 
                  }}>
                    {message.senderName}
                  </span>
                  <span style={{ 
                    fontFamily: 'Lexend', 
                    fontSize: '12px', 
                    color: '#999999' 
                  }}>
                    {message.senderRole}
                  </span>
                  {message.unreadCount ? (
                    <div style={{
                      backgroundColor: '#005C32',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 700,
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 5px'
                    }}>
                      {message.unreadCount}
                    </div>
                  ) : null}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <p style={{ 
                    fontFamily: 'Lexend', 
                    fontSize: '14px', 
                    color: message.unreadCount ? '#000000' : '#666666',
                    fontWeight: message.unreadCount ? 500 : 400,
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {message.preview}
                  </p>
                  <span style={{ 
                    fontFamily: 'Lexend', 
                    fontSize: '12px', 
                    color: '#999999',
                    whiteSpace: 'nowrap'
                  }}>
                    {message.timestamp}
                  </span>
                </div>
              </div>

              {/* See More Button */}
              <button 
                onClick={() => onSeeMore(message)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 16px',
                  backgroundColor: '#E6F2EB',
                  color: '#005C32',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Lexend',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-[#d5e9de]"
              >
                See more
                <ChevronRightIcon />
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#666666', fontFamily: 'Lexend' }}>
            No messages yet.
          </div>
        )}
      </div>
    </>
  );
}
