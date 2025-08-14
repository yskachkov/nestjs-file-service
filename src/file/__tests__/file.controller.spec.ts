import { Test, TestingModule } from '@nestjs/testing';
import {JwtService} from "@nestjs/jwt";

import {FileController} from "../file.controller";
import {FileService} from "../file.service";
import {Logger} from "@nestjs/common";

describe('FileController', () => {
  let controller: FileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [JwtService, FileService, Logger]
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
