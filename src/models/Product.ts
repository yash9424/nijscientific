import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  description: string;
  mainImage: string;
  images: string[];
  hasTable: boolean;
  tableColumns: string[];
  tableRows: string[][];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    mainImage: {
      type: String,
      required: [true, 'Please provide a main image'],
    },
    images: {
      type: [String],
      default: [],
    },
    hasTable: {
      type: Boolean,
      default: false,
    },
    tableColumns: {
      type: [String],
      default: [],
    },
    tableRows: {
      type: [[String]], // Array of arrays of strings
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overwrite model error
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
