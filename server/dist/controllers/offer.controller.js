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
exports.cancelOffer = exports.rejectOffer = exports.createOffer = exports.acceptOffer = exports.counterOffer = exports.getOffersByCarId = exports.getSellerOffers = void 0;
const client_1 = require("@prisma/client");
const notification_controller_1 = require("./notification.controller");
const prisma = new client_1.PrismaClient();
const getSellerOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [offers, total] = yield Promise.all([
            prisma.offer.findMany({
                where: { sellerId: userId },
                include: {
                    buyer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            avatar: true
                        }
                    },
                    car: {
                        select: {
                            id: true,
                            title: true,
                            make: true,
                            model: true,
                            year: true,
                            price: true,
                            images: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.offer.count({
                where: { sellerId: userId }
            })
        ]);
        const formattedOffers = offers.map(offer => ({
            id: offer.id,
            buyerName: `${offer.buyer.firstName} ${offer.buyer.lastName}`,
            amount: offer.amount.toString(),
            status: offer.status,
            carDetails: `${offer.car.make} ${offer.car.model} ${offer.car.year}`,
            carId: offer.carId,
            createdAt: offer.createdAt
        }));
        res.json({
            offers: formattedOffers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Error fetching seller offers:', error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});
exports.getSellerOffers = getSellerOffers;
const getOffersByCarId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const { userId } = req.user;
        // Verify car ownership
        const car = yield prisma.car.findUnique({
            where: { id: carId },
            select: { sellerId: true }
        });
        if (!car || car.sellerId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to view offers for this car' });
        }
        const offers = yield prisma.offer.findMany({
            where: { carId },
            include: {
                buyer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(offers);
    }
    catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});
exports.getOffersByCarId = getOffersByCarId;
const counterOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const { userId } = req.user;
        const offer = yield prisma.offer.findUnique({
            where: { id }
        });
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        if (offer.sellerId !== userId) {
            return res.status(403).json({ error: 'Only the seller can counter an offer' });
        }
        const updatedOffer = yield prisma.offer.update({
            where: { id },
            data: {
                amount: parseFloat(amount.toString().replace(/[^0-9.]/g, '')),
                status: client_1.OfferStatus.COUNTERED,
                updatedAt: new Date()
            },
            include: {
                car: true,
                seller: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        // Notify buyer about counter offer
        yield (0, notification_controller_1.createNotification)(offer.buyerId, {
            title: 'New Counter Offer',
            message: `${updatedOffer.seller.firstName} ${updatedOffer.seller.lastName} sent a counter offer of ₦${amount.toLocaleString()} for ${updatedOffer.car.year} ${updatedOffer.car.make} ${updatedOffer.car.model}`,
            type: 'OFFER',
            link: '/buyer-dashboard?tab=offers'
        });
        res.json(updatedOffer);
    }
    catch (error) {
        console.error('Error countering offer:', error);
        res.status(500).json({ error: 'Failed to counter offer' });
    }
});
exports.counterOffer = counterOffer;
const acceptOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const offer = yield prisma.offer.findUnique({
            where: { id }
        });
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        // If it's PENDING, only seller can accept
        // If it's COUNTERED, only buyer can accept
        if (offer.status === client_1.OfferStatus.PENDING) {
            if (offer.sellerId !== userId) {
                return res.status(403).json({ error: 'Only the seller can accept this offer' });
            }
        }
        else if (offer.status === client_1.OfferStatus.COUNTERED) {
            if (offer.buyerId !== userId) {
                return res.status(403).json({ error: 'Only the buyer can accept this counter offer' });
            }
        }
        else {
            return res.status(400).json({ error: 'Offer cannot be accepted in its current status' });
        }
        const updatedOffer = yield prisma.offer.update({
            where: { id },
            data: {
                status: client_1.OfferStatus.ACCEPTED,
                updatedAt: new Date()
            },
            include: {
                car: true,
                buyer: {
                    select: { firstName: true, lastName: true }
                },
                seller: {
                    select: { firstName: true, lastName: true }
                }
            }
        });
        // Notify the other party
        if (offer.status === client_1.OfferStatus.PENDING) {
            // Seller accepted buyer's offer
            yield (0, notification_controller_1.createNotification)(offer.buyerId, {
                title: 'Offer Accepted',
                message: `${updatedOffer.seller.firstName} ${updatedOffer.seller.lastName} accepted your offer for ${updatedOffer.car.year} ${updatedOffer.car.make} ${updatedOffer.car.model}. You can now proceed to payment.`,
                type: 'OFFER',
                link: '/buyer-dashboard?tab=offers'
            });
        }
        else if (offer.status === client_1.OfferStatus.COUNTERED) {
            // Buyer accepted seller's counter offer
            yield (0, notification_controller_1.createNotification)(offer.sellerId, {
                title: 'Counter Offer Accepted',
                message: `${updatedOffer.buyer.firstName} ${updatedOffer.buyer.lastName} accepted your counter offer for ${updatedOffer.car.year} ${updatedOffer.car.make} ${updatedOffer.car.model}.`,
                type: 'OFFER',
                link: '/seller-dashboard?tab=offers'
            });
        }
        res.json(updatedOffer);
    }
    catch (error) {
        console.error('Error accepting offer:', error);
        res.status(500).json({ error: 'Failed to accept offer' });
    }
});
exports.acceptOffer = acceptOffer;
const createOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId, amount } = req.body;
        const { userId } = req.user;
        // Get car to find sellerId
        const car = yield prisma.car.findUnique({
            where: { id: carId },
            select: { sellerId: true, price: true }
        });
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        // Check if buyer is trying to offer on their own car
        if (car.sellerId === userId) {
            return res.status(400).json({ error: 'You cannot make an offer on your own car' });
        }
        // Check if an offer already exists for this car by this buyer
        const existingOffer = yield prisma.offer.findFirst({
            where: {
                carId,
                buyerId: userId,
                status: {
                    in: [client_1.OfferStatus.PENDING, client_1.OfferStatus.ACCEPTED]
                }
            }
        });
        if (existingOffer) {
            return res.status(400).json({ error: 'You already have an active offer for this car' });
        }
        const offer = yield prisma.offer.create({
            data: {
                carId,
                buyerId: userId,
                sellerId: car.sellerId,
                amount: parseFloat(amount.replace(/[^0-9.]/g, '')),
                status: client_1.OfferStatus.PENDING
            },
            include: {
                car: true,
                buyer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        // Notify seller about new offer
        yield (0, notification_controller_1.createNotification)(car.sellerId, {
            title: 'New Offer Received',
            message: `${offer.buyer.firstName} ${offer.buyer.lastName} made an offer of ₦${offer.amount.toLocaleString()} for your ${offer.car.year} ${offer.car.make} ${offer.car.model}`,
            type: 'OFFER',
            link: `/seller-dashboard?tab=offers`
        });
        res.status(201).json(offer);
    }
    catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({ error: 'Failed to create offer' });
    }
});
exports.createOffer = createOffer;
const rejectOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const offer = yield prisma.offer.findUnique({
            where: { id },
            include: { car: true }
        });
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        // Only buyer can decline a seller's counter or accepted offer?
        // Actually, usually seller rejects buyer's offer.
        // User said: "buyer can decline sellers offer"
        if (offer.buyerId !== userId && offer.sellerId !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const updatedOffer = yield prisma.offer.update({
            where: { id },
            data: {
                status: client_1.OfferStatus.REJECTED,
                updatedAt: new Date()
            },
            include: {
                car: true,
                buyer: { select: { firstName: true, lastName: true } },
                seller: { select: { firstName: true, lastName: true } }
            }
        });
        // Notify the other party
        if (userId === offer.sellerId) {
            // Seller rejected buyer's offer
            yield (0, notification_controller_1.createNotification)(offer.buyerId, {
                title: 'Offer Rejected',
                message: `Your offer for ${updatedOffer.car.year} ${updatedOffer.car.make} ${updatedOffer.car.model} has been rejected.`,
                type: 'OFFER',
                link: '/buyer-dashboard?tab=offers'
            });
        }
        else {
            // Buyer rejected seller's counter offer
            yield (0, notification_controller_1.createNotification)(offer.sellerId, {
                title: 'Counter Offer Rejected',
                message: `Your counter offer for ${updatedOffer.car.year} ${updatedOffer.car.make} ${updatedOffer.car.model} was rejected by the buyer.`,
                type: 'OFFER',
                link: '/seller-dashboard?tab=offers'
            });
        }
        res.json(updatedOffer);
    }
    catch (error) {
        console.error('Error rejecting offer:', error);
        res.status(500).json({ error: 'Failed to reject offer' });
    }
});
exports.rejectOffer = rejectOffer;
const cancelOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const offer = yield prisma.offer.findUnique({
            where: { id }
        });
        if (!offer) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        if (offer.buyerId !== userId) {
            return res.status(403).json({ error: 'Only the buyer can cancel their offer' });
        }
        const updatedOffer = yield prisma.offer.update({
            where: { id },
            data: {
                status: client_1.OfferStatus.CANCELLED,
                updatedAt: new Date()
            },
            include: {
                car: true,
                buyer: { select: { firstName: true, lastName: true } }
            }
        });
        // Notify seller about cancellation
        yield (0, notification_controller_1.createNotification)(offer.sellerId, {
            title: 'Offer Cancelled',
            message: `${updatedOffer.buyer.firstName} ${updatedOffer.buyer.lastName} cancelled their offer for ${updatedOffer.car.year} ${updatedOffer.car.make} ${updatedOffer.car.model}.`,
            type: 'OFFER',
            link: '/seller-dashboard?tab=offers'
        });
        res.json(updatedOffer);
    }
    catch (error) {
        console.error('Error cancelling offer:', error);
        res.status(500).json({ error: 'Failed to cancel offer' });
    }
});
exports.cancelOffer = cancelOffer;
