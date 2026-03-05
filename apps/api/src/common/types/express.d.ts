import type { AuthTokenPayload } from '../security/jwt.service';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
      requestId?: string;
      storeContext?: {
        id: string;
        slug: string;
        name: string;
      };
    }
  }
}

export {};
