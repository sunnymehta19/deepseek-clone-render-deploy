import express from "express"
import { login, logOut, signup, authenticate } from "../../controllers/auth/authController.js";
import authMiddleware from "../../middlewares/authMiddleware.js"
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logOut);
router.get("/checkauth", authMiddleware, authenticate);

export default router;



