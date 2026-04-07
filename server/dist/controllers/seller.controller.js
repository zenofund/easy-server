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
exports.getSellerRevenue = exports.getSellerById = exports.getSellers = exports.updateSellerProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateSellerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { companyName, companyRegNo, address, nin, type } = req.body;
        const sellerProfile = yield prisma.sellerProfile.upsert({
            where: { userId },
            update: {
                companyName,
                companyRegNo,
                address,
                nin,
                type: type,
            },
            create: {
                userId,
                companyName,
                companyRegNo,
                address,
                nin,
                type: type || client_1.SellerType.INDIVIDUAL,
            },
        });
        res.json({
            message: 'Seller profile updated successfully',
            sellerProfile,
        });
    }
    catch (error) {
        console.error('Error updating seller profile:', error);
        res.status(500).json({ error: 'Failed to update seller profile' });
    }
});
exports.updateSellerProfile = updateSellerProfile;
const getSellers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const pageNumber = parseInt(String(page));
        const limitNumber = parseInt(String(limit));
        const skip = (pageNumber - 1) * limitNumber;
        const where = {
            role: client_1.Role.SELLER,
        };
        if (search) {
            where.OR = [
                { firstName: { contains: String(search), mode: 'insensitive' } },
                { lastName: { contains: String(search), mode: 'insensitive' } },
                {
                    sellerProfile: {
                        companyName: { contains: String(search), mode: 'insensitive' },
                    },
                },
            ];
        }
        const [sellers, total] = yield Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    verified: true,
                    createdAt: true,
                    sellerProfile: {
                        select: {
                            companyName: true,
                            address: true,
                            verified: true,
                        },
                    },
                    _count: {
                        select: { cars: { where: { status: client_1.CarStatus.AVAILABLE } } },
                    },
                },
                skip,
                take: limitNumber,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.user.count({ where }),
        ]);
        res.json({
            sellers,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / limitNumber),
            },
        });
    }
    catch (error) {
        console.error('Error fetching sellers:', error);
        res.status(500).json({ error: 'Failed to fetch sellers' });
    }
});
exports.getSellers = getSellers;
const getSellerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(String(page));
        const limitNumber = parseInt(String(limit));
        const skip = (pageNumber - 1) * limitNumber;
        const seller = yield prisma.user.findUnique({
            where: { id: String(id) },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
                phone: true,
                verified: true,
                createdAt: true,
                sellerProfile: {
                    select: {
                        companyName: true,
                        address: true,
                        verified: true,
                    },
                },
                _count: {
                    select: {
                        cars: {
                            where: {
                                status: client_1.CarStatus.AVAILABLE
                            }
                        }
                    },
                },
            },
        });
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }
        const [cars, totalCars, activeCount, soldCount, totalViews, activeOffers] = yield Promise.all([
            prisma.car.findMany({
                where: {
                    sellerId: String(id),
                },
                select: {
                    id: true,
                    title: true,
                    make: true,
                    model: true,
                    price: true,
                    year: true,
                    mileage: true,
                    fuelType: true,
                    transmission: true,
                    bodyType: true,
                    color: true,
                    condition: true,
                    vin: true,
                    doors: true,
                    location: true,
                    description: true,
                    driveType: true,
                    status: true,
                    views: true,
                    images: true,
                    features: true,
                    createdAt: true,
                    _count: {
                        select: { offers: true }
                    }
                },
                skip,
                take: limitNumber,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.car.count({
                where: {
                    sellerId: String(id),
                },
            }),
            prisma.car.count({
                where: {
                    sellerId: String(id),
                    status: client_1.CarStatus.AVAILABLE,
                },
            }),
            prisma.car.count({
                where: {
                    sellerId: String(id),
                    status: client_1.CarStatus.SOLD,
                },
            }),
            prisma.car.aggregate({
                where: {
                    sellerId: String(id),
                },
                _sum: {
                    views: true,
                },
            }),
            prisma.offer.count({
                where: {
                    car: {
                        sellerId: String(id),
                    },
                    status: 'PENDING', // Assuming active offers means pending ones
                },
            }),
        ]);
        // Check for saved status if user is logged in
        let savedCarIds = [];
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (userId) {
            const savedCars = yield prisma.savedCar.findMany({
                where: { userId },
                select: { carId: true }
            });
            savedCarIds = savedCars.map(sc => sc.carId);
        }
        const parsedCars = cars.map(car => (Object.assign(Object.assign({}, car), { images: typeof car.images === 'string' ? JSON.parse(car.images) : car.images, features: typeof car.features === 'string' ? JSON.parse(car.features) : car.features, isFavorited: savedCarIds.includes(car.id) })));
        res.json({
            seller,
            cars: parsedCars,
            pagination: {
                total: totalCars,
                active: activeCount,
                sold: soldCount,
                page: pageNumber,
                pages: Math.ceil(totalCars / limitNumber),
            },
        });
    }
    catch (error) {
        console.error('Error fetching seller details:', error);
        res.status(500).json({ error: 'Failed to fetch seller details' });
    }
});
exports.getSellerById = getSellerById;
const getSellerRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Calculate revenue from sold cars
        const soldCars = yield prisma.car.findMany({
            where: {
                sellerId: String(id),
                status: client_1.CarStatus.SOLD,
            },
            select: {
                price: true,
            },
        });
        const revenueEarned = soldCars.reduce((acc, car) => acc + Number(car.price), 0);
        // Fetch transactions for withdrawals
        const transactions = yield prisma.transaction.findMany({
            where: {
                userId: String(id),
            },
        });
        const withdrawnRevenue = transactions
            .filter(t => t.type === 'WITHDRAWAL' && t.status === 'SUCCESS')
            .reduce((acc, t) => acc + Number(t.amount), 0);
        const pendingRevenue = transactions
            .filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING')
            .reduce((acc, t) => acc + Number(t.amount), 0);
        res.json({
            revenueEarned,
            withdrawnRevenue,
            pendingRevenue,
        });
    }
    catch (error) {
        console.error('Error fetching seller revenue:', error);
        res.status(500).json({ error: 'Failed to fetch seller revenue' });
    }
});
exports.getSellerRevenue = getSellerRevenue;
