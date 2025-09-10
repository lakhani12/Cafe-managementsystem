import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import createError from "http-errors";

import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// CORS setup
const envOrigin = process.env.CLIENT_URL;
const defaultOrigins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	"http://localhost:5173",
	"http://127.0.0.1:5173",
	"http://localhost:5174",
	"http://127.0.0.1:5174",
];
const allowedOrigins = envOrigin ? [envOrigin, ...defaultOrigins] : defaultOrigins;

app.use(
	cors({
		origin(origin, callback) {
			// Allow non-browser requests (no origin) and allowed list
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) return callback(null, true);
			return callback(new Error(`CORS: Origin not allowed: ${origin}`));
		},
		credentials: true,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		optionsSuccessStatus: 204,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1", router);

app.use((req, res, next) => {
	next(createError(404, "Route not found"));
});

app.use(errorHandler);

export default app;


