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
exports.getPendingTransactions = exports.approveTransaction = exports.withdrawalRequest = exports.depositRequest = exports.purchaseCar = exports.getWallet = exports.verifyPaystackDeposit = exports.initializePaystackDeposit = void 0;
const client_1 = require("@prisma/client");
const notification_controller_1 = require("./notification.controller");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const depositSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string().optional(),
});
const withdrawalSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string().optional(),
});
const paystack_1 = require("../utils/paystack");
const initializePaystackDeposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { amount, metadata } = req.body;
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const paystackData = yield (0, paystack_1.initializePayment)(user.email, amount, metadata);
        // Create a pending transaction
        yield prisma.transaction.create({
            data: {
                userId,
                amount,
                type: (metadata === null || metadata === void 0 ? void 0 : metadata.type) === 'purchase' ? client_1.TransactionType.PURCHASE : client_1.TransactionType.DEPOSIT,
                status: client_1.TransactionStatus.PENDING,
                reference: paystackData.data.reference,
                paystackRef: paystackData.data.reference,
                description: (metadata === null || metadata === void 0 ? void 0 : metadata.type) === 'purchase' ? `Payment for car purchase` : 'Paystack deposit',
                metadata: metadata ? JSON.stringify(metadata) : null
            },
        });
        res.json(paystackData);
    }
    catch (error) {
        console.error('Paystack init error:', error);
        res.status(500).json({ error: 'Failed to initialize payment' });
    }
});
exports.initializePaystackDeposit = initializePaystackDeposit;
const verifyPaystackDeposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reference } = req.query;
        if (!reference)
            return res.status(400).json({ error: 'Reference required' });
        const verificationData = yield (0, paystack_1.verifyPayment)(reference);
        if (verificationData.data.status === 'success') {
            const transaction = yield prisma.transaction.findUnique({
                where: { reference: reference },
            });
            if (!transaction) {
                return res.status(404).json({
                    message: 'Transaction record not found',
                    status: 'error'
                });
            }
            // If already successful, we still return success but with a specific message
            if (transaction.status === client_1.TransactionStatus.SUCCESS) {
                return res.json({
                    message: 'This payment has already been verified and processed.',
                    status: 'success'
                });
            }
            if (transaction.status === client_1.TransactionStatus.PENDING) {
                const metadata = transaction.metadata ? JSON.parse(transaction.metadata) : null;
                if ((metadata === null || metadata === void 0 ? void 0 : metadata.type) === 'purchase' && (metadata === null || metadata === void 0 ? void 0 : metadata.offerId)) {
                    // Handle direct car purchase via Paystack
                    const offer = yield prisma.offer.findUnique({
                        where: { id: metadata.offerId },
                        include: {
                            car: true,
                            buyer: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    });
                    if (!offer) {
                        return res.status(404).json({ error: 'Offer not found for purchase' });
                    }
                    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                        // Update transaction
                        yield tx.transaction.update({
                            where: { id: transaction.id },
                            data: { status: client_1.TransactionStatus.SUCCESS },
                        });
                        // Add to seller's wallet
                        yield tx.wallet.update({
                            where: { userId: offer.sellerId },
                            data: { balance: { increment: transaction.amount } },
                        });
                        // Create transaction for seller
                        yield tx.transaction.create({
                            data: {
                                userId: offer.sellerId,
                                amount: transaction.amount,
                                type: client_1.TransactionType.SALE,
                                status: client_1.TransactionStatus.SUCCESS,
                                reference: `SALE-PS-${metadata.offerId}-${Date.now()}`,
                                description: `Sale of ${offer.car.title} via Paystack`,
                            },
                        });
                        // Mark car as SOLD
                        yield tx.car.update({
                            where: { id: offer.carId },
                            data: { status: 'SOLD' },
                        });
                        // Update offer status
                        yield tx.offer.update({
                            where: { id: offer.id },
                            data: { status: 'COMPLETED' }
                        });
                        // Notify buyer and seller
                        yield (0, notification_controller_1.createNotification)(offer.buyerId, {
                            title: 'Purchase Successful',
                            message: `Your payment for ${offer.car.year} ${offer.car.make} ${offer.car.model} was successful.`,
                            type: 'OFFER',
                            link: '/buyer-dashboard?tab=purchases'
                        });
                        yield (0, notification_controller_1.createNotification)(offer.sellerId, {
                            title: 'Car Sold!',
                            message: `Your ${offer.car.year} ${offer.car.make} ${offer.car.model} has been sold to ${offer.buyer.firstName} ${offer.buyer.lastName}.`,
                            type: 'OFFER',
                            link: '/seller-dashboard?tab=inventory'
                        });
                        // Reject other offers
                        yield tx.offer.updateMany({
                            where: {
                                carId: offer.carId,
                                id: { not: offer.id },
                                status: { in: ['PENDING', 'ACCEPTED', 'COUNTERED'] }
                            },
                            data: { status: 'REJECTED' }
                        });
                    }));
                    return res.json({ message: 'Purchase verified successfully', status: 'success' });
                }
                else {
                    // Normal wallet deposit
                    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                        yield tx.transaction.update({
                            where: { id: transaction.id },
                            data: { status: client_1.TransactionStatus.SUCCESS },
                        });
                        yield tx.wallet.update({
                            where: { userId: transaction.userId },
                            data: { balance: { increment: transaction.amount } },
                        });
                    }));
                    return res.json({ message: 'Payment verified and wallet updated', status: 'success' });
                }
            }
        }
        // If we reach here, either status wasn't 'success' or some other condition failed
        // Ensure we NEVER return 'success' status if the payment wasn't actually successful
        const failureMessage = verificationData.data.gateway_response || 'Payment not successful';
        const failureStatus = verificationData.data.status || 'failed';
        res.json({
            message: failureMessage,
            status: failureStatus === 'success' ? 'error' : failureStatus
        });
    }
    catch (error) {
        console.error('Paystack verify error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});
exports.verifyPaystackDeposit = verifyPaystackDeposit;
const getWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        let wallet = yield prisma.wallet.findUnique({
            where: { userId },
        });
        // If wallet doesn't exist (for older users), create it
        if (!wallet) {
            wallet = yield prisma.wallet.create({
                data: {
                    userId,
                    balance: 0,
                    currency: 'NGN',
                },
            });
        }
        const transactions = yield prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        // Calculate revenue stats for sellers
        let revenueStats = {
            totalEarned: 0,
            pendingEarned: 0
        };
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        if ((user === null || user === void 0 ? void 0 : user.role) === 'SELLER') {
            const allSellerTransactions = yield prisma.transaction.findMany({
                where: {
                    userId,
                    type: client_1.TransactionType.SALE
                },
                select: {
                    amount: true,
                    status: true
                }
            });
            revenueStats.totalEarned = allSellerTransactions
                .filter(t => t.status === client_1.TransactionStatus.SUCCESS)
                .reduce((sum, t) => sum + Number(t.amount), 0);
            revenueStats.pendingEarned = allSellerTransactions
                .filter(t => t.status === client_1.TransactionStatus.PENDING)
                .reduce((sum, t) => sum + Number(t.amount), 0);
        }
        res.json({
            wallet,
            transactions,
            revenueStats
        });
    }
    catch (error) {
        console.error('Error fetching wallet:', error);
        res.status(500).json({ error: 'Failed to fetch wallet information' });
    }
});
exports.getWallet = getWallet;
const purchaseCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { offerId } = req.body;
        if (!offerId) {
            return res.status(400).json({ error: 'Offer ID is required' });
        }
        // 1. Get offer and car details
        const offer = yield prisma.offer.findUnique({
            where: { id: offerId },
            include: {
                car: true,
            },
        });
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        if (offer.buyerId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to pay for this offer' });
        }
        if (offer.status !== 'ACCEPTED') {
            return res.status(400).json({ error: 'Offer must be accepted before payment' });
        }
        const amount = offer.amount;
        // 2. Check buyer's wallet
        const buyerWallet = yield prisma.wallet.findUnique({
            where: { userId },
        });
        if (!buyerWallet || buyerWallet.balance.lessThan(amount)) {
            return res.status(400).json({ error: 'Insufficient wallet balance' });
        }
        // 3. Execute purchase in a transaction
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Deduct from buyer
            yield tx.wallet.update({
                where: { userId },
                data: { balance: { decrement: amount } },
            });
            // Add to seller
            yield tx.wallet.update({
                where: { userId: offer.sellerId },
                data: { balance: { increment: amount } },
            });
            // Create transaction for buyer
            yield tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type: client_1.TransactionType.PURCHASE,
                    status: client_1.TransactionStatus.SUCCESS,
                    reference: `PURCH-${offerId}-${Date.now()}`,
                    description: `Purchase of ${offer.car.title}`,
                },
            });
            // Create transaction for seller
            yield tx.transaction.create({
                data: {
                    userId: offer.sellerId,
                    amount,
                    type: client_1.TransactionType.SALE,
                    status: client_1.TransactionStatus.SUCCESS,
                    reference: `SALE-${offerId}-${Date.now()}`,
                    description: `Sale of ${offer.car.title}`,
                },
            });
            // Mark car as SOLD
            yield tx.car.update({
                where: { id: offer.carId },
                data: { status: 'SOLD' },
            });
            // Update offer status to COMPLETED
            yield tx.offer.update({
                where: { id: offerId },
                data: { status: 'COMPLETED' }
            });
            // Reject all other offers for this car
            yield tx.offer.updateMany({
                where: {
                    carId: offer.carId,
                    id: { not: offerId },
                    status: { in: ['PENDING', 'ACCEPTED', 'COUNTERED'] }
                },
                data: { status: 'REJECTED' }
            });
        }));
        res.json({ message: 'Purchase successful', status: 'success' });
    }
    catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ error: 'Failed to process purchase' });
    }
});
exports.purchaseCar = purchaseCar;
const depositRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { amount, description } = depositSchema.parse(req.body);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Create a pending transaction for manual deposit
        const transaction = yield prisma.transaction.create({
            data: {
                userId,
                amount,
                type: client_1.TransactionType.DEPOSIT,
                status: client_1.TransactionStatus.PENDING,
                description: description || 'Manual deposit request',
                reference: `DEP-${Date.now()}`,
            },
        });
        res.status(201).json({
            message: 'Deposit request submitted successfully. Please wait for admin approval.',
            transaction,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error('Deposit request error:', error);
        res.status(500).json({ error: 'Failed to submit deposit request' });
    }
});
exports.depositRequest = depositRequest;
const withdrawalRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { amount, description } = withdrawalSchema.parse(req.body);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const wallet = yield prisma.wallet.findUnique({
            where: { userId },
        });
        if (!wallet || Number(wallet.balance) < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        // Deduct balance immediately for withdrawal request? 
        // Usually it's better to keep it and mark as "locked" or just check upon approval.
        // For simplicity, we'll deduct upon approval, but check here if they have enough.
        const transaction = yield prisma.transaction.create({
            data: {
                userId,
                amount,
                type: client_1.TransactionType.WITHDRAWAL,
                status: client_1.TransactionStatus.PENDING,
                description: description || 'Manual withdrawal request',
                reference: `WTH-${Date.now()}`,
            },
        });
        res.status(201).json({
            message: 'Withdrawal request submitted successfully. Please wait for admin approval.',
            transaction,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error('Withdrawal request error:', error);
        res.status(500).json({ error: 'Failed to submit withdrawal request' });
    }
});
exports.withdrawalRequest = withdrawalRequest;
// Admin functions to approve/reject (would normally be in an admin controller)
const approveTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId } = req.params;
        if (typeof transactionId !== 'string') {
            return res.status(400).json({ error: 'Invalid transaction ID' });
        }
        const transaction = yield prisma.transaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction || transaction.status !== client_1.TransactionStatus.PENDING) {
            return res.status(400).json({ error: 'Invalid transaction' });
        }
        // Use transaction to ensure data integrity
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Update transaction status
            yield tx.transaction.update({
                where: { id: transactionId },
                data: { status: client_1.TransactionStatus.SUCCESS },
            });
            // Update wallet balance
            if (transaction.type === client_1.TransactionType.DEPOSIT) {
                yield tx.wallet.update({
                    where: { userId: transaction.userId },
                    data: { balance: { increment: transaction.amount } },
                });
            }
            else if (transaction.type === client_1.TransactionType.WITHDRAWAL) {
                yield tx.wallet.update({
                    where: { userId: transaction.userId },
                    data: { balance: { decrement: transaction.amount } },
                });
            }
        }));
        res.json({ message: 'Transaction approved successfully' });
    }
    catch (error) {
        console.error('Approval error:', error);
        res.status(500).json({ error: 'Failed to approve transaction' });
    }
});
exports.approveTransaction = approveTransaction;
const getPendingTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma.transaction.findMany({
            where: { status: client_1.TransactionStatus.PENDING },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(transactions);
    }
    catch (error) {
        console.error('Fetch pending error:', error);
        res.status(500).json({ error: 'Failed to fetch pending transactions' });
    }
});
exports.getPendingTransactions = getPendingTransactions;
