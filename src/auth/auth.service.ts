import { Injectable } from '@nestjs/common';
import { UserService } from 'src/shared/user.service';
import { sign } from 'jsonwebtoken';
import { Payload } from 'src/types/payload';
import { User } from 'src/types/user';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload: Payload): Promise<string> {
    return await sign(payload, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
  }

  async validateUser(payload: Payload): Promise<User> {
    return await this.userService.findByPayload(payload);
  }
}
