import { ReadStream } from 'fs';

export interface FileData {
  id: string;
}

// export interface StoreFileMetadata extends Pick<FileData, 'filename'> {
//   path: string;
// }

// export interface FileDownloadData {
//   readStream: ReadStream;
//   filename: string;
// }

export interface FileOptions {
  id: string;
  filename: string;
  buffer: Buffer;
}

export interface FileReadStreamWithMetadata {
  filename: string;
  readStream: ReadStream;
}

export interface FileSystem {
  save: (fileOptions: FileOptions) => Promise<void>;
  getReadStreamWithMetadata: (
    fileId: string
  ) => Promise<FileReadStreamWithMetadata>;
}
