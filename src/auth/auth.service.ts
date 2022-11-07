import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const result = user;
      result.password = undefined;

      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }

  async getUserByToken(token: string) {
    const payload = this.jwtService.verify(token);
    if (payload.sub) {
      return this.usersService.findById(payload.sub);
    }
  }
}
