import api from '../lib/api';

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'OPEN' | 'PENDING' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  messages?: SupportMessage[];
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateTicketData {
  subject: string;
  priority?: string;
  initialMessage: string;
}

export interface SupportTicketResponse {
  data: SupportTicket[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const supportService = {
  createTicket: async (data: CreateTicketData): Promise<SupportTicket> => {
    const response = await api.post('/support/tickets', data);
    return response.data;
  },

  getTickets: async (page: number = 1, limit: number = 10, status?: string, search?: string): Promise<SupportTicketResponse> => {
    let url = `/support/tickets?page=${page}&limit=${limit}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const response = await api.get(url);
    return response.data;
  },

  getTicketDetails: async (id: string): Promise<SupportTicket> => {
    const response = await api.get(`/support/tickets/${id}`);
    return response.data;
  },

  sendMessage: async (ticketId: string, content: string): Promise<SupportMessage> => {
    const response = await api.post(`/support/tickets/${ticketId}/messages`, { content });
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<SupportTicket> => {
    const response = await api.patch(`/support/tickets/${id}/status`, { status });
    return response.data;
  }
};
