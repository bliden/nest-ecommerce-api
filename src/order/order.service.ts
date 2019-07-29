import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, CreateOrderDTO } from 'src/types/order';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async listOrdersByUser(id: string) {
    const orders = await this.orderModel
      .find({ owner: id })
      .populate('owner')
      .populate('products.product');
    if (!orders) {
      throw new HttpException('No orders found', HttpStatus.NO_CONTENT);
    }
    return orders;
  }

  async createOrder(orderDTO: CreateOrderDTO, userID: string) {
    /*
      honestly messy and very unoptimized
    */

    const newOrder = {
      owner: userID,
      products: [...orderDTO.products],
    };
    const { id } = await this.orderModel.create(newOrder);

    let order = await this.orderModel
      .findById(id)
      .populate('owner')
      .populate('products.product');

    const totalPrice = order.products.reduce((acc, row) => {
      return acc + row.product.price * row.quantity;
    }, 0);

    const updatedOrder = await this.orderModel.updateOne(
      { _id: order._id },
      { totalPrice },
    );

    return await this.orderModel
      .findById(order._id)
      .populate('owner')
      .populate('products.product');
  }
}
