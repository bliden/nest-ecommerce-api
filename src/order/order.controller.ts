import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, CreateOrderDTO } from 'src/types/order';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utilities/user.decorator';
import { User as UserDocument } from 'src/types/user';
import { createBrotliDecompress } from 'zlib';
import bodyParser = require('body-parser');

@Controller('order')
export class OrderController {
  constructor(private orderServce: OrderService) {}

  @Get()
  @UseGuards(AuthGuard())
  listOrder(@User() user: UserDocument) {
    return this.orderServce.listOrdersByUser(user.id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createOrder(@User() user: UserDocument, @Body() order: CreateOrderDTO) {
    const createdorder = await this.orderServce.createOrder(order, user.id);
    return createdorder;
  }
}
