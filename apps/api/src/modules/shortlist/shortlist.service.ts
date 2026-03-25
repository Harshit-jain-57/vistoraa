import { StatusCodes } from 'http-status-codes';

import type { AddShortlistItemDto } from './shortlist.types';

import { AppError } from '../../common/errors/app-error';
import { productService } from '../products/product.service';
import { shortlistRepository } from './shortlist.repository';

export class ShortlistService {
  private mapItems(
    session:
      | Awaited<ReturnType<typeof shortlistRepository.findSessionWithItems>>
      | null,
  ) {
    return (
      session?.shortlistItems.map((item) => ({
        id: item.id,
        productSlug: item.product.slug,
        productName: item.product.name,
        publicCode: item.product.publicCode,
        primaryImageUrl: item.product.images[0]?.imageUrl ?? null,
        addedAt: item.addedAt.toISOString(),
      })) ?? []
    );
  }

  public async listShortlist(storeId: string, sessionToken?: string) {
    if (!sessionToken) {
      return {
        sessionToken: null,
        items: [],
      };
    }

    const session = await shortlistRepository.findSessionWithItems(storeId, sessionToken);

    return {
      sessionToken,
      items: this.mapItems(session),
    };
  }

  public async addItem(storeId: string, dto: AddShortlistItemDto) {
    await productService.ensureRequestableProducts(storeId, [dto.productId]);

    const session = await shortlistRepository.upsertSession(storeId, {
      sessionToken: dto.sessionToken,
      customerName: dto.customerName,
      mobileNumber: dto.mobileNumber,
    });

    await shortlistRepository.addItem(session.id, dto.productId);

    const updatedSession = await shortlistRepository.findSessionWithItems(storeId, session.sessionToken);

    return {
      sessionToken: session.sessionToken,
      items: this.mapItems(updatedSession),
    };
  }

  public async removeItem(storeId: string, sessionToken: string, shortlistItemId: string) {
    const session = await shortlistRepository.findSessionWithItems(storeId, sessionToken);

    if (!session) {
      throw new AppError(StatusCodes.NOT_FOUND, 'SESSION_NOT_FOUND', 'Shortlist session was not found.');
    }

    await shortlistRepository.removeItem(session.id, shortlistItemId);
    const updatedSession = await shortlistRepository.findSessionWithItems(storeId, sessionToken);

    return {
      sessionToken,
      items: this.mapItems(updatedSession),
    };
  }
}

export const shortlistService = new ShortlistService();
