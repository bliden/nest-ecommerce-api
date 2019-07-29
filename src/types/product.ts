import { Document } from 'mongoose';
import { User } from './user';

export interface Product extends Document {
  owner: User;
  title: string;
  description: string;
  image: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  image: string;
  price: number;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
