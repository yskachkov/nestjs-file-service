import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile
} from '@nestjs/common';
import { createReadStream, promises as fsPromises } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

import { StoredFile } from './types';

@Injectable()
export class FileService {
  private readonly storageDir = join(process.cwd(), 'src/file/storage');
  private readonly files: Map<string, StoredFile> = new Map();

  constructor() {
    fsPromises.mkdir(this.storageDir, { recursive: true });
  }

  async downloadFile(fileId: string): Promise<StreamableFile> {
    const file = this.files.get(fileId);

    if (!file) {
      throw new NotFoundException('File not found.');
    }

    const { filename } = file;
    const fileLocalPath = join(this.storageDir, filename);

    const stream = createReadStream(fileLocalPath);

    return new StreamableFile(stream, {
      type: 'application/octet-stream',
      disposition: `attachment; filename="downloaded-file"; filename*=UTF-8''${encodeURIComponent(filename)}`
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<StoredFile> {
    if (!file) {
      throw new BadRequestException('File is not provided.');
    }

    const fileId = uuid();
    const { originalname: filename, buffer } = file;
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
