import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { ProductSchema } from '../models/product.schema';
// import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    SharedModule,
    // AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
