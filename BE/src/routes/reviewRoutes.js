import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { addReview, listProductReviews } from '../controllers/reviewController.js';

const router = Router();

router.get('/product/:productId', listProductReviews);
router.post('/', requireAuth, addReview);

export default router;
