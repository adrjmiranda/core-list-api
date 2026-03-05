import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

// TODO: Lembrar de limitar tamanho de arquivo que pode ser enviado
export default {
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  generateHashName(originalName: string): string {
    const fileHash = crypto.randomBytes(10).toString('hex');
    return `${fileHash}-${originalName}`;
  },
};
