import { Schema, model } from 'mongoose';
import { IContactInfo } from '../types';

const contactInfoSchema = new Schema<IContactInfo>({
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  whatsapp: {
    type: String,
    trim: true,
  },
  youtube: {
    type: String,
    trim: true,
  },
  facebook: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export const ContactInfo = model<IContactInfo>('ContactInfo', contactInfoSchema);
