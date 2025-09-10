import mongoose from "mongoose";

export const connectDatabase = async (mongoUri) => {
	const connectionString = mongoUri || process.env.MONGO_URI;
	if (!connectionString) {
		throw new Error("MONGO_URI is not defined");
	}
	mongoose.set("strictQuery", true);
	await mongoose.connect(connectionString, {
		// Options can be specified here if needed
	});
	// eslint-disable-next-line no-console
	console.log("MongoDB connected");
};


