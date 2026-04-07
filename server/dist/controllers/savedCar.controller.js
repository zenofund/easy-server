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
exports.checkIsSaved = exports.getSavedCars = exports.toggleSavedCar = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const toggleSavedCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { carId } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!carId) {
            return res.status(400).json({ error: 'Car ID is required' });
        }
        // Check if car exists
        const car = yield prisma.car.findUnique({
            where: { id: carId },
        });
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        // Check if already saved
        const existingSavedCar = yield prisma.savedCar.findUnique({
            where: {
                userId_carId: {
                    userId,
                    carId,
                },
            },
        });
        if (existingSavedCar) {
            // Unsave
            yield prisma.savedCar.delete({
                where: {
                    id: existingSavedCar.id,
                },
            });
            return res.json({ message: 'Car removed from saved list', saved: false });
        }
        else {
            // Save
            yield prisma.savedCar.create({
                data: {
                    userId,
                    carId,
                },
            });
            return res.status(201).json({ message: 'Car added to saved list', saved: true });
        }
    }
    catch (error) {
        console.error('Error toggling saved car:', error);
        res.status(500).json({ error: 'Failed to update saved car list' });
    }
});
exports.toggleSavedCar = toggleSavedCar;
const getSavedCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { page = 1, limit = 10 } = req.query;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const pageNum = parseInt(String(page));
        const limitNum = parseInt(String(limit));
        const skip = (pageNum - 1) * limitNum;
        const [savedCars, totalCount] = yield Promise.all([
            prisma.savedCar.findMany({
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
                    createdAt: 'desc',
                },
                skip,
                take: limitNum,
            }),
            prisma.savedCar.count({ where: { userId } }),
        ]);
        const formattedCars = savedCars.map((sc) => {
            const car = sc.car;
            return Object.assign(Object.assign({}, car), { images: typeof car.images === 'string' ? JSON.parse(car.images) : car.images, features: typeof car.features === 'string' ? JSON.parse(car.features) : car.features, isFavorited: true });
        });
        res.json({
            cars: formattedCars,
            pagination: {
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitNum),
                currentPage: pageNum,
                limit: limitNum,
            },
        });
    }
    catch (error) {
        console.error('Error fetching saved cars:', error);
        res.status(500).json({ error: 'Failed to fetch saved cars' });
    }
});
exports.getSavedCars = getSavedCars;
const checkIsSaved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const carId = req.params.carId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const savedCar = yield prisma.savedCar.findUnique({
            where: {
                userId_carId: {
                    userId,
                    carId,
                },
            },
        });
        res.json({ isSaved: !!savedCar });
    }
    catch (error) {
        console.error('Error checking if car is saved:', error);
        res.status(500).json({ error: 'Failed to check saved status' });
    }
});
exports.checkIsSaved = checkIsSaved;
