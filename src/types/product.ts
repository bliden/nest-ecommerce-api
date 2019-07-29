import { Document } from 'mongoose';
import { User } from './user';

export interface Product extends Document {
  owner: User;
  title: string;
  description: string;
  image: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  image: string;
  price: string;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
