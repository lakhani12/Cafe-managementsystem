import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);

router.post("/", requireAuth, requireRole("admin"), createProduct);
router.put("/:id", requireAuth, requireRole("admin"), updateProduct);
router.delete("/:id", requireAuth, requireRole("admin"), deleteProduct);

export default router;


