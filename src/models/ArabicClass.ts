import { Schema, model } from 'mongoose';
import { IArabicClass } from '../types';

const arabicClassSchema = new Schema<IArabicClass>({
  title: {
    type: String,
    required: [true, 'Class title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Class description is required'],
    trim: true,
  },
  videoUrl: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export const ArabicClass = model<IArabicClass>('ArabicClass', arabicClassSchema);
