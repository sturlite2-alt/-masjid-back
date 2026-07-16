import { Announcement } from '../models/Announcement';
import { IAnnouncement } from '../types';
import { BaseRepository } from './BaseRepository';

export class AnnouncementRepository extends BaseRepository<IAnnouncement> {
  constructor() {
    super(Announcement);
  }

  async findActive(currentDate: Date): Promise<IAnnouncement[]> {
    return this.model.find({
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: currentDate } },
      ],
    })
    .sort({ pinned: -1, order: 1, createdAt: -1 })
    .exec();
  }
}
