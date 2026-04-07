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
exports.getUnreadCount = exports.markAsRead = exports.sendMessage = exports.getMessages = void 0;
const client_1 = require("@prisma/client");
const socket_service_1 = require("../services/socket.service");
const notification_controller_1 = require("./notification.controller");
const prisma = new client_1.PrismaClient();
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const messages = yield prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { receiverId, content } = req.body;
        if (!senderId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!receiverId || !content) {
            return res.status(400).json({ error: 'Receiver ID and content are required' });
        }
        const message = yield prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true,
                    },
                },
            },
        });
        // Send via Socket.io
        socket_service_1.socketService.sendDirectMessage(receiverId, message);
        // Create in-app notification
        yield (0, notification_controller_1.createNotification)(receiverId, {
            title: 'New Message',
            message: `You received a new message from ${message.sender.firstName} ${message.sender.lastName}`,
            type: 'MESSAGE',
            link: '/messages'
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.sendMessage = sendMessage;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const id = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const message = yield prisma.message.update({
            where: {
                id,
                receiverId: userId,
            },
            data: {
                read: true,
            },
        });
        res.json(message);
    }
    catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
});
exports.markAsRead = markAsRead;
const getUnreadCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const count = yield prisma.message.count({
            where: {
                receiverId: userId,
                read: false,
            },
        });
        res.json({ count });
    }
    catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});
exports.getUnreadCount = getUnreadCount;
