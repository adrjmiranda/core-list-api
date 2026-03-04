import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

import uploadConfig from '@/config/upload.js';
import { IStorageProvider } from '@/shared/container/providers/StorageProvider/models/IStorageProvider.js';

export class DiskStorageProvider implements IStorageProvider {
  public async saveFile(
    fileName: string,
    fileStream: NodeJS.ReadableStream,
  ): Promise<string> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, fileName);

    try {
      await pipeline(fileStream, fs.createWriteStream(filePath));
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
