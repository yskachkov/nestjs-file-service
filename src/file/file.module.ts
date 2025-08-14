import { Logger, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';

@Module({
  controllers: [FileController],
  providers: [
    FileService,
    FileRepository,
    {
      provide: Logger,
      useValue: new Logger(FileService.name, { timestamp: true })
    }
  ],
  exports: [FileService]
})
export class FileModule {}
