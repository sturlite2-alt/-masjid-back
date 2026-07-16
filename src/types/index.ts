import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPrayerTiming extends Document {
  date: string; // YYYY-MM-DD
  tahajjudEnd: string;
  fajrStart: string;
  fajrEnd: string;
  makroohStart: string;
  makroohEnd: string;
  ishraq: string;
  chasht: string;
  zuhrStart: string;
  zuhrEnd: string;
  asrStart: string;
  asrEnd: string;
  maghribStart: string;
  maghribEnd: string;
  ishaStart: string;
  ishaEnd: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnnouncement extends Document {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  pinned: boolean;
  expiryDate?: Date;
  order?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IHadith extends Document {
  content: string;
  source?: string;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ICharity extends Document {
  upiId: string;
  accountName: string;
  bankName: string;
  ifsc: string;
  qrImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IArabicClass extends Document {
  title: string;
  description: string;
  videoUrl?: string; // YouTube embed URL
  images: string[];  // Array of base64 image strings
  order?: number;    // Sort order
  createdAt: Date;
  updatedAt?: Date;
}

export interface IContactInfo extends Document {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  youtube?: string;
  facebook?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
