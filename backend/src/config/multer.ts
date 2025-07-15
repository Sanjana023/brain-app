import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: 'pdfs',
    resource_type: 'raw',
    format: 'pdf',
    public_id: file.originalname.split('.')[0],
  }),
});

const upload = multer({ storage });
export default upload;
