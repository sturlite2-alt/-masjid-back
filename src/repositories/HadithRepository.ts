import { Hadith } from '../models/Hadith';
import { IHadith } from '../types';
import { BaseRepository } from './BaseRepository';

export class HadithRepository extends BaseRepository<IHadith> {
  constructor() {
    super(Hadith);
  }

  async findActive(): Promise<IHadith | null> {
    return this.model.findOne({ active: true }).exec();
  }

  async activateHadith(id: string): Promise<IHadith | null> {
    // Set all other hadiths to inactive
    await this.model.updateMany({ _id: { $ne: id } }, { active: false });
    // Set this one to active
    return this.model.findByIdAndUpdate(id, { active: true }, { new: true }).exec();
  }
}
