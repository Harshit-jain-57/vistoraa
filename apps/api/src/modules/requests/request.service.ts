import crypto from 'node:crypto';

import { StatusCodes } from 'http-status-codes';

import type { CreateShowroomRequestDto, UpdateShowroomRequestStatusDto } from './request.types';

import { buildPaginationMeta } from '../../common/utils/pagination';
import { AppError } from '../../common/errors/app-error';
import { auditService } from '../audit/audit.service';
import { productService } from '../products/product.service';
import { shortlistRepository } from '../shortlist/shortlist.repository';
import { requestRepository } from './request.repository';

export class RequestService {
  private generateRequestNumber(): string {
    return `VR-${Date.now().toString(36).toUpperCase()}-${crypto.randomInt(100, 999)}`;
  }

  public async submitRequest(storeId: string, dto: CreateShowroomRequestDto) {
    const session = await requestRepository.findSessionWithShortlist(storeId, dto.sessionToken);

    if (!session) {
      throw new AppError(StatusCodes.NOT_FOUND, 'SESSION_NOT_FOUND', 'Customer session was not found.');
    }

    if (!session.shortlistItems.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'EMPTY_SHORTLIST',
        'Showroom request cannot be submitted because the shortlist is empty.',
      );
    }

    if (dto.customerName || dto.mobileNumber) {
      await shortlistRepository.upsertSession(storeId, {
        sessionToken: dto.sessionToken,
        customerName: dto.customerName,
        mobileNumber: dto.mobileNumber,
      });
    }

    const currentSession = await requestRepository.findSessionWithShortlist(storeId, dto.sessionToken);
    const productIds = currentSession!.shortlistItems.map((item) => item.productId);

    await productService.ensureRequestableProducts(storeId, productIds);

    const recentRequests = await requestRepository.findRecentBySession(storeId, currentSession!.id);
    const signature = productIds.slice().sort().join('|');
    const duplicate = recentRequests.find((request) => {
      const existingSignature = request.items.map((item) => item.productId).sort().join('|');
      return existingSignature === signature && Date.now() - request.createdAt.getTime() < 2 * 60 * 1_000;
    });

    if (duplicate) {
      return {
        requestNumber: duplicate.requestNumber,
        status: duplicate.status,
        itemCount: duplicate.items.length,
        customerName: currentSession!.customerName,
        duplicate: true,
      };
    }

    const request = await requestRepository.createFromShortlist(
      storeId,
      currentSession,
      this.generateRequestNumber(),
      dto.notes,
    );

    await auditService.log({
      storeId,
      entityType: 'ShowroomRequest',
      entityId: request.id,
      action: 'CREATE',
      newValue: request,
    });

    return {
      requestNumber: request.requestNumber,
      status: request.status,
      itemCount: productIds.length,
      customerName: currentSession!.customerName,
      duplicate: false,
    };
  }

  public async listAdminRequests(storeId: string, query: { page: number; limit: number; status?: string }) {
    const [requests, total] = await Promise.all([
      requestRepository.listAdminRequests(storeId, query.page, query.limit, query.status as never),
      requestRepository.countAdminRequests(storeId, query.status as never),
    ]);

    return {
      data: requests,
      pagination: buildPaginationMeta(query.page, query.limit, total),
    };
  }

  public async updateStatus(
    storeId: string,
    requestId: string,
    actorUserId: string,
    dto: UpdateShowroomRequestStatusDto,
  ) {
    const current = await requestRepository.findById(storeId, requestId);

    if (!current) {
      throw new AppError(StatusCodes.NOT_FOUND, 'REQUEST_NOT_FOUND', 'Showroom request not found.');
    }

    const updated = await requestRepository.updateStatus(storeId, requestId, actorUserId, dto);

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'ShowroomRequest',
      entityId: requestId,
      action: 'UPDATE_STATUS',
      oldValue: current,
      newValue: updated,
    });

    return updated;
  }
}

export const requestService = new RequestService();
