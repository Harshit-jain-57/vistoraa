import fs from 'node:fs/promises';
import path from 'node:path';

import type { IStorageProvider, StorageUploadResult } from './storage.provider';

import { env } from '../../config/env';

export class LocalStorageProvider implements IStorageProvider {
  public async upload(file: Express.Multer.File): Promise<StorageUploadResult> {
    const extension = path.extname(file.originalname) || '.bin';
    const key = `${Date.now()}-${file.originalname.replace(/\s+/g, '-').toLowerCase()}`;
    const safeKey = `${key}${extension.endsWith(extension) ? '' : extension}`;
    const targetDirectory = path.resolve(process.cwd(), env.UPLOAD_DIR);
    const targetPath = path.join(targetDirectory, safeKey);

    await fs.mkdir(targetDirectory, { recursive: true });
    await fs.writeFile(targetPath, file.buffer);

    return {
      key: safeKey,
      url: `/uploads/${safeKey}`,
    };
  }

  public async remove(key: string): Promise<void> {
    const targetPath = path.resolve(process.cwd(), env.UPLOAD_DIR, key);
    await fs.rm(targetPath, { force: true });
  }
}
