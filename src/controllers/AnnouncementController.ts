import { Request, Response, NextFunction } from 'express';
import { AnnouncementRepository } from '../repositories/AnnouncementRepository';

const announcementRepository = new AnnouncementRepository();

export const getActiveAnnouncements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date();
    const announcements = await announcementRepository.findActive(today);
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

export const getAllAnnouncements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const announcements = await announcementRepository.find();
    announcements.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, priority, pinned, expiryDate, order } = req.body;
    
    if (!title || !description) {
      res.status(400).json({ message: 'Title and description are required' });
      return;
    }

    const newAnnouncement = await announcementRepository.create({
      title,
      description,
      priority: priority || 'medium',
      pinned: pinned || false,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      order: order || 0,
    } as any);

    res.status(201).json({ message: 'Announcement created successfully', announcement: newAnnouncement });
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    if (updateData.expiryDate) {
      updateData.expiryDate = new Date(updateData.expiryDate);
    }

    const updated = await announcementRepository.update(id, updateData);
    if (!updated) {
      res.status(404).json({ message: 'Announcement not found' });
      return;
    }

    res.json({ message: 'Announcement updated successfully', announcement: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const deleted = await announcementRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Announcement not found' });
      return;
    }
    res.json({ message: 'Announcement deleted successfully', announcement: deleted });
  } catch (error) {
    next(error);
  }
};
