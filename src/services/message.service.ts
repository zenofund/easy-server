import api from '../lib/api';

export interface BackendMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
}

export interface SendMessageData {
  receiverId: string;
  content: string;
}

export const messageService = {
  getMessages: async (): Promise<BackendMessage[]> => {
    const response = await api.get('/messages');
    return response.data;
  },

  sendMessage: async (data: SendMessageData): Promise<BackendMessage> => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  markAsRead: async (messageId: string): Promise<BackendMessage> => {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  },
};
