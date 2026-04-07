"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const adminController = __importStar(require("../controllers/admin.controller"));
const walletController = __importStar(require("../controllers/wallet.controller"));
const subscriptionController = __importStar(require("../controllers/subscription.controller"));
const router = (0, express_1.Router)();
// Apply authentication and admin check to all admin routes
router.use(auth_middleware_1.authenticateToken);
router.use(auth_middleware_1.isAdmin);
// Dashboard stats
router.get('/stats', adminController.getAdminStats);
router.get('/finance/summary', adminController.getAdminFinanceSummary);
// User management
router.get('/users', adminController.getAdminUsers);
router.get('/users/:id', adminController.getAdminUserDetails);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.patch('/users/:id', adminController.updateUser);
router.post('/users', adminController.createAdminUser);
router.post('/users/:id/message', adminController.sendUserMessage);
// Wallet management
router.get('/wallet/pending', walletController.getPendingTransactions);
router.post('/wallet/approve/:transactionId', walletController.approveTransaction);
// System configuration
router.get('/config', adminController.getSystemConfig);
router.post('/config', adminController.updateSystemConfig);
router.post('/config/test-smtp', adminController.testSMTPDeliverability);
// Subscription Plans
router.get('/subscriptions/plans', subscriptionController.getSubscriptionPlans);
router.post('/subscriptions/plans', subscriptionController.createSubscriptionPlan);
router.put('/subscriptions/plans/:id', subscriptionController.updateSubscriptionPlan);
router.delete('/subscriptions/plans/:id', subscriptionController.deleteSubscriptionPlan);
exports.default = router;
