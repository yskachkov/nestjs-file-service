import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { createReadStream, promises as fsPromises } from 'fs';
import { join, parse } from 'path';
import { createInterface } from 'readline';

import { FileSystem, FileOptions, FileReadStreamWithMetadata } from './types';

@Injectable()
export class LocalFileSystem implements OnModuleInit, FileSystem {
  private readonly storageDir: string = join(process.cwd(), 'src/file/storage');
  private readonly fileExtensionsConfigFilename: string =
    'file-extensions.config';
  private readonly fileExtensionsConfigPath: string = join(
    this.storageDir,
    this.fileExtensionsConfigFilename
  );
  private readonly fileExtensionsConfigSeparator: string = '::';
  private fileExtensionsConfig: Record<string, string> = {};

  async onModuleInit(): Promise<void> {
    await fsPromises.mkdir(this.storageDir, { recursive: true });
    await this.initFileExtensionsJson();
    this.fileExtensionsConfig = await this.getFileExtensionsConfig();
  }

  private async initFileExtensionsJson(): Promise<void> {
    try {
      await fsPromises.writeFile(this.fileExtensionsConfigPath, '', {
        flag: 'wx'
      });
    } catch (error) {
      // avoid file overrides if it already exists
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  private async getFileExtensionsConfig(): Promise<Record<string, string>> {
    const fileExtensionsConfig = {};
    const fileStream = createReadStream(this.fileExtensionsConfigPath, 'utf-8');
    const readLineInterface = createInterface({
      input: fileStream,
      // Support all line endings (\n, \r\n)
      crlfDelay: Infinity
    });

    for await (const line of readLineInterface) {
      const [fileId, fileExtension] = line.split(
        this.fileExtensionsConfigSeparator
      );
      fileExtensionsConfig[fileId] = fileExtension;
    }

    return fileExtensionsConfig;
  }

  private async appendFileExtensionToConfig(
    fileId: string,
    extension: string
  ): Promise<void> {
    this.fileExtensionsConfig[fileId] = extension;

    await fsPromises.appendFile(
      this.fileExtensionsConfigPath,
      `${fileId}${this.fileExtensionsConfigSeparator}${extension}\n`,
      'utf-8'
    );
  }

  async save({ id, filename, buffer }: FileOptions): Promise<void> {
    const { ext: extension } = parse(filename);
    const filePath = join(this.storageDir, `${id}${extension}`);

    const fileWrites: Promise<void>[] = [
      fsPromises.writeFile(filePath, buffer, 'utf8'),
      this.appendFileExtensionToConfig(id, extension)
    ];

    await Promise.all(fileWrites);
  }

  async getReadStreamWithMetadata(
    fileId: string
  ): Promise<FileReadStreamWithMetadata> {
    const fileExtension = this.fileExtensionsConfig[fileId];

    if (!fileExtension) {
      throw new NotFoundException('File not found.');
    }

    const filename = `${fileId}${fileExtension}`;
    const filePath = join(this.storageDir, filename);

    return {
      filename,
      readStream: createReadStream(filePath)
    };
  }
}
