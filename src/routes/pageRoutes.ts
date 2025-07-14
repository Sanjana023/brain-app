import { Router } from "express";
import { signup ,signin, checkAuth} from "../controllers/authController";
import { protectRoute } from "../middleware/authMiddleware";

const router = Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.get("/check", protectRoute , checkAuth)

export default router;