"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const car_controller_1 = require("../controllers/car.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// Public routes (with optional auth for isFavorited status)
router.get('/', auth_middleware_1.optionalAuthenticateToken, car_controller_1.getCars);
router.get('/:id', auth_middleware_1.optionalAuthenticateToken, car_controller_1.getCarById);
// Protected routes
router.post('/', auth_middleware_1.authenticateToken, upload_middleware_1.upload.array('images', 10), car_controller_1.createCar);
router.put('/:id', auth_middleware_1.authenticateToken, upload_middleware_1.upload.array('images', 10), car_controller_1.updateCar);
router.post('/:id/request-deletion', auth_middleware_1.authenticateToken, car_controller_1.requestDeletion);
exports.default = router;
