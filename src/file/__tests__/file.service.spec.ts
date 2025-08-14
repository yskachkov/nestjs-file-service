import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';

import { FileService } from '../file.service';
import { FileRepository } from '../file.repository';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService, FileRepository, Logger]
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
