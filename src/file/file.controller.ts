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
import { FileData } from './types';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/download/:id')
  async downloadFile(@Param('id') id: string): Promise<StreamableFile> {
    const { filename, readStream } =
      await this.fileService.getReadStreamWithMetadata(id);

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
    @UploadedFile() { originalname: filename, buffer }: Express.Multer.File
  ): Promise<FileData> {
    return this.fileService.saveFile(filename, buffer);
  }
}
