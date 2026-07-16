import { Request, Response, NextFunction } from 'express';
import { HadithRepository } from '../repositories/HadithRepository';

const hadithRepository = new HadithRepository();

export const getActiveHadith = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const activeHadith = await hadithRepository.findActive();
    if (!activeHadith) {
      res.json({
        content: "The best among you are those who have the best manners and character.",
        source: "Sahih al-Bukhari",
        active: true,
      });
      return;
    }
    res.json(activeHadith);
  } catch (error) {
    next(error);
  }
};

export const getAllHadiths = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hadiths = await hadithRepository.find({});
    hadiths.sort((a, b) => {
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    res.json(hadiths);
  } catch (error) {
    next(error);
  }
};

export const createHadith = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content, source, active } = req.body;
    if (!content) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }

    const created = await hadithRepository.create({ content, source, active: active || false } as any);
    res.status(201).json({ message: 'Hadith created successfully', hadith: created });
  } catch (error) {
    next(error);
  }
};

export const updateHadith = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updated = await hadithRepository.update(id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Hadith not found' });
      return;
    }
    res.json({ message: 'Hadith updated successfully', hadith: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteHadith = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const deleted = await hadithRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Hadith not found' });
      return;
    }
    res.json({ message: 'Hadith deleted successfully', hadith: deleted });
  } catch (error) {
    next(error);
  }
};

export const activateHadith = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const activated = await hadithRepository.activateHadith(id);
    if (!activated) {
      res.status(404).json({ message: 'Hadith not found' });
      return;
    }
    res.json({ message: 'Hadith activated successfully', hadith: activated });
  } catch (error) {
    next(error);
  }
};
