import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { LocalFileSystem } from './local-file-system';
import { FileData, FileReadStreamWithMetadata } from './types';

@Injectable()
export class FileService {
  constructor(private readonly localFileSystem: LocalFileSystem) {}

  async getReadStreamWithMetadata(
    fileId: string
  ): Promise<FileReadStreamWithMetadata> {
    return this.localFileSystem.getReadStreamWithMetadata(fileId);
  }

  async saveFile(filename: string, buffer: Buffer): Promise<FileData> {
    const fileId = uuid();

    await this.localFileSystem.save({
      id: fileId,
      filename,
      buffer
    });

    return { id: fileId };
  }
}
