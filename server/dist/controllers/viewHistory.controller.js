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
exports.deleteHistoryItem = exports.clearHistory = exports.getViewHistory = exports.recordView = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const recordView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { carId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Upsert to update viewedAt if already exists
        yield prisma.viewedCar.upsert({
            where: {
                userId_carId: {
                    userId,
                    carId,
                },
            },
            update: {
                viewedAt: new Date(),
            },
            create: {
                userId,
                carId,
            },
        });
        res.status(200).json({ message: 'View recorded' });
    }
    catch (error) {
        console.error('Error recording view:', error);
        res.status(500).json({ error: 'Failed to record view' });
    }
});
exports.recordView = recordView;
const getViewHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const total = yield prisma.viewedCar.count({
            where: { userId },
        });
        const views = yield prisma.viewedCar.findMany({
            where: { userId },
            include: {
                car: {
                    include: {
                        seller: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                                sellerProfile: {
                                    select: {
                                        companyName: true,
                                        verified: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: {
                viewedAt: 'desc',
            },
            skip,
            take: limit,
        });
        // Check for saved status for each car
        const savedCars = yield prisma.savedCar.findMany({
            where: { userId },
            select: { carId: true }
        });
        const savedCarIds = savedCars.map(sc => sc.carId);
        const formattedHistory = views.map((view) => (Object.assign(Object.assign({}, view.car), { images: typeof view.car.images === 'string' ? JSON.parse(view.car.images) : view.car.images, features: typeof view.car.features === 'string' ? JSON.parse(view.car.features) : view.car.features, viewedAt: view.viewedAt, isFavorited: savedCarIds.includes(view.car.id) })));
        res.json({
            history: formattedHistory,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            },
        });
    }
    catch (error) {
        console.error('Error fetching view history:', error);
        res.status(500).json({ error: 'Failed to fetch view history' });
    }
});
exports.getViewHistory = getViewHistory;
const clearHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        yield prisma.viewedCar.deleteMany({
            where: { userId },
        });
        res.status(200).json({ message: 'History cleared successfully' });
    }
    catch (error) {
        console.error('Error clearing view history:', error);
        res.status(500).json({ error: 'Failed to clear view history' });
    }
});
exports.clearHistory = clearHistory;
const deleteHistoryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const carId = req.params.carId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        yield prisma.viewedCar.delete({
            where: {
                userId_carId: {
                    userId,
                    carId,
                },
            },
        });
        res.status(200).json({ message: 'History item removed' });
    }
    catch (error) {
        console.error('Error deleting history item:', error);
        res.status(500).json({ error: 'Failed to remove history item' });
    }
});
exports.deleteHistoryItem = deleteHistoryItem;
