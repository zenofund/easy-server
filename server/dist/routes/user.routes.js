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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const paystack_1 = require("../utils/paystack");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get current user profile
router.get('/me', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                avatar: true,
                verified: true,
                sellerProfile: true,
                buyerProfile: true,
                inspectorProfile: true,
                wallet: {
                    select: {
                        balance: true,
                        currency: true
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
}));
// Get list of Nigerian banks
router.get('/banks', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banks = yield (0, paystack_1.getBanks)();
        res.json(banks);
    }
    catch (error) {
        console.error('Error fetching banks:', error);
        res.status(500).json({ error: 'Failed to fetch banks' });
    }
}));
// Resolve account number
router.get('/resolve-account', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountNumber, bankCode } = req.query;
        if (!accountNumber || !bankCode) {
            return res.status(400).json({ error: 'Account number and bank code are required' });
        }
        const result = yield (0, paystack_1.resolveAccountNumber)(accountNumber, bankCode);
        res.json(result);
    }
    catch (error) {
        console.error('Error resolving account:', error);
        res.status(500).json({ error: 'Failed to resolve account' });
    }
}));
// Change password
router.put('/change-password', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { currentPassword, newPassword } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Verify current password
        const isValidPassword = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid current password' });
        }
        // Hash new password
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
}));
// Update payment info
router.put('/payment-info', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { bankName, accountNumber, accountName, autopay } = req.body;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                buyerProfile: true,
                sellerProfile: true,
                inspectorProfile: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        let profile;
        if (user.role === 'SELLER') {
            profile = yield prisma.sellerProfile.update({
                where: { userId },
                data: { bankName, accountNumber, accountName, autopay }
            });
        }
        else if (user.role === 'INSPECTOR') {
            profile = yield prisma.inspectorProfile.update({
                where: { userId },
                data: { bankName, accountNumber, accountName, autopay }
            });
        }
        else {
            // For BUYER role, save to BuyerProfile
            profile = yield prisma.buyerProfile.upsert({
                where: { userId },
                create: { userId, bankName, accountNumber, accountName, autopay },
                update: { bankName, accountNumber, accountName, autopay }
            });
        }
        res.json({
            message: 'Payment information updated successfully',
            buyerProfile: user.role === 'BUYER' ? profile : undefined,
            sellerProfile: user.role === 'SELLER' ? profile : undefined,
            inspectorProfile: user.role === 'INSPECTOR' ? profile : undefined
        });
    }
    catch (error) {
        console.error('Error updating payment info:', error);
        res.status(500).json({ error: 'Failed to update payment information' });
    }
}));
// Update avatar
router.post('/avatar', auth_middleware_1.authenticateToken, upload_middleware_1.upload.single('avatar'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const avatarUrl = req.file.path;
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                avatar: true,
            },
        });
        res.json({ message: 'Avatar updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Failed to update avatar' });
    }
}));
// Update user profile
router.put('/:id', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, officeName } = req.body;
        // Verify user is updating their own profile
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== id) {
            return res.status(403).json({ error: 'Unauthorized to update this profile' });
        }
        const user = yield prisma.user.findUnique({
            where: { id },
            select: { role: true }
        });
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: Object.assign({ firstName,
                lastName,
                phone }, ((user === null || user === void 0 ? void 0 : user.role) === 'INSPECTOR' && officeName !== undefined ? {
                inspectorProfile: {
                    upsert: {
                        create: { officeName },
                        update: { officeName }
                    }
                }
            } : {})),
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                avatar: true,
                inspectorProfile: true,
                sellerProfile: true,
                buyerProfile: true,
            },
        });
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
}));
exports.default = router;
