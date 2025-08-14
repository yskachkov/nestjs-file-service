import { Test, TestingModule } from '@nestjs/testing';
import {Logger} from "@nestjs/common";

import { FileService } from '../file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService, Logger]
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
