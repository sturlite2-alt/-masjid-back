import { Schema, model } from 'mongoose';
import { IHadith } from '../types';

const hadithSchema = new Schema<IHadith>({
  content: {
    type: String,
    required: [true, 'Hadith content is required'],
    trim: true,
  },
  source: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

// Pre-save hook to ensure only one Hadith is active at any time
hadithSchema.pre('save', async function (this: any) {
  if (this.active) {
    // Set all other hadiths to inactive
    await this.model('Hadith').updateMany({ _id: { $ne: this._id } }, { active: false });
  }
});

export const Hadith = model<IHadith>('Hadith', hadithSchema);
