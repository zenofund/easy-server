"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../controllers/wallet.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All wallet routes are protected
router.get('/', auth_middleware_1.authenticateToken, wallet_controller_1.getWallet);
router.post('/deposit', auth_middleware_1.authenticateToken, wallet_controller_1.depositRequest);
router.post('/withdrawal', auth_middleware_1.authenticateToken, wallet_controller_1.withdrawalRequest);
router.post('/purchase', auth_middleware_1.authenticateToken, wallet_controller_1.purchaseCar);
// Paystack routes
router.post('/paystack/initialize', auth_middleware_1.authenticateToken, wallet_controller_1.initializePaystackDeposit);
router.get('/paystack/verify', auth_middleware_1.authenticateToken, wallet_controller_1.verifyPaystackDeposit);
exports.default = router;
