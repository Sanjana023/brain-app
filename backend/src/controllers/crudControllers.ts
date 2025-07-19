import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { contentModel } from '../models/content';
import { TagModel } from '../models/tagModel';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { LinkModel } from '../models/linkModel';
import { random } from '../utils';
import user from '../models/user';
dotenv.config();

async function getOrCreateTags(tagTitles: string[]): Promise<string[]> {
  const tagIds: string[] = [];

  for (const title of tagTitles) {
    let tag = await TagModel.findOne({ title });

    if (!tag) {
      tag = await TagModel.create({ title });
    }

    tagIds.push(tag._id.toString());
  }

  return tagIds;
}

// getting all tags for frontend
export const getAllTags = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tags = await TagModel.find().sort({ title: 1 });
    res.status(200).json({ tags });
  } catch (error) {
    console.log('Error in getAllTags controller', error);
    return res.status(500).json({ message: 'Failed to fetch tags' });
  }
};
export const addContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, contentType } = req.body;
    let tags = req.body.tags;
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags); // Case: stringified JSON array (from FormData)
        if (Array.isArray(parsed)) {
          tags = parsed;
        } else {
          // Case: comma-separated string like "tag1, tag2"
          tags = tags
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);
        }
      } catch {
        // Case: raw string like "tag1, tag2"
        tags = tags
          .split(',')
          .map((t: string) => t.trim().toLowerCase())
          .filter(Boolean);
      }
    } else if (Array.isArray(tags)) {
      // Normalize all values to lowercase strings
      tags = tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
    } else {
      return res
        .status(400)
        .json({ message: 'Tags must be a string or an array' });
    }
    if (!title || !contentType) {
      return res
        .status(400)
        .json({ message: 'Title and contentType are required' });
    }

    if (!['pdf', 'link'].includes(contentType)) {
      return res.status(400).json({ message: 'Invalid contentType' });
    }

    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let link = '';
    let fileName = '';
    let fileSize = 0;

    if (contentType === 'pdf') {
      if (!req.file) {
        return res.status(400).json({ message: 'PDF file is required' });
      }
      link = req.file.path;
      fileName = req.file.originalname;
      fileSize = req.file.size;
    } else if (contentType === 'link') {
      link = req.body.link;
      if (!link) {
        return res
          .status(400)
          .json({ message: 'Link is required when contentType is "link"' });
      }
    }

    // Parse and normalize tags
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        return res.status(400).json({ message: 'Tags must be a JSON array' });
      }
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }

    const tagIds = await getOrCreateTags(tags);

    const newContent = new contentModel({
      userId: user._id,
      title,
      contentType,
      tags: tagIds,
      link,
      fileName: contentType === 'pdf' ? fileName : undefined,
      fileSize: contentType === 'pdf' ? fileSize : undefined,
    });

    await newContent.save();
    await newContent.populate('tags');
    return res
      .status(200)
      .json({ message: 'Content added successfully', content: newContent });
  } catch (error) {
    console.error('Error in addContent:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;

    const contents = await contentModel
      .find({ userId: user._id })
      .populate('tags');

    return res.status(200).json({ contents });
  } catch (error) {
    console.log('Error in getContent handler', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteContent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const contentId = req.params.id;
  const user = req.user;

  const content = await contentModel.findById(contentId);
  try {
    if (!content) {
      return res.status(404).json({ message: 'No content found' });
    }

    // If it's a PDF, delete from Cloudinary
    if (content.contentType === 'pdf' && content.link) {
      // Extract public_id from Cloudinary URL
      const publicId = (content.link as string)
        .split('/')
        .slice(-2)
        .join('/')
        .replace('.pdf', '');

      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    await contentModel.deleteOne({ _id: contentId });
    return res.status(200).json({ message: 'Content deleted successfully!' });
  } catch (error) {
    console.log('Error in deleteContent controller', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//creating a shareable link
export const shareContent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const share = req.body.share;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (share) {
      const hash = random(10);

      // Delete existing share link if any (to regenerate new one)
      await LinkModel.findOneAndDelete({ userId });

      const newLink = await LinkModel.create({
        userId,
        hash,
      });

      const BASE_URL = process.env.BASE_URL;
      const link = `${process.env.FRONTEND_BASE_URL}/api/v1/brain/shared/${newLink.hash}`;

      return res.status(200).json({
        message: 'Shared link created',
        link,
      });
    } else {
      //if user wants to delete the shared link
      await LinkModel.deleteOne({ userId });
      return res.status(200).json({
        message: 'Shared link removed',
      });
    }
  } catch (error) {
    console.error('Error in shareContent controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//Fetch another user's shared brain content
export const getSharedContent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({ hash });
    if (!link) {
      return res.status(404).json({ message: 'Incorrect link' });
    }

    const content = await contentModel
      .find({ userId: link.userId })
      .populate('tags');

    const User = await user.findById(link.userId).select('username');

    if (!content || content.length == 0) {
      return res.status(404).json({ message: 'No content found!' });
    }
    return res.status(200).json({
      content,
      username: User?.username || 'someone',
    });
  } catch (error) {
    console.error('Error in getSharedContent controller:', error);
    return res.status(500).json({ message: 'Internal server error!' });
  }
};
