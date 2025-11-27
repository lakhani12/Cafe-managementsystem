import createError from 'http-errors';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import { mapImagesToAbsolute } from '../utils/url.js';

const populateOrderItems = (query) =>
  query.populate({
    path: 'items.product',
    select: 'title description images price category',
  });

const formatOrder = (orderDoc, req) => {
  if (!orderDoc) return orderDoc;
  const order = orderDoc.toObject({ virtuals: true });
  order.items = order.items.map((item) => ({
    ...item,
    product: item.product
      ? {
          ...item.product,
          images: mapImagesToAbsolute(req, item.product.images),
        }
      : item.product,
  }));
  return order;
};

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
    const freshOrder = await populateOrderItems(
      Order.findById(order._id).populate('user', 'name email')
    );
    res.status(201).json({ success: true, order: formatOrder(await freshOrder, req) });
  } catch (err) {
    next(err);
  }
};

export const listMyOrders = async (req, res, next) => {
  try {
    const orders = await populateOrderItems(
      Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    );
    const formatted = (await orders).map((o) => formatOrder(o, req));
    res.json({ success: true, orders: formatted });
  } catch (err) {
    next(err);
  }
};

export const listAllOrders = async (req, res, next) => {
  try {
    const orders = await populateOrderItems(
      Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    );
    const formatted = (await orders).map((o) => formatOrder(o, req));
    res.json({ success: true, orders: formatted });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await populateOrderItems(
      Order.findByIdAndUpdate(id, { status }, { new: true }).populate('user', 'name email')
    );
    if (!order) throw createError(404, 'Order not found');
    res.json({ success: true, order: formatOrder(await order, req) });
  } catch (err) {
    next(err);
  }
};
