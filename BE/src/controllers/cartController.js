import createError from "http-errors";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

const getOrCreateCart = async (userId) => {
	let cart = await Cart.findOne({ user: userId });
	if (!cart) cart = await Cart.create({ user: userId, items: [] });
	return cart;
};

export const getCart = async (req, res, next) => {
	try {
		const cart = await getOrCreateCart(req.user._id);
		res.json({ success: true, cart });
	} catch (err) {
		next(err);
	}
};

export const addToCart = async (req, res, next) => {
	try {
		const { productId, quantity } = req.body;
		const product = await Product.findById(productId);
		if (!product) throw createError(404, "Product not found");
		const cart = await getOrCreateCart(req.user._id);
		const existing = cart.items.find((i) => i.product.toString() === productId);
		if (existing) existing.quantity += quantity || 1;
		else cart.items.push({ product: product._id, quantity: quantity || 1, price: product.price });
		cart.recalculate();
		await cart.save();
		res.status(201).json({ success: true, cart });
	} catch (err) {
		next(err);
	}
};

export const updateCartItem = async (req, res, next) => {
	try {
		const { itemId } = req.params;
		const { quantity } = req.body;
		const cart = await getOrCreateCart(req.user._id);
		const item = cart.items.id(itemId);
		if (!item) throw createError(404, "Item not found");
		item.quantity = quantity;
		cart.recalculate();
		await cart.save();
		res.json({ success: true, cart });
	} catch (err) {
		next(err);
	}
};

export const removeCartItem = async (req, res, next) => {
	try {
		const { itemId } = req.params;
		const cart = await getOrCreateCart(req.user._id);
		const item = cart.items.id(itemId);
		if (!item) throw createError(404, "Item not found");
		item.remove();
		cart.recalculate();
		await cart.save();
		res.json({ success: true, cart });
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
		res.json({ success: true, cart });
	} catch (err) {
		next(err);
	}
};


