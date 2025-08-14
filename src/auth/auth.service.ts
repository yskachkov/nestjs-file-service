import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthData } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, password: string): Promise<AuthData> {
    if (!username || !password) {
      throw new BadRequestException('Username and password is required.');
    }

    const user = await this.usersService.findUser({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const tokenPayload = { id: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(tokenPayload)
    };
  }
}
