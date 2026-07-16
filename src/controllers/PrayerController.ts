import { Request, Response, NextFunction } from 'express';
import { PrayerTimingRepository } from '../repositories/PrayerTimingRepository';
import { parseExcelTimings } from '../utils/excelParser';

const prayerRepository = new PrayerTimingRepository();

export const getTimingsByDate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const date = req.query.date as string;
    if (!date) {
      res.status(400).json({ message: 'Date parameter is required (format: YYYY-MM-DD)' });
      return;
    }

    const timing = await prayerRepository.findByDate(date);
    if (!timing) {
      res.status(404).json({ message: `No prayer timings found for date ${date}` });
      return;
    }

    res.json(timing);
  } catch (error) {
    next(error);
  }
};

export const getTodayTiming = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clientDate = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const timing = await prayerRepository.findByDate(clientDate);
    
    if (!timing) {
      const fallback = await prayerRepository.findOne({});
      if (!fallback) {
        res.status(404).json({ message: 'No timings available in the database' });
        return;
      }
      res.json(fallback);
      return;
    }
    
    res.json(timing);
  } catch (error) {
    next(error);
  }
};

export const getAllTimings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const timings = await prayerRepository.find();
    timings.sort((a, b) => a.date.localeCompare(b.date));
    res.json(timings);
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateTiming = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = req.body;
    if (!record.date) {
      res.status(400).json({ message: 'Date is required' });
      return;
    }

    const existing = await prayerRepository.findByDate(record.date);
    if (existing) {
      const updated = await prayerRepository.update(existing._id.toString(), record);
      res.json({ message: 'Timing updated successfully', timing: updated });
    } else {
      const created = await prayerRepository.create(record);
      res.status(201).json({ message: 'Timing created successfully', timing: created });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteTiming = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const deleted = await prayerRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Timing not found' });
      return;
    }
    res.json({ message: 'Timing deleted successfully', timing: deleted });
  } catch (error) {
    next(error);
  }
};

export const bulkImportTimings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Excel spreadsheet file is required' });
      return;
    }

    const parsedRecords = parseExcelTimings(req.file.buffer);
    if (parsedRecords.length === 0) {
      res.status(400).json({ message: 'No valid records found in the uploaded file' });
      return;
    }

    await prayerRepository.upsertMany(parsedRecords);

    res.json({
      message: `Successfully imported ${parsedRecords.length} timing records.`,
      recordsCount: parsedRecords.length,
    });
  } catch (error) {
    next(error);
  }
};
