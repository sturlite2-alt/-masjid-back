import { ContactInfo } from '../models/ContactInfo';
import { IContactInfo } from '../types';
import { BaseRepository } from './BaseRepository';

export class ContactInfoRepository extends BaseRepository<IContactInfo> {
  constructor() {
    super(ContactInfo);
  }

  async findCurrent(): Promise<IContactInfo | null> {
    return this.model.findOne().exec();
  }

  async updateCurrent(details: Partial<IContactInfo>): Promise<IContactInfo> {
    const current = await this.model.findOne().exec();
    if (current) {
      const updated = await this.model.findByIdAndUpdate(current._id, details, { new: true, runValidators: true });
      return updated!;
    } else {
      return this.model.create(details);
    }
  }
}
