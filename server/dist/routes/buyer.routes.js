"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const buyer_controller_1 = require("../controllers/buyer.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/:id/stats', auth_middleware_1.authenticateToken, buyer_controller_1.getBuyerStats);
router.get('/:id/activities', auth_middleware_1.authenticateToken, buyer_controller_1.getBuyerActivities);
exports.default = router;
