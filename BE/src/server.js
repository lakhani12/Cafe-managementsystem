import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDatabase();
		app.listen(PORT, () => {
			// eslint-disable-next-line no-console
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();


