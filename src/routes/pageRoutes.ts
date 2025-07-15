import { Router } from "express";
import { signup ,signin, checkAuth} from "../controllers/authController";
import { protectRoute } from "../middleware/authMiddleware";
import { addContent } from "../controllers/crudControllers";

const router = Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/addContent',protectRoute,addContent)
router.get("/check", protectRoute , checkAuth)

export default router;