"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const support_controller_1 = require("../controllers/support.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Customer support routes
router.post('/tickets', auth_middleware_1.authenticateToken, support_controller_1.createTicket);
router.get('/tickets', auth_middleware_1.authenticateToken, support_controller_1.getTickets);
router.get('/tickets/:id', auth_middleware_1.authenticateToken, support_controller_1.getTicketDetails);
router.post('/tickets/:id/messages', auth_middleware_1.authenticateToken, support_controller_1.sendSupportMessage);
router.patch('/tickets/:id/status', auth_middleware_1.authenticateToken, support_controller_1.updateTicketStatus);
exports.default = router;
