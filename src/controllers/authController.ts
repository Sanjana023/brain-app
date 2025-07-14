import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { signupSchema, signinSchema } from '../validations/authValidation';
import user from '../models/user';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import dotenv from 'dotenv';
dotenv.config();

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const parsedResult = signupSchema.safeParse(req.body);
    if (!parsedResult.success) {
      res.status(400).json({ errors: z.treeifyError(parsedResult.error) });
      return;
    }

    const { username, email, password } = parsedResult.data;

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
    const parsedResult = signinSchema.safeParse(req.body);
    if (!parsedResult.success) {
      res.status(400).json({ errors: z.treeifyError(parsedResult.error) });
      return;
    }

    const { email, password } = parsedResult.data;

    const existingUser = await user.findOne({ email });

    //if user does not exist with the email (checking password for type error)
    if (!existingUser || !existingUser.password) {
      res
        .status(404)
        .json({
          message: 'User not found with the email or password is missing',
        });
      return;
    }

    //if user exists , match their password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    //if password does not match return response
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password!' });
    }

    //if password matches, generate token
    const token = jwt.sign(
      { userId: existingUser._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

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
