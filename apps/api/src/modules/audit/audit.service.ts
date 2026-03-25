import type { Prisma } from '@prisma/client';

import { prisma } from '../../database/prisma';

interface AuditLogInput {
  storeId: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: string;
  oldValue?: unknown;
  newValue?: unknown;
}

export class AuditService {
  public async log(input: AuditLogInput): Promise<void> {
    const data: Prisma.AuditLogUncheckedCreateInput = {
      storeId: input.storeId,
      userId: input.userId ?? null,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
    };

    if (input.oldValue !== undefined) {
      data.oldValue = input.oldValue as Prisma.InputJsonValue;
    }

    if (input.newValue !== undefined) {
      data.newValue = input.newValue as Prisma.InputJsonValue;
    }

    await prisma.auditLog.create({ data });
  }
}

export const auditService = new AuditService();
