import { ReadStream } from 'fs';

export interface StoredFile {
  id: string;
  filename: string;
}

export interface StoreFileMetadata extends Pick<StoredFile, 'filename'> {
  path: string;
}

export interface FileDownloadData {
  readStream: ReadStream;
  filename: string;
}
