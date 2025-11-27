import createError from 'http-errors';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { mapImagesToAbsolute } from '../utils/url.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const populateCart = async (cart) => {
  if (!cart) return cart;
  await cart.populate({
    path: 'items.product',
    select: 'title description images price category active',
  });
  return cart;
};

const formatCartResponse = (cartDoc, req) => {
  if (!cartDoc) return cartDoc;
  const cart = cartDoc.toObject({ virtuals: true });
  cart.items = cart.items.map((item) => ({
    ...item,
    product: item.product
      ? {
          ...item.product,
          images: mapImagesToAbsolute(req, item.product.images),
        }
      : item.product,
  }));
  return cart;
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    await populateCart(cart);
    res.json({ success: true, cart: formatCartResponse(cart, req) });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) throw createError(404, 'Product not found');
    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) existing.quantity += quantity || 1;
    else cart.items.push({ product: product._id, quantity: quantity || 1, price: product.price });
    cart.recalculate();
    await cart.save();
    await populateCart(cart);
    res.status(201).json({ success: true, cart: formatCartResponse(cart, req) });
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (!item) throw createError(404, 'Item not found');
    item.quantity = quantity;
    cart.recalculate();
    await cart.save();
    await populateCart(cart);
    res.json({ success: true, cart: formatCartResponse(cart, req) });
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req.user._id);
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex === -1) throw createError(404, 'Item not found');
    cart.items.splice(itemIndex, 1);
    cart.recalculate();
    await cart.save();
    await populateCart(cart);
    res.json({ success: true, cart: formatCartResponse(cart, req) });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.recalculate();
    await cart.save();
    await populateCart(cart);
    res.json({ success: true, cart: formatCartResponse(cart, req) });
  } catch (err) {
    next(err);
  }
};
