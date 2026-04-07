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
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables as early as possible
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const car_routes_1 = __importDefault(require("./routes/car.routes"));
const seller_routes_1 = __importDefault(require("./routes/seller.routes"));
const offer_routes_1 = __importDefault(require("./routes/offer.routes"));
const buyer_routes_1 = __importDefault(require("./routes/buyer.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
const inspection_routes_1 = __importDefault(require("./routes/inspection.routes"));
const savedCar_routes_1 = __importDefault(require("./routes/savedCar.routes"));
const viewHistory_routes_1 = __importDefault(require("./routes/viewHistory.routes"));
const support_routes_1 = __importDefault(require("./routes/support.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const http_1 = require("http");
const socket_service_1 = require("./services/socket.service");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const prisma = new client_1.PrismaClient();
const PORT = Number(process.env.PORT) || 5000;
// Validate critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.log('Available environment variables:', Object.keys(process.env).filter(k => !k.includes('PASS') && !k.includes('SECRET') && !k.includes('URL')));
    process.exit(1);
}
console.log('Environment variables validated.');
// Initialize Socket.io
socket_service_1.socketService.init(httpServer);
// Middleware
const allowedOrigins = [
    'https://huceautos.com',
    'https://www.huceautos.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    'https://huce-autos.up.railway.app' // Example Railway URL placeholder
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin.includes('*')) {
                const regex = new RegExp('^' + allowedOrigin.replace(/\*/g, '.*') + '$');
                return regex.test(origin);
            }
            return allowedOrigin === origin;
        });
        if (!isAllowed && process.env.NODE_ENV !== 'production') {
            // In development, be more lenient if needed
            return callback(null, true);
        }
        if (!isAllowed) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../uploads');
try {
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        console.log('Created uploads directory');
    }
}
catch (err) {
    console.warn('Could not create uploads directory. This might be expected on some ephemeral filesystems.', err);
}
app.use('/uploads', (0, cors_1.default)(), express_1.default.static(uploadsDir));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/cars', car_routes_1.default);
app.use('/api/sellers', seller_routes_1.default);
app.use('/api/offers', offer_routes_1.default);
app.use('/api/buyers', buyer_routes_1.default);
app.use('/api/messages', message_routes_1.default);
app.use('/api/wallet', wallet_routes_1.default);
app.use('/api/inspections', inspection_routes_1.default);
app.use('/api/saved-cars', savedCar_routes_1.default);
app.use('/api/view-history', viewHistory_routes_1.default);
app.use('/api/support', support_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Huce Autos API', status: 'Running' });
});
// Health Check
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check database connection
        yield prisma.$queryRaw `SELECT 1`;
        res.json({
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development'
        });
    }
    catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            status: 'Error',
            database: 'Disconnected',
            error: error.message,
            suggestion: 'Check if DATABASE_URL is correctly set and database is reachable.'
        });
    }
}));
// Start Server
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} (bound to 0.0.0.0)`);
});
// Handle shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    process.exit();
}));
