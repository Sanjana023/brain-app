import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import dotenv from 'dotenv';
dotenv.config();

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;

    if (
      !username ||
      username.length < 3 ||
      username.length > 10 ||
      !/^[a-zA-Z\s]+$/.test(username)
    ) {
      res.status(400).json({ message: 'Invalid username' });
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ message: 'Invalid email' });
      return;
    }

    if (!password || password.length < 6) {
      res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists with this email' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new user({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User successfully created' });
  } catch (error) {
    console.log('Signup error', error);
    res.status(500).json('Internal server error');
    return;
  }
}

export async function signin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const existingUser = await user.findOne({ email });

    //if user does not exist with the email (checking password for type error)
    if (!existingUser || !existingUser.password) {
      res.status(404).json({
        message: 'User not found with the email or password is missing',
      });
      return;
    }

    //if user exists , match their password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    //if password does not match return response
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password!' });
      return;
    }

    //if password matches, generate token
    const token = jwt.sign(
      { userId: existingUser._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      message: 'User successfully signed in!',
      token,
    });
  } catch (error) {
    console.log('Error in signin controller');
    res.status(500).json('Internal server error!');
    return;
  }
}

export async function checkAuth(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated!' });
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Error in checkAuth:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
