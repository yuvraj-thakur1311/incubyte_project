// src/models/Sweet.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const SweetSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Sweet name is required"],
      unique: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Sweet = mongoose.model<ISweet>('Sweet', SweetSchema);
export default Sweet;
