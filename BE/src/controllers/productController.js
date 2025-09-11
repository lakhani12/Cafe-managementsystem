import createError from "http-errors";
import { Product } from "../models/Product.js";
import { mapImagesToAbsolute } from "../utils/url.js";

export const createProduct = async (req, res, next) => {
	try {
		const product = await Product.create(req.body);
		res.status(201).json({ success: true, product });
	} catch (err) {
		next(err);
	}
};

export const listProducts = async (req, res, next) => {
	try {
		const { q } = req.query;
		const filter = q ? { title: { $regex: q, $options: "i" } } : {};
		const products = await Product.find(filter).sort({ createdAt: -1 });
		const productsWithAbsolute = products.map((p) => ({
			...p.toObject(),
			images: mapImagesToAbsolute(req, p.images),
		}));
		res.json({ success: true, products: productsWithAbsolute });
	} catch (err) {
		next(err);
	}
};

export const getProduct = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) throw createError(404, "Product not found");
		const productObj = product.toObject();
		productObj.images = mapImagesToAbsolute(req, productObj.images);
		res.json({ success: true, product: productObj });
	} catch (err) {
		next(err);
	}
};

export const updateProduct = async (req, res, next) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!product) throw createError(404, "Product not found");
		res.json({ success: true, product });
	} catch (err) {
		next(err);
	}
};

export const deleteProduct = async (req, res, next) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) throw createError(404, "Product not found");
		res.json({ success: true });
	} catch (err) {
		next(err);
	}
};


