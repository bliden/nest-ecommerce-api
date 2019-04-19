import { Injectable } from '@nestjs/common';
import { UserService } from 'src/shared/user.service';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload: any): Promise<string> {
    return await sign(payload, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
  }

  async validateUser(payload: any): Promise<any> {
    return await this.userService.findByPayload(payload);
  }
}
