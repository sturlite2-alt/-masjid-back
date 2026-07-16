import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

const generateToken = (id: string, email: string): string => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET || 'super_secret_jwt_key_masjid_firdouse_2026',
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Self-locking check: check if any admin exists
    const users = await userRepository.find();
    if (users.length > 0) {
      res.status(403).json({ message: 'Registration is closed. Admin user already exists.' });
      return;
    }

    const newUser = await userRepository.create({ email, password } as any);
    const token = generateToken(newUser._id.toString(), newUser.email);

    res.status(201).json({
      message: 'Admin account created successfully',
      token,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await userRepository.findByEmail(email);

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id.toString(), user.email);
      res.json({
        token,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userRepository.findById(req.user.id);
    if (user) {
      res.json({
        id: user._id,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};
