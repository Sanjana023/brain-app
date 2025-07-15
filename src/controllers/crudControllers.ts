import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { contentModel } from '../models/content';
import { TagModel } from '../models/tagModel';

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

export const addContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, contentType } = req.body;
    let tags = req.body.tags;

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
