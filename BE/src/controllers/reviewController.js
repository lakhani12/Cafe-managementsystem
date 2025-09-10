import createError from "http-errors";
import { Review } from "../models/Review.js";

export const addReview = async (req, res, next) => {
	try {
		const { productId, rating, comment } = req.body;
		const review = await Review.create({ product: productId, user: req.user._id, rating, comment });
		res.status(201).json({ success: true, review });
	} catch (err) {
		if (err.code === 11000) return next(createError(400, "You already reviewed this product"));
		next(err);
	}
};

export const listProductReviews = async (req, res, next) => {
	try {
		const { productId } = req.params;
		const reviews = await Review.find({ product: productId }).populate("user", "name").sort({ createdAt: -1 });
		res.json({ success: true, reviews });
	} catch (err) {
		next(err);
	}
};


