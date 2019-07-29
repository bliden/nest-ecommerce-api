import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/models/order.schema';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    SharedModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
