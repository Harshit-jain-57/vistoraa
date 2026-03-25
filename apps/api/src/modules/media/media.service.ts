import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../common/errors/app-error';
import { LocalStorageProvider } from './local-storage.provider';

export class MediaService {
  private readonly storageProvider = new LocalStorageProvider();

  public async uploadImage(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'FILE_REQUIRED', 'An image file is required.');
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'INVALID_FILE_TYPE', 'Only JPG, PNG, and WEBP files are supported.');
    }

    return this.storageProvider.upload(file);
  }
}

export const mediaService = new MediaService();
