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
exports.deleteSubscriptionPlan = exports.updateSubscriptionPlan = exports.createSubscriptionPlan = exports.getActiveSubscriptionPlans = exports.getSubscriptionPlans = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all subscription plans
const getSubscriptionPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield prisma.subscriptionPlan.findMany({
            orderBy: { price: 'asc' }
        });
        res.json(plans);
    }
    catch (error) {
        console.error('Error fetching subscription plans:', error);
        res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
});
exports.getSubscriptionPlans = getSubscriptionPlans;
// Get active subscription plans (public)
const getActiveSubscriptionPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield prisma.subscriptionPlan.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' }
        });
        res.json(plans);
    }
    catch (error) {
        console.error('Error fetching active subscription plans:', error);
        res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
});
exports.getActiveSubscriptionPlans = getActiveSubscriptionPlans;
// Create a new subscription plan
const createSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, duration, features, listingLimit, featuredListings, prioritySupport, analyticsAccess } = req.body;
        const plan = yield prisma.subscriptionPlan.create({
            data: {
                name,
                price,
                duration,
                features,
                listingLimit,
                featuredListings,
                prioritySupport,
                analyticsAccess
            }
        });
        res.status(201).json(plan);
    }
    catch (error) {
        console.error('Error creating subscription plan:', error);
        res.status(500).json({ error: 'Failed to create subscription plan' });
    }
});
exports.createSubscriptionPlan = createSubscriptionPlan;
// Update a subscription plan
const updateSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, duration, features, listingLimit, featuredListings, prioritySupport, analyticsAccess, isActive } = req.body;
        const plan = yield prisma.subscriptionPlan.update({
            where: { id: String(id) },
            data: {
                name,
                price,
                duration,
                features,
                listingLimit,
                featuredListings,
                prioritySupport,
                analyticsAccess,
                isActive
            }
        });
        res.json(plan);
    }
    catch (error) {
        console.error('Error updating subscription plan:', error);
        res.status(500).json({ error: 'Failed to update subscription plan' });
    }
});
exports.updateSubscriptionPlan = updateSubscriptionPlan;
// Delete a subscription plan
const deleteSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if any active subscriptions exist for this plan
        const activeSubscriptions = yield prisma.userSubscription.count({
            where: { planId: String(id), isActive: true }
        });
        if (activeSubscriptions > 0) {
            // Soft delete by deactivating
            yield prisma.subscriptionPlan.update({
                where: { id: String(id) },
                data: { isActive: false }
            });
            return res.json({ message: 'Plan deactivated (has active subscriptions)' });
        }
        yield prisma.subscriptionPlan.delete({
            where: { id: String(id) }
        });
        res.json({ message: 'Subscription plan deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting subscription plan:', error);
        res.status(500).json({ error: 'Failed to delete subscription plan' });
    }
});
exports.deleteSubscriptionPlan = deleteSubscriptionPlan;
