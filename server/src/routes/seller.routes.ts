import { Router } from 'express';
import { getSellers, getSellerById, getSellerRevenue, updateSellerProfile, verifyIdentity } from '../controllers/seller.controller';
import { getActiveSubscriptionPlans, selectSellerSubscriptionPlan } from '../controllers/subscription.controller';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public/Seller routes
router.get('/subscription-plans', getActiveSubscriptionPlans);
router.post('/subscription/select', authenticateToken, selectSellerSubscriptionPlan);

router.post('/verify-identity', authenticateToken, upload.single('document'), verifyIdentity);

router.get('/', getSellers);
router.put('/profile', authenticateToken, updateSellerProfile);
router.get('/:id', optionalAuthenticateToken, getSellerById);
router.get('/:id/revenue', getSellerRevenue);

export default router;
