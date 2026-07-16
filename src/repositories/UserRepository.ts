import { User } from '../models/User';
import { IUser } from '../types';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }
}
