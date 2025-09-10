import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController.js";

const router = Router();

router.use(requireAuth);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/item/:itemId", updateCartItem);
router.delete("/item/:itemId", removeCartItem);
router.delete("/clear", clearCart);

export default router;


