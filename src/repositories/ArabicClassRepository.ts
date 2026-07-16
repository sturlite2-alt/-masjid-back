import { ArabicClass } from '../models/ArabicClass';
import { IArabicClass } from '../types';
import { BaseRepository } from './BaseRepository';

export class ArabicClassRepository extends BaseRepository<IArabicClass> {
  constructor() {
    super(ArabicClass);
  }

  override async find(filter: any = {}): Promise<IArabicClass[]> {
    return this.model.find(filter).sort({ order: 1, createdAt: -1 }).exec();
  }
}
