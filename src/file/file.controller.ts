import {
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../auth/auth.guard';
import { FileService } from './file.service';
import { StoredFile } from './types';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/download/:id')
  async downloadFile(@Param('id') id: string): Promise<StreamableFile> {
    const { readStream, filename } =
      await this.fileService.createFileDownloadData(id);

    return new StreamableFile(readStream, {
      type: 'application/octet-stream',
      disposition: `attachment; filename="downloaded-file"; filename*=UTF-8''${encodeURIComponent(filename)}`
    });
  }

  @Post('/upload')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
