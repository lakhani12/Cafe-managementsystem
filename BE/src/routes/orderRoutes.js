import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import {
  createOrderFromCart,
  listMyOrders,
  listAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

router.post('/', requireAuth, createOrderFromCart);
router.get('/me', requireAuth, listMyOrders);
router.get('/', requireAuth, requireRole('admin'), listAllOrders);
router.put('/:id/status', requireAuth, requireRole('admin'), updateOrderStatus);

export default router;
