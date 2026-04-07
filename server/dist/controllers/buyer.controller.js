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
exports.getBuyerActivities = exports.getBuyerStats = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBuyerStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // 1. Total Purchases (Transactions of type PURCHASE and status SUCCESS)
        const purchasesCount = yield prisma.transaction.count({
            where: {
                userId: String(id),
                type: client_1.TransactionType.PURCHASE,
                status: client_1.TransactionStatus.SUCCESS,
            },
        });
        // 2. Offers Stats
        const totalOffers = yield prisma.offer.count({
            where: {
                buyerId: String(id),
            },
        });
        const acceptedOffers = yield prisma.offer.count({
            where: {
                buyerId: String(id),
                status: client_1.OfferStatus.ACCEPTED,
            },
        });
        const rejectedOffers = yield prisma.offer.count({
            where: {
                buyerId: String(id),
                status: client_1.OfferStatus.REJECTED,
            },
        });
        // 3. Saved Cars
        const savedCarsCount = yield prisma.savedCar.count({
            where: {
                userId: String(id),
            },
        });
        // 4. Inspections
        const inspectionsCount = yield prisma.inspection.count({
            where: {
                buyerId: String(id),
            },
        });
        // 5. Unread Messages
        const unreadMessagesCount = yield prisma.message.count({
            where: {
                receiverId: String(id),
                read: false,
            },
        });
        res.json({
            purchases: purchasesCount,
            offers: {
                total: totalOffers,
                accepted: acceptedOffers,
                rejected: rejectedOffers,
            },
            savedCars: savedCarsCount,
            inspections: inspectionsCount,
            unreadMessages: unreadMessagesCount,
        });
    }
    catch (error) {
        console.error('Error fetching buyer stats:', error);
        res.status(500).json({ error: 'Failed to fetch buyer statistics' });
    }
});
exports.getBuyerStats = getBuyerStats;
const getBuyerActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { type, page = 1, limit = 10 } = req.query;
        const p = parseInt(page);
        const l = parseInt(limit);
        const skip = (p - 1) * l;
        if (type === 'purchases') {
            const [purchases, total] = yield Promise.all([
                prisma.transaction.findMany({
                    where: {
                        userId: String(id),
                        type: client_1.TransactionType.PURCHASE,
                        status: client_1.TransactionStatus.SUCCESS,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    skip,
                    take: l,
                }),
                prisma.transaction.count({
                    where: {
                        userId: String(id),
                        type: client_1.TransactionType.PURCHASE,
                        status: client_1.TransactionStatus.SUCCESS,
                    },
                })
            ]);
            // Extract offer IDs from references to get car and seller details
            const offerIds = purchases
                .map(p => {
                const parts = p.reference.split('-');
                return parts.length > 1 ? parts[1] : null;
            })
                .filter((id) => id !== null);
            const offers = yield prisma.offer.findMany({
                where: { id: { in: offerIds } },
                include: {
                    car: true,
                    seller: {
                        select: {
                            firstName: true,
                            lastName: true,
                            sellerProfile: {
                                select: {
                                    companyName: true
                                }
                            }
                        }
                    }
                }
            });
            const formattedPurchases = purchases.map(purchase => {
                var _a;
                const offerId = purchase.reference.split('-')[1];
                const offer = offers.find(o => o.id === offerId);
                return Object.assign(Object.assign({}, purchase), { car: (offer === null || offer === void 0 ? void 0 : offer.car) || null, seller: (offer === null || offer === void 0 ? void 0 : offer.seller) ? {
                        name: ((_a = offer.seller.sellerProfile) === null || _a === void 0 ? void 0 : _a.companyName) || `${offer.seller.firstName} ${offer.seller.lastName}`
                    } : null });
            });
            return res.json({
                data: formattedPurchases,
                pagination: {
                    total,
                    page: p,
                    limit: l,
                    totalPages: Math.ceil(total / l)
                }
            });
        }
        if (type === 'offers') {
            const [offers, total] = yield Promise.all([
                prisma.offer.findMany({
                    where: {
                        buyerId: String(id),
                    },
                    include: {
                        car: {
                            include: {
                                inspections: {
                                    where: {
                                        status: client_1.InspectionStatus.COMPLETED
                                    },
                                    include: {
                                        report: true
                                    },
                                    orderBy: {
                                        completedDate: 'desc'
                                    },
                                    take: 1
                                }
                            }
                        },
                        seller: {
                            select: {
                                firstName: true,
                                lastName: true,
                                sellerProfile: {
                                    select: {
                                        companyName: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    skip,
                    take: l,
                }),
                prisma.offer.count({
                    where: {
                        buyerId: String(id),
                    },
                })
            ]);
            const formattedOffers = offers.map(offer => {
                var _a, _b, _c, _d, _e, _f, _g;
                const latestInspection = (_b = (_a = offer.car) === null || _a === void 0 ? void 0 : _a.inspections) === null || _b === void 0 ? void 0 : _b[0];
                let calculatedScore = (_c = latestInspection === null || latestInspection === void 0 ? void 0 : latestInspection.score) !== null && _c !== void 0 ? _c : null;
                // If score is missing but report is available, calculate it
                if (calculatedScore === null && (latestInspection === null || latestInspection === void 0 ? void 0 : latestInspection.report)) {
                    const report = latestInspection.report;
                    const scores = [
                        report.exteriorScore,
                        report.interiorScore,
                        report.engineScore,
                        report.suspensionScore,
                        report.tiresScore,
                        report.lightsScore
                    ];
                    calculatedScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                }
                const offerData = JSON.parse(JSON.stringify(offer));
                return Object.assign(Object.assign({}, offerData), { inspectionScore: calculatedScore, seller: {
                        name: ((_e = (_d = offer.seller) === null || _d === void 0 ? void 0 : _d.sellerProfile) === null || _e === void 0 ? void 0 : _e.companyName) || `${(_f = offer.seller) === null || _f === void 0 ? void 0 : _f.firstName} ${(_g = offer.seller) === null || _g === void 0 ? void 0 : _g.lastName}`
                    } });
            });
            return res.json({
                data: formattedOffers,
                pagination: {
                    total,
                    page: p,
                    limit: l,
                    totalPages: Math.ceil(total / l)
                }
            });
        }
        if (type === 'inspections') {
            const [inspections, total] = yield Promise.all([
                prisma.inspection.findMany({
                    where: {
                        buyerId: String(id),
                    },
                    include: {
                        report: true,
                        car: {
                            include: {
                                seller: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        sellerProfile: {
                                            select: {
                                                companyName: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        inspector: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    skip,
                    take: l,
                }),
                prisma.inspection.count({
                    where: {
                        buyerId: String(id),
                    },
                })
            ]);
            const formattedInspections = inspections.map(inspection => {
                var _a, _b;
                let score = inspection.score;
                // If score is missing but report is available, calculate it
                if (score === null && inspection.report) {
                    const report = inspection.report;
                    const scores = [
                        report.exteriorScore,
                        report.interiorScore,
                        report.engineScore,
                        report.suspensionScore,
                        report.tiresScore,
                        report.lightsScore
                    ];
                    score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                }
                return Object.assign(Object.assign({}, inspection), { score, seller: ((_a = inspection.car) === null || _a === void 0 ? void 0 : _a.seller) ? {
                        name: ((_b = inspection.car.seller.sellerProfile) === null || _b === void 0 ? void 0 : _b.companyName) || `${inspection.car.seller.firstName} ${inspection.car.seller.lastName}`
                    } : null, inspectorName: inspection.inspector ? `${inspection.inspector.firstName} ${inspection.inspector.lastName}` : 'TBD' });
            });
            return res.json({
                data: formattedInspections,
                pagination: {
                    total,
                    page: p,
                    limit: l,
                    totalPages: Math.ceil(total / l)
                }
            });
        }
        res.status(400).json({ error: 'Invalid activity type' });
    }
    catch (error) {
        console.error('Error fetching buyer activities:', error);
        res.status(500).json({ error: 'Failed to fetch buyer activities' });
    }
});
exports.getBuyerActivities = getBuyerActivities;
