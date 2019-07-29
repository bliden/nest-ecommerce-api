import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO, UpdateProductDTO } from 'src/types/product';
import { AuthGuard } from '@nestjs/passport';
import { SellerGuard } from 'src/guards/seller.guard';
import { User } from 'src/utilities/user.decorator';
import { User as UserDocument } from 'src/types/user';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async listAll() {
    return await this.productService.findAll();
  }

  @UseGuards(AuthGuard(), SellerGuard)
  @Get('/mine')
  async listMine(@User() user: UserDocument) {
    return await this.productService.findByOwner(user.id);
  }

  @Get('/seller/:id')
  async listBySeller(@Param('id') id: string) {
    return await this.productService.findByOwner(id);
  }

  @UseGuards(AuthGuard(), SellerGuard)
  @Post('/')
  async create(@Body() product: CreateProductDTO, @User() user: UserDocument) {
    return await this.productService.create(product, user);
  }

  @Get('/:id')
  async read(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @UseGuards(AuthGuard(), SellerGuard)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() product: UpdateProductDTO,
    @User() user: UserDocument,
  ) {
    return await this.productService.update(id, product, user.id);
  }

  @UseGuards(AuthGuard(), SellerGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string, @User() user: UserDocument) {
    return await this.productService.delete(id, user.id);
  }
}
