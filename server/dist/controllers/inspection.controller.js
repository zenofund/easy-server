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
exports.uploadInspectionPhotos = exports.submitInspectionReport = exports.assignInspector = exports.getInspectorStats = exports.getInspectorInspections = exports.getInspectionsByCarId = exports.getAvailableInspections = exports.createInspectionRequest = void 0;
const client_1 = require("@prisma/client");
const notifications_1 = require("../utils/notifications");
const notification_controller_1 = require("./notification.controller");
const prisma = new client_1.PrismaClient();
const INSPECTION_FEE = 5000; // Fixed fee for inspection
const createInspectionRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId, preferredDate, location, notes } = req.body;
        const { userId } = req.user;
        // Check if car exists
        const car = yield prisma.car.findUnique({
            where: { id: carId },
            include: { seller: true }
        });
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        // Check if user has enough balance in wallet
        const wallet = yield prisma.wallet.findUnique({
            where: { userId }
        });
        if (!wallet || Number(wallet.balance) < INSPECTION_FEE) {
            return res.status(400).json({ error: 'Insufficient wallet balance. Please top up to request inspection.' });
        }
        // Use transaction to deduct fee and create request
        const inspection = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Deduct from buyer wallet
            yield tx.wallet.update({
                where: { userId },
                data: { balance: { decrement: INSPECTION_FEE } }
            });
            // 2. Create transaction record
            yield tx.transaction.create({
                data: {
                    userId,
                    amount: INSPECTION_FEE,
                    type: client_1.TransactionType.INSPECTION_FEE,
                    status: client_1.TransactionStatus.SUCCESS,
                    description: `Inspection request for ${car.year} ${car.make} ${car.model}`,
                    reference: `INS-REQ-${Date.now()}-${carId.substring(0, 8)}`
                }
            });
            // 3. Create inspection request
            return yield tx.inspection.create({
                data: {
                    carId,
                    buyerId: userId,
                    scheduledDate: preferredDate ? new Date(preferredDate) : null,
                    status: client_1.InspectionStatus.REQUESTED,
                    fee: INSPECTION_FEE,
                    reportData: notes || ''
                },
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
        }));
        // Notify all inspectors
        const inspectors = yield prisma.user.findMany({
            where: { role: client_1.Role.INSPECTOR },
            select: { id: true, email: true, phone: true }
        });
        yield (0, notifications_1.notifyNewInspectionRequest)(inspectors, `${car.year} ${car.make} ${car.model}`);
        // Create in-app notifications for all inspectors
        for (const inspector of inspectors) {
            yield (0, notification_controller_1.createNotification)(inspector.id, {
                title: 'New Inspection Request',
                message: `A new inspection request for ${car.year} ${car.make} ${car.model} is available.`,
                type: 'INSPECTION',
                link: '#inspector-dashboard'
            });
        }
        res.status(201).json(inspection);
    }
    catch (error) {
        console.error('Error creating inspection request:', error);
        res.status(500).json({ error: 'Failed to create inspection request' });
    }
});
exports.createInspectionRequest = createInspectionRequest;
const getAvailableInspections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inspections = yield prisma.inspection.findMany({
            where: {
                status: client_1.InspectionStatus.REQUESTED,
                inspectorId: null
            },
            include: {
                car: true,
                buyer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(inspections);
    }
    catch (error) {
        console.error('Error fetching available inspections:', error);
        res.status(500).json({ error: 'Failed to fetch available inspections' });
    }
});
exports.getAvailableInspections = getAvailableInspections;
const getInspectionsByCarId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const inspections = yield prisma.inspection.findMany({
            where: { carId },
            include: {
                inspector: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(inspections);
    }
    catch (error) {
        console.error('Error fetching inspections:', error);
        res.status(500).json({ error: 'Failed to fetch inspections' });
    }
});
exports.getInspectionsByCarId = getInspectionsByCarId;
const getInspectorInspections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const inspections = yield prisma.inspection.findMany({
            where: { inspectorId: userId },
            include: {
                car: true,
                buyer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                },
                report: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(inspections);
    }
    catch (error) {
        console.error('Error fetching inspector inspections:', error);
        res.status(500).json({ error: 'Failed to fetch inspections' });
    }
});
exports.getInspectorInspections = getInspectorInspections;
const getInspectorStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const [totalInspections, activeInspections, completedInspections, revenue] = yield Promise.all([
            prisma.inspection.count({ where: { inspectorId: userId } }),
            prisma.inspection.count({
                where: {
                    inspectorId: userId,
                    status: { in: [client_1.InspectionStatus.SCHEDULED, client_1.InspectionStatus.IN_PROGRESS] }
                }
            }),
            prisma.inspection.count({ where: { inspectorId: userId, status: client_1.InspectionStatus.COMPLETED } }),
            prisma.wallet.findUnique({ where: { userId }, select: { balance: true } })
        ]);
        res.json({
            totalInspections,
            activeInspections,
            completedInspections,
            revenue: (revenue === null || revenue === void 0 ? void 0 : revenue.balance) || 0
        });
    }
    catch (error) {
        console.error('Error fetching inspector stats:', error);
        res.status(500).json({ error: 'Failed to fetch inspector stats' });
    }
});
exports.getInspectorStats = getInspectorStats;
const assignInspector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { inspectionId } = req.params;
        const { userId } = req.user;
        const inspection = yield prisma.inspection.update({
            where: { id: inspectionId },
            data: {
                inspectorId: userId,
                status: client_1.InspectionStatus.SCHEDULED
            },
            include: {
                car: true,
                buyer: {
                    select: {
                        email: true,
                        phone: true,
                        firstName: true
                    }
                },
                inspector: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        // Notify buyer
        if (inspection.buyer) {
            yield (0, notifications_1.notifyInspectionClaimed)(inspection.buyer, `${inspection.car.year} ${inspection.car.make} ${inspection.car.model}`, `${(_a = inspection.inspector) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = inspection.inspector) === null || _b === void 0 ? void 0 : _b.lastName}`);
        }
        res.json(inspection);
    }
    catch (error) {
        console.error('Error assigning inspector:', error);
        res.status(500).json({ error: 'Failed to assign inspector' });
    }
});
exports.assignInspector = assignInspector;
const submitInspectionReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { inspectionId } = req.params;
        const { exteriorScore, interiorScore, engineScore, suspensionScore, tiresScore, lightsScore, exteriorStatus, interiorStatus, engineStatus, suspensionStatus, tiresStatus, lightsStatus, recommendations, photos } = req.body;
        const { userId } = req.user;
        // Verify inspection exists and belongs to this inspector
        const inspection = yield prisma.inspection.findUnique({
            where: { id: inspectionId }
        });
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }
        if (inspection.inspectorId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to submit this report' });
        }
        // Calculate average score
        const scores = [exteriorScore, interiorScore, engineScore, suspensionScore, tiresScore, lightsScore];
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        // Create compact report data for frontend display
        const compactReportData = JSON.stringify({
            exterior: {
                rating: exteriorScore,
                comment: exteriorStatus
            },
            interior: {
                rating: interiorScore,
                comment: interiorStatus
            },
            engine: {
                rating: engineScore,
                comment: engineStatus
            },
            suspension: {
                rating: suspensionScore,
                comment: suspensionStatus
            },
            tires: {
                rating: tiresScore,
                comment: tiresStatus
            },
            electrical: {
                rating: lightsScore,
                comment: lightsStatus
            },
            averageScore,
            recommendations: recommendations ? [recommendations] : [],
            photos: photos || []
        });
        // Create report and update inspection status
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Create/Update the report
            const report = yield tx.inspectionReport.upsert({
                where: { inspectionId },
                create: {
                    inspectionId,
                    exteriorScore, interiorScore, engineScore,
                    suspensionScore, tiresScore, lightsScore,
                    exteriorStatus, interiorStatus, engineStatus,
                    suspensionStatus, tiresStatus, lightsStatus,
                    recommendations,
                    photos: photos || []
                },
                update: {
                    exteriorScore, interiorScore, engineScore,
                    suspensionScore, tiresScore, lightsScore,
                    exteriorStatus, interiorStatus, engineStatus,
                    suspensionStatus, tiresStatus, lightsStatus,
                    recommendations,
                    photos: photos || []
                }
            });
            // 2. Update inspection status, score and reportData
            const updatedInspection = yield tx.inspection.update({
                where: { id: inspectionId },
                data: {
                    status: client_1.InspectionStatus.COMPLETED,
                    completedDate: new Date(),
                    score: averageScore,
                    reportData: compactReportData
                }
            });
            // 3. Credit inspector's wallet
            yield tx.wallet.upsert({
                where: { userId },
                create: {
                    userId,
                    balance: INSPECTION_FEE,
                    currency: 'NGN'
                },
                update: {
                    balance: { increment: INSPECTION_FEE }
                }
            });
            // 4. Create transaction record for inspector
            yield tx.transaction.create({
                data: {
                    userId,
                    amount: INSPECTION_FEE,
                    type: client_1.TransactionType.INSPECTION_EARNING,
                    status: client_1.TransactionStatus.SUCCESS,
                    description: `Earnings for completed inspection: ${inspectionId}`,
                    reference: `INS-EARN-${Date.now()}-${inspectionId.substring(0, 8)}`
                }
            });
            return { report, inspection: updatedInspection };
        }));
        // Notify buyer that report is ready
        const fullInspection = yield prisma.inspection.findUnique({
            where: { id: inspectionId },
            include: {
                car: true,
                buyer: {
                    select: {
                        email: true,
                        phone: true
                    }
                }
            }
        });
        if (fullInspection === null || fullInspection === void 0 ? void 0 : fullInspection.buyer) {
            yield (0, notifications_1.notifyInspectionCompleted)(fullInspection.buyer, `${fullInspection.car.year} ${fullInspection.car.make} ${fullInspection.car.model}`);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Error submitting inspection report:', error);
        res.status(500).json({ error: 'Failed to submit inspection report' });
    }
});
exports.submitInspectionReport = submitInspectionReport;
const uploadInspectionPhotos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No photos uploaded' });
        }
        const photoUrls = req.files.map((file) => file.path);
        res.json({ photoUrls });
    }
    catch (error) {
        console.error('Error uploading inspection photos:', error);
        res.status(500).json({ error: 'Failed to upload photos' });
    }
});
exports.uploadInspectionPhotos = uploadInspectionPhotos;
