import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image: string;
  caption: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL or path'],
    },
    caption: {
      type: String,
      required: [true, 'Please provide a caption'],
      maxlength: [200, 'Caption cannot be more than 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overwrite model error
const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
