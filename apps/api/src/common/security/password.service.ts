import bcrypt from 'bcryptjs';

class PasswordService {
  public async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, 12);
  }

  public async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}

export const passwordService = new PasswordService();
