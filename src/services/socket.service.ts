import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  public connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['polling', 'websocket'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Handle generic events
    this.socket.onAny((eventName, data) => {
      const eventListeners = this.listeners.get(eventName);
      if (eventListeners) {
        eventListeners.forEach(listener => listener(data));
      }
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  public emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  public joinTicket(ticketId: string) {
    this.emit('join_ticket', ticketId);
  }

  public leaveTicket(ticketId: string) {
    this.emit('leave_ticket', ticketId);
  }

  public isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
