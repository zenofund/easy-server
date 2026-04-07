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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.resendVerification = exports.verifyEmail = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const notifications_1 = require("../utils/notifications");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET is not defined in environment variables');
}
// Ensure JWT_SECRET is a string for TypeScript
const secret = JWT_SECRET;
// Utility to generate 4-digit code
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
// Validation Schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    role: zod_1.z.enum(['BUYER', 'SELLER', 'INSPECTOR', 'ADMIN']).optional(),
    phone: zod_1.z.string().optional(),
    sellerProfile: zod_1.z.object({
        carLotName: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const validatedData = registerSchema.parse(req.body);
        // Check if user exists
        const existingUser = yield prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(validatedData.password, 10);
        // Create user
        const user = yield prisma.user.create({
            data: Object.assign(Object.assign({ firstName: validatedData.firstName, lastName: validatedData.lastName, email: validatedData.email, password: hashedPassword, phone: validatedData.phone, role: validatedData.role || client_1.Role.BUYER, status: validatedData.role === 'SELLER' ? client_1.UserStatus.PENDING : client_1.UserStatus.ACTIVE, verified: false, 
                // Create wallet for every user
                wallet: {
                    create: {
                        balance: 0,
                        currency: 'NGN',
                    },
                } }, (validatedData.role === 'SELLER' && {
                sellerProfile: {
                    create: {
                        // If carLotName is provided, treat as COMPANY, otherwise INDIVIDUAL
                        type: ((_b = (_a = validatedData.sellerProfile) === null || _a === void 0 ? void 0 : _a.carLotName) === null || _b === void 0 ? void 0 : _b.trim())
                            ? client_1.SellerType.COMPANY
                            : client_1.SellerType.INDIVIDUAL,
                        companyName: ((_d = (_c = validatedData.sellerProfile) === null || _c === void 0 ? void 0 : _c.carLotName) === null || _d === void 0 ? void 0 : _d.trim()) || null,
                        address: ((_e = validatedData.sellerProfile) === null || _e === void 0 ? void 0 : _e.address) || '',
                        verified: false,
                    },
                },
            })), ((!validatedData.role || validatedData.role === 'BUYER') && {
                buyerProfile: {
                    create: {},
                },
            })),
        });
        // Generate and send verification code
        const verificationCode = generateVerificationCode();
        // Using a lower rounds count for faster hashing (10 is default, 8 is still very secure for short-lived codes)
        const codeHash = yield bcryptjs_1.default.hash(verificationCode, 8);
        yield prisma.verificationCode.create({
            data: {
                userId: user.id,
                codeHash,
                purpose: client_1.VerificationPurpose.SIGNUP,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            },
        });
        // Don't await the email sending to speed up the response
        (0, notifications_1.sendOTP)(user.email, verificationCode, 'signup');
        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.issues });
            return;
        }
        res.status(500).json({ error: 'Internal server error', details: String(error) });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = loginSchema.parse(req.body);
        // Find user
        const user = yield prisma.user.findUnique({
            where: { email: validatedData.email },
            include: {
                buyerProfile: true,
                sellerProfile: true,
                inspectorProfile: true,
            },
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Verify password
        const isValidPassword = yield bcryptjs_1.default.compare(validatedData.password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Check if user is verified
        if (!user.verified) {
            res.status(403).json({
                error: 'Please verify your email to login',
                unverified: true,
                email: user.email
            });
            return;
        }
        if (user.status !== client_1.UserStatus.ACTIVE) {
            const isPending = user.status === client_1.UserStatus.PENDING;
            res.status(403).json({
                error: isPending ? 'Your account is pending admin approval' : 'Your account has been deactivated',
                status: user.status
            });
            return;
        }
        // Generate token
        const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                buyerProfile: user.buyerProfile,
                sellerProfile: user.sellerProfile,
                inspectorProfile: user.inspectorProfile,
            },
        });
    }
    catch (error) {
        console.error('Login error in controller:', error);
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.issues });
            return;
        }
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.login = login;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            res.status(400).json({ error: 'Email and verification code are required' });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (user.verified) {
            res.status(400).json({ error: 'Email is already verified' });
            return;
        }
        const verificationRecord = yield prisma.verificationCode.findFirst({
            where: {
                userId: user.id,
                purpose: client_1.VerificationPurpose.SIGNUP,
                usedAt: null,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!verificationRecord) {
            res.status(400).json({ error: 'Verification code expired or not found' });
            return;
        }
        const isValidCode = yield bcryptjs_1.default.compare(code, verificationRecord.codeHash);
        if (!isValidCode) {
            res.status(400).json({ error: 'Invalid verification code' });
            return;
        }
        // Mark as verified and code as used
        yield prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { verified: true },
            }),
            prisma.verificationCode.update({
                where: { id: verificationRecord.id },
                data: { usedAt: new Date() },
            }),
        ]);
        // Generate token for immediate login after verification
        const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '24h' });
        res.json({
            message: 'Email verified successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.verifyEmail = verifyEmail;
const resendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (user.verified) {
            res.status(400).json({ error: 'Email is already verified' });
            return;
        }
        // Generate new code
        const verificationCode = generateVerificationCode();
        // Using a lower rounds count for faster hashing (10 is default, 8 is still very secure for short-lived codes)
        const codeHash = yield bcryptjs_1.default.hash(verificationCode, 8);
        yield prisma.verificationCode.create({
            data: {
                userId: user.id,
                codeHash,
                purpose: client_1.VerificationPurpose.SIGNUP,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            },
        });
        // Don't await the email sending to speed up the response
        (0, notifications_1.sendOTP)(user.email, verificationCode, 'signup');
        res.json({ message: 'New verification code sent to your email' });
    }
    catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.resendVerification = resendVerification;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            // For security, don't reveal if user exists or not
            res.json({ message: 'If an account exists with this email, a reset code has been sent.' });
            return;
        }
        // Generate code
        const verificationCode = generateVerificationCode();
        const codeHash = yield bcryptjs_1.default.hash(verificationCode, 8);
        yield prisma.verificationCode.create({
            data: {
                userId: user.id,
                codeHash,
                purpose: client_1.VerificationPurpose.FORGOT_PASSWORD,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            },
        });
        (0, notifications_1.sendOTP)(user.email, verificationCode, 'forgot-password');
        res.json({ message: 'If an account exists with this email, a reset code has been sent.' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            res.status(400).json({ error: 'Email, code, and new password are required' });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const verificationRecord = yield prisma.verificationCode.findFirst({
            where: {
                userId: user.id,
                purpose: client_1.VerificationPurpose.FORGOT_PASSWORD,
                usedAt: null,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!verificationRecord) {
            res.status(400).json({ error: 'Invalid or expired reset code' });
            return;
        }
        const isValidCode = yield bcryptjs_1.default.compare(code, verificationRecord.codeHash);
        if (!isValidCode) {
            res.status(400).json({ error: 'Invalid reset code' });
            return;
        }
        // Hash new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update password and mark code as used
        yield prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            }),
            prisma.verificationCode.update({
                where: { id: verificationRecord.id },
                data: { usedAt: new Date() },
            }),
        ]);
        res.json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.resetPassword = resetPassword;
