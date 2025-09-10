import { Router } from "express";
import { body } from "express-validator";
import {
	register,
	login,
	createAdmin,
	adminLogin,
	forgotPassword,
	resetPassword,
} from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.post(
	"/register",
	[body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })],
	register
);

router.post("/login", [body("email").isEmail(), body("password").notEmpty()], login);

router.post(
	"/admin/create",
	requireAuth,
	requireRole("admin"),
	[body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })],
	createAdmin
);

router.post("/admin/login", [body("email").isEmail(), body("password").notEmpty()], adminLogin);

router.post("/forgot-password", [body("email").isEmail()], forgotPassword);
router.post("/reset-password", [body("token").notEmpty(), body("password").isLength({ min: 6 })], resetPassword);

export default router;


