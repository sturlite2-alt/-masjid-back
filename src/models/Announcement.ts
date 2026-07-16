import { Schema, model } from 'mongoose';
import { IAnnouncement } from '../types';

const announcementSchema = new Schema<IAnnouncement>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  expiryDate: {
    type: Date,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export const Announcement = model<IAnnouncement>('Announcement', announcementSchema);
