import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, UpdateProductDTO, ProductDTO } from 'src/types/product';
import { Model } from 'mongoose';
import { User } from 'src/types/user';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productModel.find({}).populate('owner');
  }

  async findByOwner(id: string): Promise<Product[]> {
    return await this.productModel.find({ owner: id }).populate('owner');
  }

  async findOne(id: string): Promise<Product> {
    return await this.productModel.findById(id).populate('owner');
  }

  async create(productDTO: ProductDTO, user: User): Promise<Product> {
    const product = new this.productModel({
      ...productDTO,
      owner: user,
    });
    await product.save();
    return await product.populate('owner');
  }

  async update(
    id: string,
    partialProductDTO: UpdateProductDTO,
    userID: User,
  ): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (product.owner.id.toString() !== userID) {
      throw new HttpException(
        "You don't have ownership of this product.",
        HttpStatus.UNAUTHORIZED,
      );
    }
    await product.update(partialProductDTO);
    return product.populate('owner');
  }

  async delete(id: string, userID: User): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (product.owner.id.toString() !== userID) {
      throw new HttpException(
        "You don't have ownership of this product.",
        HttpStatus.UNAUTHORIZED,
      );
    }
    await product.remove();
    return await product.populate('owner');
  }
}
