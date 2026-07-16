import { Schema, model } from 'mongoose';
import { IPrayerTiming } from '../types';

const prayerTimingSchema = new Schema<IPrayerTiming>({
  date: {
    type: String, // YYYY-MM-DD
    required: [true, 'Date is required'],
    unique: true,
    index: true,
  },
  tahajjudEnd: { type: String, required: true },
  fajrStart: { type: String, required: true },
  fajrEnd: { type: String, required: true },
  makroohStart: { type: String, required: true },
  makroohEnd: { type: String, required: true },
  ishraq: { type: String, required: true },
  chasht: { type: String, required: true },
  zuhrStart: { type: String, required: true },
  zuhrEnd: { type: String, required: true },
  asrStart: { type: String, required: true },
  asrEnd: { type: String, required: true },
  maghribStart: { type: String, required: true },
  maghribEnd: { type: String, required: true },
  ishaStart: { type: String, required: true },
  ishaEnd: { type: String, required: true },
}, {
  timestamps: true,
});

export const PrayerTiming = model<IPrayerTiming>('PrayerTiming', prayerTimingSchema);
