import { Injectable, NotFoundException } from '@nestjs/common';

import { User, UserFindOptions } from './types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUser({ username, id }: UserFindOptions): Promise<User> {
    const user = await this.usersRepository.findOne({ id, username });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
