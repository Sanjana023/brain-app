import { Router } from "express";
import { signup ,signin, checkAuth} from "../controllers/authController";
import { protectRoute } from "../middleware/authMiddleware";
import { addContent, getContent } from "../controllers/crudControllers";
import upload from "../config/multer";

const router = Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/addContent',protectRoute,upload.single('pdf'),addContent);
router.get('/content',protectRoute,getContent)
router.get("/check", protectRoute , checkAuth)

export default router;