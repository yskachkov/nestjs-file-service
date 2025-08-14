import { Logger, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: Logger,
      useValue: new Logger(FileService.name, { timestamp: true })
    }
  ],
  exports: [FileService]
})
export class FileModule {}
