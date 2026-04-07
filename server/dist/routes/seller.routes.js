"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seller_controller_1 = require("../controllers/seller.controller");
const subscription_controller_1 = require("../controllers/subscription.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public/Seller routes
router.get('/subscription-plans', subscription_controller_1.getActiveSubscriptionPlans);
router.get('/', seller_controller_1.getSellers);
router.put('/profile', auth_middleware_1.authenticateToken, seller_controller_1.updateSellerProfile);
router.get('/:id', auth_middleware_1.optionalAuthenticateToken, seller_controller_1.getSellerById);
router.get('/:id/revenue', seller_controller_1.getSellerRevenue);
exports.default = router;
