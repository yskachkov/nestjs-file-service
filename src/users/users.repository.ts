import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { User, UserFindOptions } from './types';

@Injectable()
export class UsersRepository {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin12345', 10)
    },
    {
      id: 2,
      username: 'test',
      password: bcrypt.hashSync('12345', 10)
    }
  ];

  async findOne({ id, username }: UserFindOptions): Promise<User | undefined> {
    return this.users.find(
      (user) => user.id === id || user.username === username
    );
  }
}
