import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

import { StoredFile, StoreFileMetadata } from './types';

@Injectable()
export class FileRepository implements OnApplicationShutdown {
  private readonly storageDir = join(process.cwd(), 'src/file/storage');
  private readonly files: Map<string, StoredFile> = new Map();

  constructor(private readonly logger: Logger) {
    fsPromises.mkdir(this.storageDir, { recursive: true });
  }

  async onApplicationShutdown() {
    await this.cleanupUploadedFiles();
  }

  async cleanupUploadedFiles() {
    try {
      const files = await fsPromises.readdir(this.storageDir);

      for (const file of files) {
        const filePath = join(this.storageDir, file);

        await fsPromises.unlink(filePath);
      }

      this.logger.log('Uploaded files cleaned up.');
    } catch (err) {
      this.logger.error(`Error cleaning uploaded files: ${err}`);
    }
  }

  async getFileMetadata(
    fileId: string
  ): Promise<StoreFileMetadata | undefined> {
    const file = this.files.get(fileId);

    if (!file) {
      return;
    }

    const { filename } = file;
    const path = join(this.storageDir, filename);

    return { filename, path };
  }

  async saveFile(file: Express.Multer.File) {
    const { originalname: filename, buffer } = file;
    const fileId = uuid();
    const filePath = join(this.storageDir, filename);

    await fsPromises.writeFile(filePath, buffer, 'utf8');

    const fileData = {
      id: fileId,
      filename
    };

    this.files.set(fileId, fileData);

    return fileData;
  }
}
