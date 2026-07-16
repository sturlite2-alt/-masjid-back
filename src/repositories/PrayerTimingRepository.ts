import { PrayerTiming } from '../models/PrayerTiming';
import { IPrayerTiming } from '../types';
import { BaseRepository } from './BaseRepository';

export class PrayerTimingRepository extends BaseRepository<IPrayerTiming> {
  constructor() {
    super(PrayerTiming);
  }

  async findByDate(date: string): Promise<IPrayerTiming | null> {
    return this.model.findOne({ date }).exec();
  }

  async upsertMany(records: Partial<IPrayerTiming>[]): Promise<void> {
    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: { date: record.date },
        update: { $set: record },
        upsert: true,
      },
    }));
    await this.model.bulkWrite(bulkOps);
  }
}
