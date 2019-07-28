import { Controller, Post, Body, UseGuards, Get, Logger } from '@nestjs/common';
import { UserService } from 'src/shared/user.service';
import { RegisterDTO, LoginDTO } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Payload } from 'src/types/payload';
import { User } from 'src/utilities/user.decorator';
import { SellerGuard } from 'src/guards/seller.guard';
import { Mongoose, connection, connections } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  tempAuth() {
    return { auth: 'works' };
  }

  // DEV only. please remove in future
  @Get('all')
  @UseGuards(AuthGuard(), SellerGuard)
  async getall(@User() user: any) {
    return await this.userService.findAll();
  }

  @Post('login')
  async login(@Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO);
    const payload = {
      username: user.username,
      seller: user.seller,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const user = await this.userService.create(userDTO);
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
}
