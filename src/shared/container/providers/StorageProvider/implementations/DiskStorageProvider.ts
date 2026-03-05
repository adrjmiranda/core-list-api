import fs from 'fs';
import path from 'path';
import Stream from 'stream';
import { pipeline } from 'stream/promises';

import uploadConfig from '@/config/upload.js';
import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { IStorageProvider } from '@/shared/container/providers/StorageProvider/models/IStorageProvider.js';
import { AppError } from '@/shared/errors/AppError.js';

export class DiskStorageProvider implements IStorageProvider {
  public async saveFile(
    fileName: string,
    fileStream: NodeJS.ReadableStream,
  ): Promise<string> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, fileName);
    let byteCount = 0;

    const sizeChecker = new Stream.Transform({
      transform(chunk, encoding, callback) {
        byteCount += chunk.length;
        if (byteCount > uploadConfig.maxFileSize) {
          callback(new AppError(ERROR_CODES.FILE_TOO_LARGE, 413));
          return;
        }
        callback(null, chunk);
      },
    });

    try {
      await pipeline(fileStream, sizeChecker, fs.createWriteStream(filePath));
      return fileName;
    } catch (error) {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      throw error;
    }
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
