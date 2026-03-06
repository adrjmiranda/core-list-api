import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  maxFileSize: 2 * 1024 * 1024, // 2MB
  allowedMimetypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],

  generateHashName(originalName: string): string {
    const fileHash = crypto.randomBytes(10).toString('hex');
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);

    const sanitizedBaseName = baseName
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    return `${fileHash}-${sanitizedBaseName}${extension}`;
  },
};
