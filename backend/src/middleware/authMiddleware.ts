import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import user from '../models/user';
dotenv.config();

interface DecodedToken {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .status(401)
        .json({ message: 'Unauthorized header - No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const dbUser = await (user as any).findById(decodedToken.userId).select('-password');

    if (!dbUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    req.user = dbUser;
    next();
  } catch (err: any) {
    console.error('Error in protectRoute middleware:', err.message);

    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ message: 'Token expired' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
