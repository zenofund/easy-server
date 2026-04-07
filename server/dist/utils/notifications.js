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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyInspectionCompleted = exports.notifyInspectionClaimed = exports.notifyNewInspectionRequest = exports.sendSMS = exports.sendOTP = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let transporter = null;
let currentConfig = null;
const getTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to get config from DB first
        const configs = yield prisma.systemConfig.findMany({
            where: {
                key: {
                    in: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM']
                }
            }
        });
        const dbConfig = {};
        configs.forEach(c => {
            dbConfig[c.key] = c.value;
        });
        // Check if config has changed or if transporter is null
        const configHash = JSON.stringify(dbConfig);
        if (!transporter || currentConfig !== configHash) {
            const host = dbConfig.SMTP_HOST || process.env.SMTP_HOST;
            const port = parseInt(dbConfig.SMTP_PORT || process.env.SMTP_PORT || '465');
            const user = dbConfig.SMTP_USER || process.env.SMTP_USER;
            const pass = dbConfig.SMTP_PASS || process.env.SMTP_PASS;
            console.log(`[SMTP] Attempting connection to ${host}:${port}`);
            console.log(`[SMTP] User: ${user}, Pass: ${pass ? '****' + pass.slice(-4) : 'not set'}`);
            console.log(`[SMTP] Secure: ${port === 465}, requireTLS: ${port === 587 || (host === null || host === void 0 ? void 0 : host.includes('resend.com'))}`);
            if (!host || !user || !pass) {
                const errorMsg = `SMTP configuration is missing: ${!host ? 'host ' : ''}${!user ? 'user ' : ''}${!pass ? 'pass' : ''}`;
                console.warn(errorMsg);
                return { error: errorMsg };
            }
            const isResend = host === null || host === void 0 ? void 0 : host.includes('resend.com');
            const isPort587 = port === 587;
            const isPort465 = port === 465;
            const newTransporter = nodemailer_1.default.createTransport({
                host,
                port,
                secure: isPort465, // Use SSL for 465
                auth: {
                    user,
                    pass,
                },
                tls: {
                    // Do not fail on invalid certs
                    rejectUnauthorized: false,
                    minVersion: 'TLSv1.2'
                },
                // STARTTLS for 587, but ignore for 465 as it uses implicit SSL
                requireTLS: isPort587,
                connectionTimeout: 20000, // 20s is enough to know if it's blocked
                greetingTimeout: 20000,
                socketTimeout: 30000,
                family: 4,
                debug: true,
                logger: true,
                // Add pooling for better performance once connected
                pool: false
            });
            try {
                yield newTransporter.verify();
                console.log('SMTP connection verified successfully');
                transporter = newTransporter;
                currentConfig = configHash;
            }
            catch (verifyError) {
                console.error('SMTP verification failed:', verifyError);
                let message = verifyError.message;
                if (verifyError.code === 'ETIMEDOUT' || message.includes('timeout') || message.includes('ETIMEDOUT')) {
                    message = `Connection timed out. 
            - On Railway, Port 587 is sometimes throttled. Please try Port 465.
            - If using Port 465, ensure "Secure" would be true (handled automatically by the code).
            - Current Host: ${host}, Port: ${port}.`;
                }
                else if (verifyError.code === 'ECONNREFUSED' || message.includes('ECONNREFUSED')) {
                    message = `Connection refused. The host "${host}" is not accepting connections on port ${port}. Check if the port is correct.`;
                }
                else if (message.includes('Greeting never received')) {
                    message = `Connection established but no response (Greeting timeout). 
            - This usually means a port mismatch (e.g., using 465 when the server expects 587).
            - Try switching your port to ${port === 465 ? '587' : '465'}.`;
                }
                return { error: `SMTP verification failed: ${message}` };
            }
        }
        return {
            transporter,
            from: dbConfig.SMTP_FROM || process.env.SMTP_FROM || process.env.SMTP_USER
        };
    }
    catch (error) {
        console.error('Error getting SMTP transporter:', error);
        return { error: `Internal error: ${error.message}` };
    }
});
const sendEmail = (to, subject, body, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield getTransporter();
        if ('error' in config || !config.transporter) {
            const errorMsg = config.error || 'SMTP not configured';
            console.warn(`[EMAIL] Skipping send to ${to}: ${errorMsg}`);
            return { success: false, error: errorMsg };
        }
        const info = yield config.transporter.sendMail({
            from: config.from || '"Huce Autos" <support@huceautos.com>',
            to,
            subject,
            text: body,
            html: html || body,
        });
        console.log(`[EMAIL] Sent: ${info.messageId} to ${to}`);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error(`[EMAIL] Error sending to ${to}:`, error);
        return { success: false, error: error.message };
    }
});
exports.sendEmail = sendEmail;
const getOTPTemplate = (otp, title = "Verify Your Account") => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; }
            .header { text-align: center; padding-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 800; color: #005C32; font-family: 'Lexend', sans-serif; letter-spacing: -0.5px; }
            .content { text-align: center; padding: 20px 0; }
            .title { font-size: 22px; font-weight: 600; color: #1a202c; margin-bottom: 16px; }
            .text { font-size: 16px; color: #4a5568; margin-bottom: 24px; }
            .otp-container { background-color: #f7fafc; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px dashed #cbd5e0; }
            .otp-code { font-size: 42px; font-weight: 700; color: #005C32; letter-spacing: 8px; margin: 0; }
            .footer { text-align: center; font-size: 14px; color: #718096; padding-top: 30px; border-top: 1px solid #edf2f7; margin-top: 20px; }
            .tagline { color: #005C32; font-weight: 500; margin-top: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">HUCE AUTOMARTS</div>
            </div>
            <div class="content">
                <div class="title">${title}</div>
                <p class="text">Hello,</p>
                <p class="text">Use the verification code below to complete your action on Huce Automarts. This code is valid for 15 minutes.</p>
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                </div>
                <p class="text" style="font-size: 14px;">If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Huce Automarts. All rights reserved.</p>
                <p class="tagline">Drive with Confidence</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
const sendOTP = (to, otp, purpose) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = purpose === 'signup'
        ? 'Verify your email - Huce Automarts'
        : 'Reset your password - Huce Automarts';
    const title = purpose === 'signup'
        ? 'Verify Your Account'
        : 'Reset Your Password';
    const html = getOTPTemplate(otp, title);
    const text = `Your verification code is: ${otp}. It expires in 15 minutes.`;
    const result = yield (0, exports.sendEmail)(to, subject, text, html);
    if (!result.success) {
        console.error(`[OTP] Failed to send to ${to}:`, result.error);
    }
    else {
        console.log(`[OTP] Successfully sent to ${to}`);
    }
    return result;
});
exports.sendOTP = sendOTP;
const sendSMS = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[SMS] To: ${to}, Message: ${message}`);
    // Placeholder for real SMS service like Twilio, Vonage, etc.
    return true;
});
exports.sendSMS = sendSMS;
const notifyNewInspectionRequest = (inspectors, carDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = "New Inspection Request Available";
    const body = `A new inspection request for ${carDetails} is available for claiming.`;
    for (const inspector of inspectors) {
        if (inspector.email) {
            yield (0, exports.sendEmail)(inspector.email, subject, body);
        }
        if (inspector.phone) {
            yield (0, exports.sendSMS)(inspector.phone, body);
        }
    }
});
exports.notifyNewInspectionRequest = notifyNewInspectionRequest;
const notifyInspectionClaimed = (buyer, carDetails, inspectorName) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = "Your Inspection Request has been Claimed";
    const body = `Good news! Your inspection request for ${carDetails} has been claimed by ${inspectorName}. They will contact you shortly to schedule the physical inspection.`;
    if (buyer.email) {
        yield (0, exports.sendEmail)(buyer.email, subject, body);
    }
    if (buyer.phone) {
        yield (0, exports.sendSMS)(buyer.phone, body);
    }
});
exports.notifyInspectionClaimed = notifyInspectionClaimed;
const notifyInspectionCompleted = (buyer, carDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = "Inspection Report Ready";
    const body = `Your inspection report for ${carDetails} is now ready. You can view it on your dashboard.`;
    if (buyer.email) {
        yield (0, exports.sendEmail)(buyer.email, subject, body);
    }
    if (buyer.phone) {
        yield (0, exports.sendSMS)(buyer.phone, body);
    }
});
exports.notifyInspectionCompleted = notifyInspectionCompleted;
