import createError from 'http-errors';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';

export const createOrderFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) throw createError(400, 'Cart is empty');
    const items = cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
      price: i.price,
    }));
    const subtotal = cart.subtotal;
    const total = subtotal; // Add taxes/fees here if needed
    const order = await Order.create({ user: req.user._id, items, subtotal, total });
    cart.items = [];
    cart.subtotal = 0;
    await cart.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

export const listAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) throw createError(404, 'Order not found');
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
