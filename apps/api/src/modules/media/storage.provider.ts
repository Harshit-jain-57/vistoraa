export interface StorageUploadResult {
  key: string;
  url: string;
}

export interface IStorageProvider {
  upload(file: Express.Multer.File): Promise<StorageUploadResult>;
  remove(key: string): Promise<void>;
}
