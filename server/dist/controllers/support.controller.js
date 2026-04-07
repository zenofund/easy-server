"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketStatus = exports.sendSupportMessage = exports.getTicketDetails = exports.getTickets = exports.createTicket = void 0;
const client_1 = require("@prisma/client");
const socket_service_1 = require("../services/socket.service");
const notification_controller_1 = require("./notification.controller");
const prisma = new client_1.PrismaClient();
// Create a new support ticket
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { subject, priority, initialMessage } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!subject || !initialMessage) {
            return res.status(400).json({ error: 'Subject and initial message are required' });
        }
        const ticket = yield prisma.supportTicket.create({
            data: {
                userId,
                subject,
                priority: priority || 'MEDIUM',
                messages: {
                    create: {
                        senderId: userId,
                        content: initialMessage,
                        isAdmin: false,
                    }
                }
            },
            include: {
                messages: true,
            }
        });
        // Notify admins via Socket.io
        socket_service_1.socketService.notifyNewTicket(ticket);
        res.status(201).json(ticket);
    }
    catch (error) {
        console.error('Error creating support ticket:', error);
        res.status(500).json({ error: 'Failed to create support ticket' });
    }
});
exports.createTicket = createTicket;
// Get all tickets for a user
const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        let where = {};
        if (role !== 'ADMIN') {
            where.userId = userId;
        }
        if (status && status !== 'All Ticket') {
            const statusMap = {
                'Open Ticket': 'OPEN',
                'Closed Ticket': 'RESOLVED'
            };
            if (statusMap[status]) {
                where.status = statusMap[status];
            }
        }
        if (search) {
            where.OR = [
                { subject: { contains: search, mode: 'insensitive' } },
                { id: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [tickets, total] = yield Promise.all([
            prisma.supportTicket.findMany({
                where,
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.supportTicket.count({ where })
        ]);
        res.json({
            data: tickets,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Error fetching support tickets:', error);
        res.status(500).json({ error: 'Failed to fetch support tickets' });
    }
});
exports.getTickets = getTickets;
// Get ticket details and messages
const getTicketDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const ticket = yield prisma.supportTicket.findUnique({
            where: { id: id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            }
        });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        // Check authorization
        if (role !== 'ADMIN' && ticket.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized to view this ticket' });
        }
        res.json(ticket);
    }
    catch (error) {
        console.error('Error fetching ticket details:', error);
        res.status(500).json({ error: 'Failed to fetch ticket details' });
    }
});
exports.getTicketDetails = getTicketDetails;
// Send a message in a ticket
const sendSupportMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const { id: ticketId } = req.params;
        const { content } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!content) {
            return res.status(400).json({ error: 'Message content is required' });
        }
        const ticket = yield prisma.supportTicket.findUnique({
            where: { id: ticketId }
        });
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        // Check authorization
        if (role !== 'ADMIN' && ticket.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized to post to this ticket' });
        }
        const message = yield prisma.supportMessage.create({
            data: {
                ticketId: ticketId,
                senderId: userId,
                content,
                isAdmin: role === 'ADMIN'
            }
        });
        // Update ticket's updatedAt timestamp
        yield prisma.supportTicket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() }
        });
        // Send via Socket.io
        socket_service_1.socketService.sendSupportMessage(ticketId, message);
        // If admin replied, notify the user
        if (role === 'ADMIN') {
            yield (0, notification_controller_1.createNotification)(ticket.userId, {
                title: 'Support Update',
                message: 'You have received a reply from our support team.',
                type: 'SYSTEM',
                link: `/support?ticket=${ticketId}`
            });
        }
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending support message:', error);
        res.status(500).json({ error: 'Failed to send support message' });
    }
});
exports.sendSupportMessage = sendSupportMessage;
// Update ticket status
const updateTicketStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const { id } = req.params;
        const { status } = req.body;
        if (role !== 'ADMIN') {
            return res.status(403).json({ error: 'Only admins can update ticket status' });
        }
        const ticket = yield prisma.supportTicket.update({
            where: { id: id },
            data: { status }
        });
        // Notify user and admins via Socket.io
        socket_service_1.socketService.notifyTicketStatusUpdate(id, status, ticket.userId);
        res.json(ticket);
    }
    catch (error) {
        console.error('Error updating ticket status:', error);
        res.status(500).json({ error: 'Failed to update ticket status' });
    }
});
exports.updateTicketStatus = updateTicketStatus;
