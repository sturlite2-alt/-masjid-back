import { Charity } from '../models/Charity';
import { ICharity } from '../types';
import { BaseRepository } from './BaseRepository';

export class CharityRepository extends BaseRepository<ICharity> {
  constructor() {
    super(Charity);
  }

  async findCurrent(): Promise<ICharity | null> {
    return this.model.findOne().exec();
  }

  async updateCurrent(details: Partial<ICharity>): Promise<ICharity> {
    const current = await this.model.findOne().exec();
    if (current) {
      const updated = await this.model.findByIdAndUpdate(current._id, details, { new: true, runValidators: true });
      return updated!;
    } else {
      return this.model.create(details);
    }
  }
}
