import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, default: "" },
		category: { type: String, default: "general" },
		price: { type: Number, required: true, min: 0 },
		inStock: { type: Number, default: 0 },
		images: [{ type: String }],
		active: { type: Boolean, default: true }
	},
	{ timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);


