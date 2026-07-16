import { Request, Response, NextFunction } from 'express';
import { ArabicClassRepository } from '../repositories/ArabicClassRepository';

const classRepository = new ArabicClassRepository();

export const getAllClasses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classes = await classRepository.find({});
    // Sort by order ascending, then by newest first
    classes.sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, videoUrl, images, order } = req.body;
    if (!title || !description) {
      res.status(400).json({ message: 'Title and description are required' });
      return;
    }

    const created = await classRepository.create({
      title,
      description,
      videoUrl,
      images: images || [],
      order: order || 0,
    } as any);

    res.status(201).json({ message: 'Class post created successfully', arabicClass: created });
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updated = await classRepository.update(id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Class post not found' });
      return;
    }
    res.json({ message: 'Class post updated successfully', arabicClass: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const deleted = await classRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Class post not found' });
      return;
    }
    res.json({ message: 'Class post deleted successfully', arabicClass: deleted });
  } catch (error) {
    next(error);
  }
};
