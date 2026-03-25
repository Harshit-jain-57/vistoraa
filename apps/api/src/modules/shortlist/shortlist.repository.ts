import crypto from 'node:crypto';

import { BaseRepository } from '../../common/database/base.repository';

export class ShortlistRepository extends BaseRepository {
  public findSessionWithItems(storeId: string, sessionToken: string) {
    return this.prisma.customerSession.findFirst({
      where: {
        storeId,
        sessionToken,
      },
      include: {
        shortlistItems: {
          orderBy: {
            addedAt: 'desc',
          },
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                name: true,
                publicCode: true,
                images: {
                  orderBy: {
                    sortOrder: 'asc',
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  public async upsertSession(storeId: string, input: {
    sessionToken?: string;
    customerName?: string;
    mobileNumber?: string;
  }) {
    if (input.sessionToken) {
      const existing = await this.prisma.customerSession.findFirst({
        where: {
          storeId,
          sessionToken: input.sessionToken,
        },
      });

      if (existing) {
        return this.prisma.customerSession.update({
          where: {
            id: existing.id,
          },
          data: {
            customerName: input.customerName ?? existing.customerName,
            mobileNumber: input.mobileNumber ?? existing.mobileNumber,
            lastActiveAt: new Date(),
          },
        });
      }
    }

    return this.prisma.customerSession.create({
      data: {
        storeId,
        sessionToken: input.sessionToken ?? crypto.randomUUID(),
        customerName: input.customerName,
        mobileNumber: input.mobileNumber,
      },
    });
  }

  public addItem(customerSessionId: string, productId: string) {
    return this.prisma.shortlistItem.upsert({
      where: {
        customerSessionId_productId: {
          customerSessionId,
          productId,
        },
      },
      update: {
        addedAt: new Date(),
      },
      create: {
        customerSessionId,
        productId,
      },
    });
  }

  public removeItem(customerSessionId: string, shortlistItemId: string) {
    return this.prisma.shortlistItem.deleteMany({
      where: {
        id: shortlistItemId,
        customerSessionId,
      },
    });
  }

  public clearItems(customerSessionId: string) {
    return this.prisma.shortlistItem.deleteMany({
      where: {
        customerSessionId,
      },
    });
  }
}

export const shortlistRepository = new ShortlistRepository();
