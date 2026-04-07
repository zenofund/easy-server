"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables for SocketService');
}
const secret = JWT_SECRET;
const prisma = new client_1.PrismaClient();
class SocketService {
    constructor() {
        this.io = null;
        this.userSockets = new Map(); // userId -> socketIds[]
    }
    init(httpServer) {
        const allowedOrigins = [
            'https://huceautos.com',
            'https://www.huceautos.com',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:5173',
            process.env.FRONTEND_URL,
            'https://huce-autos.up.railway.app'
        ].filter(Boolean);
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: allowedOrigins,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        // Middleware for authentication
        this.io.use((socket, next) => {
            var _a;
            const token = socket.handshake.auth.token || ((_a = socket.handshake.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                socket.user = decoded;
                next();
            }
            catch (err) {
                next(new Error('Authentication error: Invalid token'));
            }
        });
        this.io.on('connection', (socket) => {
            var _a, _b;
            const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a.userId;
            console.log(`User connected: ${userId} (Socket: ${socket.id})`);
            if (userId) {
                // Add socket to user's list
                const sockets = this.userSockets.get(userId) || [];
                this.userSockets.set(userId, [...sockets, socket.id]);
                // Join a private room for the user
                socket.join(`user:${userId}`);
                // Join admin room if applicable
                if (((_b = socket.user) === null || _b === void 0 ? void 0 : _b.role) === 'ADMIN') {
                    socket.join('admin');
                    console.log(`Admin joined admin room: ${userId}`);
                }
            }
            socket.on('disconnect', () => {
                if (userId) {
                    const sockets = this.userSockets.get(userId) || [];
                    const updatedSockets = sockets.filter(id => id !== socket.id);
                    if (updatedSockets.length > 0) {
                        this.userSockets.set(userId, updatedSockets);
                    }
                    else {
                        this.userSockets.delete(userId);
                    }
                }
                console.log(`User disconnected: ${userId} (Socket: ${socket.id})`);
            });
            // Join support ticket room
            socket.on('join_ticket', (ticketId) => {
                socket.join(`ticket:${ticketId}`);
                console.log(`Socket ${socket.id} joined ticket room: ${ticketId}`);
            });
            // Leave support ticket room
            socket.on('leave_ticket', (ticketId) => {
                socket.leave(`ticket:${ticketId}`);
                console.log(`Socket ${socket.id} left ticket room: ${ticketId}`);
            });
        });
        return this.io;
    }
    // Send a direct message notification
    sendDirectMessage(receiverId, message) {
        if (this.io) {
            this.io.to(`user:${receiverId}`).emit('new_message', message);
        }
    }
    // Send a support message notification
    sendSupportMessage(ticketId, message) {
        if (this.io) {
            this.io.to(`ticket:${ticketId}`).emit('new_support_message', message);
        }
    }
    // Notify admins about a new ticket
    notifyNewTicket(ticket) {
        if (this.io) {
            this.io.to('admin').emit('new_support_ticket', ticket);
        }
    }
    // Notify user and admins about ticket status update
    notifyTicketStatusUpdate(ticketId, status, userId) {
        if (this.io) {
            const data = { ticketId, status };
            this.io.to(`ticket:${ticketId}`).emit('support_ticket_status_updated', data);
            this.io.to(`user:${userId}`).emit('support_ticket_status_updated', data);
            this.io.to('admin').emit('support_ticket_status_updated', data);
        }
    }
    getIO() {
        return this.io;
    }
}
exports.socketService = new SocketService();
