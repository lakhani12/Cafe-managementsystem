import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import {
  // User Management
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,

  // Order Management
  getAllOrders,
  getOrderById,
  updateOrderStatus,

  // Reports
  getDashboardStats,
  getSalesReport,

  // Product Management
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole('admin'));

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Order Management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// Reports
router.get('/dashboard', getDashboardStats);
router.get('/reports/sales', getSalesReport);

// Product Management (Admin specific)
router.get('/products', getAllProductsAdmin);
router.post('/products', createProductAdmin);
router.put('/products/:id', updateProductAdmin);
router.delete('/products/:id', deleteProductAdmin);

export default router;
