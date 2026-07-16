import { Schema, model } from 'mongoose';
import { ICharity } from '../types';

const charitySchema = new Schema<ICharity>({
  upiId: {
    type: String,
    required: [true, 'UPI ID is required'],
    trim: true,
  },
  accountName: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
  },
  ifsc: {
    type: String,
    required: [true, 'IFSC code is required'],
    trim: true,
  },
  qrImage: {
    type: String, // Can be base64 or URL
  },
}, {
  timestamps: true,
});

export const Charity = model<ICharity>('Charity', charitySchema);
