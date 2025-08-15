import { Logger, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { LocalFileSystem } from './local-file-system';

@Module({
  controllers: [FileController],
  providers: [
    FileService,
    LocalFileSystem,
    {
      provide: Logger,
      useValue: new Logger(FileService.name, { timestamp: true })
    }
  ],
  exports: [FileService]
})
export class FileModule {}
