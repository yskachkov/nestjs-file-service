import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { createReadStream } from 'fs';

import { FileDownloadData, StoredFile } from './types';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async createFileDownloadData(fileId: string): Promise<FileDownloadData> {
    const file = await this.fileRepository.getFileMetadata(fileId);

    if (!file) {
      throw new NotFoundException('File not found.');
    }

    const { filename, path } = file;

    return {
      filename,
      readStream: createReadStream(path)
    };
  }

  async uploadFile(file: Express.Multer.File): Promise<StoredFile> {
    if (!file) {
      throw new BadRequestException('File is not provided.');
    }

    return this.fileRepository.saveFile(file);
  }
}
