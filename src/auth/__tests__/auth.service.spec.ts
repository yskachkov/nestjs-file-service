import { Test, TestingModule } from '@nestjs/testing';
import {JwtService} from "@nestjs/jwt";

import {UsersService} from "../../users/users.service";
import {UsersRepository} from "../../users/users.repository";
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, UsersRepository, JwtService]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
