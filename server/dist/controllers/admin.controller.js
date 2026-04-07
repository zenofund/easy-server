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
exports.createAdminUser = exports.sendUserMessage = exports.updateUser = exports.updateUserStatus = exports.getAdminUserDetails = exports.getAdminUsers = exports.getAdminFinanceSummary = exports.getAdminStats = exports.testSMTPDeliverability = exports.updateSystemConfig = exports.getSystemConfig = void 0;
const client_1 = require("@prisma/client");
const notifications_1 = require("../utils/notifications");
const prisma = new client_1.PrismaClient();
const getSystemConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const configs = yield prisma.systemConfig.findMany();
        const configMap = {};
        configs.forEach(c => {
            configMap[c.key] = c.value;
        });
        res.json(configMap);
    }
    catch (error) {
        console.error('Error fetching system config:', error);
        res.status(500).json({ error: 'Failed to fetch system configuration' });
    }
});
exports.getSystemConfig = getSystemConfig;
const updateSystemConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { configs } = req.body; // Expecting an object of key-value pairs
        const updatePromises = Object.entries(configs).map(([key, value]) => {
            return prisma.systemConfig.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        });
        yield Promise.all(updatePromises);
        res.json({ message: 'Configuration updated successfully' });
    }
    catch (error) {
        console.error('Error updating system config:', error);
        res.status(500).json({ error: 'Failed to update system configuration' });
    }
});
exports.updateSystemConfig = updateSystemConfig;
const testSMTPDeliverability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const subject = "SMTP Test Deliverability - Huce Automarts";
        const body = `This is a test email from Huce Automarts to verify your SMTP configuration. 
    If you received this, your email settings are working correctly.
    
    Timestamp: ${new Date().toISOString()}`;
        const result = yield (0, notifications_1.sendEmail)(email, subject, body);
        if (result.success) {
            res.json({ message: 'Test email sent successfully' });
        }
        else {
            res.status(500).json({
                error: 'Failed to send test email. Check your SMTP settings.',
                details: result.error
            });
        }
    }
    catch (error) {
        console.error('Error testing SMTP:', error);
        res.status(500).json({ error: 'Failed to test SMTP deliverability', details: error.message });
    }
});
exports.testSMTPDeliverability = testSMTPDeliverability;
const getAdminStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const { year, period } = req.query;
        const week = period; // Alias for backward compatibility in logic
        const now = new Date();
        // Revenue Year Logic
        const targetYear = year ? parseInt(year, 10) : now.getFullYear();
        const startOfYear = new Date(targetYear, 0, 1);
        const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);
        const startOfPrevYear = new Date(targetYear - 1, 0, 1);
        const endOfPrevYear = new Date(targetYear - 1, 11, 31, 23, 59, 59, 999);
        // Listings Period Logic
        let startOfPeriod = new Date(now);
        let endOfPeriod = new Date(now);
        let startOfPrevPeriod = new Date(now);
        let endOfPrevPeriod = new Date(now);
        if (week === 'Last Month') {
            // Current selected period: Last Month
            startOfPeriod = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endOfPeriod = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            // Previous period for comparison: Month before last
            startOfPrevPeriod = new Date(now.getFullYear(), now.getMonth() - 2, 1);
            endOfPrevPeriod = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
        }
        else if (week === 'Last Week') {
            // Current selected period: Last Week
            startOfPeriod.setDate(now.getDate() - now.getDay() - 7);
            startOfPeriod.setHours(0, 0, 0, 0);
            endOfPeriod = new Date(startOfPeriod);
            endOfPeriod.setDate(endOfPeriod.getDate() + 6);
            endOfPeriod.setHours(23, 59, 59, 999);
            // Previous period: Week before last
            startOfPrevPeriod = new Date(startOfPeriod);
            startOfPrevPeriod.setDate(startOfPrevPeriod.getDate() - 7);
            endOfPrevPeriod = new Date(startOfPrevPeriod);
            endOfPrevPeriod.setDate(endOfPrevPeriod.getDate() + 6);
            endOfPrevPeriod.setHours(23, 59, 59, 999);
        }
        else {
            // Default: This Week
            startOfPeriod.setDate(now.getDate() - now.getDay());
            startOfPeriod.setHours(0, 0, 0, 0);
            endOfPeriod = new Date(startOfPeriod);
            endOfPeriod.setDate(endOfPeriod.getDate() + 6);
            endOfPeriod.setHours(23, 59, 59, 999);
            // Previous period: Last Week
            startOfPrevPeriod = new Date(startOfPeriod);
            startOfPrevPeriod.setDate(startOfPrevPeriod.getDate() - 7);
            endOfPrevPeriod = new Date(startOfPrevPeriod);
            endOfPrevPeriod.setDate(endOfPrevPeriod.getDate() + 6);
            endOfPrevPeriod.setHours(23, 59, 59, 999);
        }
        const [userCounts, listingCounts, ticketCounts, totalRevenueResult, periodRevenueResult, prevPeriodRevenueResult, periodListingsResult, prevPeriodListingsResult, pendingInspections, recentTransactions, monthlyRevenue, weeklyListings, bestSellers] = yield Promise.all([
            // 1. User counts
            prisma.user.groupBy({ by: ['role'], _count: true }),
            // 2. Listing counts
            prisma.car.groupBy({ by: ['status'], _count: true }),
            // 3. Ticket counts
            prisma.supportTicket.groupBy({ by: ['status'], _count: true }),
            // 4. Total revenue
            prisma.transaction.aggregate({
                where: { status: client_1.TransactionStatus.SUCCESS },
                _sum: { amount: true }
            }),
            // 5. Period revenue
            prisma.transaction.aggregate({
                where: {
                    status: client_1.TransactionStatus.SUCCESS,
                    createdAt: { gte: startOfYear, lte: endOfYear }
                },
                _sum: { amount: true }
            }),
            // 6. Previous period revenue
            prisma.transaction.aggregate({
                where: {
                    status: client_1.TransactionStatus.SUCCESS,
                    createdAt: { gte: startOfPrevYear, lte: endOfPrevYear }
                },
                _sum: { amount: true }
            }),
            // 7. Period listings
            prisma.car.count({
                where: { createdAt: { gte: startOfPeriod, lte: endOfPeriod } }
            }),
            // 8. Previous period listings
            prisma.car.count({
                where: { createdAt: { gte: startOfPrevPeriod, lte: endOfPrevPeriod } }
            }),
            // 9. Pending inspections
            prisma.inspection.count({ where: { status: client_1.InspectionStatus.REQUESTED } }),
            // 10. Recent transactions
            prisma.transaction.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            // 11. Monthly revenue
            prisma.transaction.findMany({
                where: {
                    status: client_1.TransactionStatus.SUCCESS,
                    createdAt: { gte: startOfYear, lte: endOfYear }
                },
                select: {
                    amount: true,
                    createdAt: true
                }
            }),
            // 12. Period listings (for chart)
            prisma.car.findMany({
                where: { createdAt: { gte: startOfPeriod, lte: endOfPeriod } },
                select: {
                    createdAt: true
                }
            }),
            // 13. Best Sellers
            prisma.user.findMany({
                where: { role: client_1.Role.SELLER },
                take: 5,
                include: {
                    cars: { where: { status: client_1.CarStatus.SOLD } },
                    _count: {
                        select: {
                            cars: true,
                            offersReceived: { where: { status: client_1.OfferStatus.ACCEPTED } }
                        }
                    }
                },
            })
        ]);
        // Calculate percentage changes
        const calcChange = (current, previous) => {
            if (previous === 0)
                return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };
        const revenueChange = calcChange(Number(periodRevenueResult._sum.amount || 0), Number(prevPeriodRevenueResult._sum.amount || 0));
        const listingsChange = calcChange(periodListingsResult, prevPeriodListingsResult);
        // Process monthly revenue data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueByMonth = months.map((month, index) => {
            const total = monthlyRevenue
                .filter(r => new Date(r.createdAt).getMonth() === index)
                .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            return { month, total };
        });
        // Process period listings data for chart
        let listingsChartData;
        if (week === 'Last Month') {
            const daysInMonth = new Date(startOfPeriod.getFullYear(), startOfPeriod.getMonth() + 1, 0).getDate();
            listingsChartData = Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const count = weeklyListings
                    .filter(l => new Date(l.createdAt).getDate() === day)
                    .length;
                return { label: day.toString(), count };
            });
        }
        else {
            const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            listingsChartData = days.map((day, index) => {
                const count = weeklyListings
                    .filter(l => new Date(l.createdAt).getDay() === index)
                    .length;
                return { label: day, count };
            });
        }
        // Process best sellers
        const bestSellersWithEarnings = yield Promise.all(bestSellers.map((seller) => __awaiter(void 0, void 0, void 0, function* () {
            const earnings = yield prisma.transaction.aggregate({
                where: {
                    userId: seller.id,
                    status: client_1.TransactionStatus.SUCCESS,
                    type: 'SALE'
                },
                _sum: { amount: true }
            });
            const unsold = yield prisma.car.count({
                where: {
                    sellerId: seller.id,
                    status: client_1.CarStatus.AVAILABLE
                }
            });
            const offers = yield prisma.offer.count({
                where: { sellerId: seller.id }
            });
            return {
                id: seller.id,
                name: `${seller.firstName} ${seller.lastName}`,
                avatar: seller.avatar,
                sold: seller.cars.length,
                unsold,
                offers,
                earnings: earnings._sum.amount || 0
            };
        })));
        const users = {
            total: userCounts.reduce((acc, curr) => acc + curr._count, 0),
            buyers: ((_a = userCounts.find(u => u.role === client_1.Role.BUYER)) === null || _a === void 0 ? void 0 : _a._count) || 0,
            sellers: ((_b = userCounts.find(u => u.role === client_1.Role.SELLER)) === null || _b === void 0 ? void 0 : _b._count) || 0,
            inspectors: ((_c = userCounts.find(u => u.role === client_1.Role.INSPECTOR)) === null || _c === void 0 ? void 0 : _c._count) || 0,
        };
        const listings = {
            total: listingCounts.reduce((acc, curr) => acc + curr._count, 0),
            active: ((_d = listingCounts.find(l => l.status === client_1.CarStatus.AVAILABLE)) === null || _d === void 0 ? void 0 : _d._count) || 0,
            sold: ((_e = listingCounts.find(l => l.status === client_1.CarStatus.SOLD)) === null || _e === void 0 ? void 0 : _e._count) || 0,
            pending: ((_f = listingCounts.find(l => l.status === client_1.CarStatus.PENDING)) === null || _f === void 0 ? void 0 : _f._count) || 0,
        };
        const tickets = {
            total: ticketCounts.reduce((acc, curr) => acc + curr._count, 0),
            resolved: ((_g = ticketCounts.find(t => t.status === 'RESOLVED')) === null || _g === void 0 ? void 0 : _g._count) || 0,
            unresolved: ((_h = ticketCounts.find(t => t.status === 'OPEN')) === null || _h === void 0 ? void 0 : _h._count) || 0,
        };
        res.json({
            users,
            listings,
            tickets,
            revenue: totalRevenueResult._sum.amount || 0,
            periodRevenue: periodRevenueResult._sum.amount || 0,
            revenueChange,
            periodListings: periodListingsResult,
            listingsChange,
            pendingInspections,
            recentTransactions: recentTransactions.map(t => ({
                id: t.id,
                type: t.type,
                amount: t.amount,
                status: t.status,
                createdAt: t.createdAt,
                user: `${t.user.firstName} ${t.user.lastName}`
            })),
            revenueChart: revenueByMonth,
            listingsChart: listingsChartData,
            bestSellers: bestSellersWithEarnings
        });
    }
    catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Failed to fetch admin statistics' });
    }
});
exports.getAdminStats = getAdminStats;
const getAdminFinanceSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const yearParam = req.query.year ? Number(req.query.year) : now.getFullYear();
        const targetYear = Number.isFinite(yearParam) ? yearParam : now.getFullYear();
        const startOfMonth = new Date(targetYear, now.getMonth(), 1);
        const endOfMonth = new Date(targetYear, now.getMonth() + 1, 0, 23, 59, 59, 999);
        const startOfYear = new Date(targetYear, 0, 1);
        const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);
        const [totalRevenueResult, monthlyRevenueResult, typeTotals, monthlySaleResult, yearlyTransactions] = yield Promise.all([
            prisma.transaction.aggregate({
                where: { status: client_1.TransactionStatus.SUCCESS },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: {
                    status: client_1.TransactionStatus.SUCCESS,
                    createdAt: { gte: startOfMonth, lte: endOfMonth }
                },
                _sum: { amount: true }
            }),
            prisma.transaction.groupBy({
                by: ['type'],
                where: { status: client_1.TransactionStatus.SUCCESS },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: {
                    status: client_1.TransactionStatus.SUCCESS,
                    type: client_1.TransactionType.SALE,
                    createdAt: { gte: startOfMonth, lte: endOfMonth }
                },
                _sum: { amount: true }
            }),
            prisma.transaction.findMany({
                where: {
                    status: client_1.TransactionStatus.SUCCESS,
                    createdAt: { gte: startOfYear, lte: endOfYear }
                },
                select: {
                    amount: true,
                    createdAt: true
                }
            })
        ]);
        const typeTotalsMap = typeTotals.reduce((acc, item) => {
            acc[item.type] = Number(item._sum.amount || 0);
            return acc;
        }, {});
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueByMonth = months.map((month, index) => {
            const total = yearlyTransactions
                .filter(r => new Date(r.createdAt).getMonth() === index)
                .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            return { month, total };
        });
        res.json({
            totals: {
                totalRevenue: Number(totalRevenueResult._sum.amount || 0),
                monthlyRevenue: Number(monthlyRevenueResult._sum.amount || 0),
                subscriptionRevenue: typeTotalsMap[client_1.TransactionType.DEPOSIT] || 0,
                escrowFees: typeTotalsMap[client_1.TransactionType.PURCHASE] || 0,
                totalEarnings: typeTotalsMap[client_1.TransactionType.SALE] || 0,
                monthlyEarnings: Number(monthlySaleResult._sum.amount || 0),
                subscriptionEarnings: typeTotalsMap[client_1.TransactionType.INSPECTION_EARNING] || 0,
                escrowEarnings: typeTotalsMap[client_1.TransactionType.INSPECTION_FEE] || 0
            },
            revenueChart: revenueByMonth
        });
    }
    catch (error) {
        console.error('Error fetching admin finance summary:', error);
        res.status(500).json({ error: 'Failed to fetch finance summary' });
    }
});
exports.getAdminFinanceSummary = getAdminFinanceSummary;
const getAdminUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, status, search, page = '1', limit = '10' } = req.query;
        const p = parseInt(page, 10);
        const l = parseInt(limit, 10);
        const skip = (p - 1) * l;
        const where = {};
        if (role) {
            const roleUpper = role.toUpperCase();
            if (roleUpper === 'BUYERS')
                where.role = client_1.Role.BUYER;
            else if (roleUpper === 'SELLERS')
                where.role = client_1.Role.SELLER;
            else if (roleUpper === 'INSPECTOR')
                where.role = client_1.Role.INSPECTOR;
            else if (roleUpper === 'STAFF')
                where.role = client_1.Role.STAFF;
            else if (roleUpper === 'ADMIN')
                where.role = client_1.Role.ADMIN;
        }
        if (status && status !== 'All') {
            const normalizedStatus = status === 'Active' || status === 'ACTIVE'
                ? client_1.UserStatus.ACTIVE
                : status === 'Pending' || status === 'PENDING'
                    ? client_1.UserStatus.PENDING
                    : client_1.UserStatus.DEACTIVATED;
            where.status = normalizedStatus;
        }
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = yield Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    sellerProfile: true,
                    inspectorProfile: true,
                    _count: {
                        select: {
                            offersMade: true,
                            offersReceived: true,
                            transactions: { where: { status: client_1.TransactionStatus.SUCCESS } },
                            cars: true,
                            inspections: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: l
            }),
            prisma.user.count({ where })
        ]);
        const formattedUsers = users.map((user) => {
            var _a, _b;
            return ({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                businessName: ((_a = user.sellerProfile) === null || _a === void 0 ? void 0 : _a.companyName) || 'N/A',
                officeName: ((_b = user.inspectorProfile) === null || _b === void 0 ? void 0 : _b.officeName) || 'N/A',
                email: user.email,
                phone: user.phone || 'N/A',
                avatar: user.avatar,
                offersSubmitted: user.role === client_1.Role.BUYER ? user._count.offersMade : user._count.offersReceived,
                totalPurchases: user._count.transactions,
                totalListings: user._count.cars,
                totalInspections: user._count.inspections,
                registrationDate: new Date(user.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }).replace(/ /g, ' '),
                status: user.status
            });
        });
        res.json({
            users: formattedUsers,
            pagination: {
                total,
                page: p,
                limit: l,
                totalPages: Math.ceil(total / l)
            }
        });
    }
    catch (error) {
        console.error('Error fetching admin users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.getAdminUsers = getAdminUsers;
const getAdminUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const id = String(req.params.id);
        const user = yield prisma.user.findUnique({
            where: { id },
            include: {
                sellerProfile: true,
                inspectorProfile: true,
                _count: {
                    select: {
                        offersMade: true,
                        offersReceived: true,
                        transactions: { where: { status: client_1.TransactionStatus.SUCCESS } },
                        cars: true,
                        inspections: true,
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const u = user;
        const formattedUser = {
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            phone: u.phone || 'N/A',
            avatar: u.avatar,
            role: u.role,
            offersSubmitted: u.role === client_1.Role.BUYER ? ((_a = u._count) === null || _a === void 0 ? void 0 : _a.offersMade) || 0 : ((_b = u._count) === null || _b === void 0 ? void 0 : _b.offersReceived) || 0,
            totalPurchases: ((_c = u._count) === null || _c === void 0 ? void 0 : _c.transactions) || 0,
            registrationDate: new Date(u.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).replace(/ /g, ' '),
            status: user.status
        };
        res.json(formattedUser);
    }
    catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});
exports.getAdminUserDetails = getAdminUserDetails;
const updateUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const { status } = req.body;
        const existingUser = yield prisma.user.findUnique({
            where: { id },
            select: { role: true }
        });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const normalizedStatus = status === 'Active' || status === 'ACTIVE'
            ? client_1.UserStatus.ACTIVE
            : status === 'Pending' || status === 'PENDING'
                ? client_1.UserStatus.PENDING
                : client_1.UserStatus.DEACTIVATED;
        const isActive = normalizedStatus === 'ACTIVE';
        const [user] = yield prisma.$transaction([
            prisma.user.update({
                where: { id },
                data: { status: normalizedStatus }
            }),
            ...(existingUser.role === client_1.Role.SELLER
                ? [
                    prisma.sellerProfile.updateMany({
                        where: { userId: id },
                        data: { verified: isActive }
                    })
                ]
                : [])
        ]);
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});
exports.updateUserStatus = updateUserStatus;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const { firstName, lastName, email, phone } = req.body;
        const user = yield prisma.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phone
            }
        });
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});
exports.updateUser = updateUser;
const sendUserMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiverId = String(req.params.id);
        const { content } = req.body;
        const adminId = req.user.userId;
        const message = yield prisma.message.create({
            data: {
                senderId: adminId,
                receiverId,
                content,
            }
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.sendUserMessage = sendUserMessage;
const createAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if user exists
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash password
        const bcrypt = require('bcryptjs');
        const hashedPassword = yield bcrypt.hash(password, 10);
        // Create user
        const user = yield prisma.user.create({
            data: Object.assign(Object.assign(Object.assign({ firstName,
                lastName,
                email, password: hashedPassword, phone, role: role, verified: true, wallet: {
                    create: {
                        balance: 0,
                        currency: 'NGN',
                    },
                } }, (role === client_1.Role.SELLER && {
                sellerProfile: {
                    create: {
                        type: 'INDIVIDUAL',
                        address: 'N/A',
                    },
                },
            })), (role === client_1.Role.BUYER && {
                buyerProfile: {
                    create: {},
                },
            })), (role === client_1.Role.INSPECTOR && {
                inspectorProfile: {
                    create: {
                        officeName: 'Main Office',
                    },
                },
            })),
        });
        res.status(201).json({
            message: 'User created successfully',
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
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
});
exports.createAdminUser = createAdminUser;
