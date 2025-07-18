import { Router } from 'express';
import { signup, signin, checkAuth } from '../controllers/authController';
import { protectRoute } from '../middleware/authMiddleware';
import {
  addContent,
  deleteContent,
  getAllTags,
  getContent,
  getSharedContent,
  shareContent,
} from '../controllers/crudControllers';
import upload from '../config/multer';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/addContent', protectRoute, upload.single('pdf'), addContent);
router.delete('/delete/:id', protectRoute, deleteContent);
router.get('/content', protectRoute, getContent);
router.get('/tags', protectRoute, getAllTags);
router.post('/share', protectRoute, shareContent);
router.get('/brain/shared/:shareLink', getSharedContent);
router.get('/check', protectRoute, checkAuth);

export default router;
