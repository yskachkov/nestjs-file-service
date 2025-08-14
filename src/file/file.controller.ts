import {
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { StoredFile } from './types';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/download/:id')
  async downloadFile(@Param('id') id: string): Promise<StreamableFile> {
    return this.fileService.downloadFile(id);
  }

  @Post('/upload')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<StoredFile> {
    return this.fileService.uploadFile(file);
  }
}
