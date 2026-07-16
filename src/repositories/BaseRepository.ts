import { Model, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(filter: any = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async findOne(filter: any): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async create(item: Partial<T>): Promise<T> {
    return this.model.create(item);
  }

  async update(id: string, item: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
