import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { contentModel } from '../models/content';

export const addContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { link, contentType, title, tags, fileName, fileSize } = req.body;

    if (!link || !contentType || !title) {
      return res
        .status(400)
        .json({ message: 'Link, contentType, and title are required' });
    }

    if (!['pdf', 'link'].includes(contentType)) {
      return res.status(400).json({ message: 'Invalid contentType' });
    }

    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const newContent = new contentModel({
      link,
      contentType,
      title,
      tags,
      userId: user._id,
      fileName: contentType == 'pdf' ? fileName : undefined,
      fileSize: contentType == 'pdf' ? fileSize : undefined,
    });

    await newContent.save();
    return res.status(200).json({ message: 'Content added' });
  } catch (error) {
    console.log('Error in addContent controller');
    return res.status(500).json({ message: 'Internal server error' });
  }
};
