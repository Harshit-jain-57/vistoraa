import type { UpdateShowroomRequestStatusDto } from './request.types';

import { Prisma, ShowroomRequestItemStatus as PrismaShowroomRequestItemStatus, ShowroomRequestStatus, ShowroomRequestStatus as PrismaShowroomRequestStatus } from '@prisma/client';

import { omitUndefined } from '../../common/utils/object';
import { BaseRepository } from '../../common/database/base.repository';

export class RequestRepository extends BaseRepository {
  public findSessionWithShortlist(storeId: string, sessionToken: string) {
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
                name: true,
                slug: true,
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

  public findRecentBySession(storeId: string, customerSessionId: string) {
    return this.prisma.showroomRequest.findMany({
      where: {
        storeId,
        customerSessionId,
        status: {
          in: [ShowroomRequestStatus.PENDING, ShowroomRequestStatus.ACCEPTED, ShowroomRequestStatus.PICKING],
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
  }

  public createFromShortlist(
    storeId: string,
    session: Awaited<ReturnType<typeof this.findSessionWithShortlist>>,
    requestNumber: string,
    notes?: string,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const activeSession = session!;

      if (activeSession.customerName || activeSession.mobileNumber) {
        await transaction.customerSession.update({
          where: {
            id: activeSession.id,
          },
          data: {
            customerName: activeSession.customerName,
            mobileNumber: activeSession.mobileNumber,
            lastActiveAt: new Date(),
          },
        });
      }

      const showroomRequest = await transaction.showroomRequest.create({
        data: {
          storeId,
          customerSessionId: activeSession.id,
          requestNumber,
          notes,
          snapshotCustomerName: activeSession.customerName,
          snapshotMobileNumber: activeSession.mobileNumber,
          items: {
            create: activeSession.shortlistItems.map((item) => ({
              product: {
                connect: {
                  id: item.productId,
                },
              },
              productNameSnapshot: item.product.name,
              productSlugSnapshot: item.product.slug,
              publicCodeSnapshot: item.product.publicCode,
              primaryImageSnapshot: item.product.images[0]?.imageUrl ?? null,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await transaction.shortlistItem.deleteMany({
        where: {
          customerSessionId: activeSession.id,
        },
      });

      return showroomRequest;
    });
  }

  public listAdminRequests(storeId: string, page: number, limit: number, status?: ShowroomRequestStatus) {
    return this.prisma.showroomRequest.findMany({
      where: {
        storeId,
        ...(status ? { status } : {}),
      },
      include: {
        customerSession: true,
        acceptedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        items: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public countAdminRequests(storeId: string, status?: ShowroomRequestStatus) {
    return this.prisma.showroomRequest.count({
      where: {
        storeId,
        ...(status ? { status } : {}),
      },
    });
  }

  public findById(storeId: string, requestId: string) {
    return this.prisma.showroomRequest.findFirst({
      where: {
        id: requestId,
        storeId,
      },
      include: {
        items: true,
        customerSession: true,
      },
    });
  }

  public updateStatus(storeId: string, requestId: string, actorUserId: string, dto: UpdateShowroomRequestStatusDto) {
    return this.prisma.$transaction(async (transaction) => {
      const requestUpdateData: Prisma.ShowroomRequestUpdateInput = omitUndefined({
        status: dto.status as unknown as PrismaShowroomRequestStatus,
        notes: dto.notes,
        acceptedBy:
          dto.status === 'ACCEPTED' || dto.status === 'PICKING' || dto.status === 'READY_TO_SHOW'
            ? {
                connect: {
                  id: actorUserId,
                },
              }
            : undefined,
      });

      const request = await transaction.showroomRequest.update({
        where: {
          id: requestId,
        },
        data: requestUpdateData,
      });

      if (dto.items?.length) {
        await Promise.all(
          dto.items.map((item) =>
            transaction.showroomRequestItem.updateMany({
              where: {
                showroomRequestId: requestId,
                productId: item.productId,
              },
              data: omitUndefined({
                status: item.status as unknown as PrismaShowroomRequestItemStatus,
                remark: item.remark,
              }),
            }),
          ),
        );
      }

      return transaction.showroomRequest.findFirst({
        where: {
          id: request.id,
          storeId,
        },
        include: {
          items: true,
          customerSession: true,
          acceptedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  }
}

export const requestRepository = new RequestRepository();
