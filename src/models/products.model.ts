import { Schema, model } from 'mongoose';

import { IProduct } from './model.interface';

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
      default: '',
    },
    imageId: {
      type: String,
      required: true,
      default: '',
    },
  },
  brand: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  productUrl: String,
});

export const Product = model<IProduct>('Products', productSchema);
