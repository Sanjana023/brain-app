import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { signupSchema } from '../validations/authValidation';
import user from '../models/user';
import { Request, Response } from 'express';
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
