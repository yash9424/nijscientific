import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHero extends Document {
  tag: string;
  headline: string;
  subheadline: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSchema: Schema = new Schema(
  {
    tag: {
      type: String,
      trim: true,
      maxlength: [50, 'Tag cannot be more than 50 characters'],
      default: '',
    },
    headline: {
      type: String,
      required: [true, 'Please provide a headline'],
      trim: true,
      maxlength: [100, 'Headline cannot be more than 100 characters'],
    },
    subheadline: {
      type: String,
      trim: true,
      maxlength: [200, 'Subheadline cannot be more than 200 characters'],
      default: '',
    },
    mediaUrl: {
      type: String,
      required: [true, 'Please provide a media file (image or video)'],
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
      default: 'image',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overwrite model error
const Hero: Model<IHero> = mongoose.models.Hero || mongoose.model<IHero>('Hero', HeroSchema);

export default Hero;
