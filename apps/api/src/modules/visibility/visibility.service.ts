import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../common/errors/app-error';
import { omitUndefined } from '../../common/utils/object';
import { auditService } from '../audit/audit.service';
import { visibilityRepository } from './visibility.repository';

export class VisibilityService {
  public list(storeId: string) {
    return visibilityRepository.list(storeId);
  }

  public async create(
    storeId: string,
    actorUserId: string,
    dto: { fieldName: string; isPublic?: boolean; visibleToStaff?: boolean; visibleToAdminOnly?: boolean },
  ) {
    const existing = await visibilityRepository.findByFieldName(storeId, dto.fieldName);
    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_VISIBILITY_RULE', 'A visibility rule already exists for this field.');
    }

    const rule = await visibilityRepository.create({
      storeId,
      fieldName: dto.fieldName,
      isPublic: dto.isPublic ?? false,
      visibleToStaff: dto.visibleToStaff ?? true,
      visibleToAdminOnly: dto.visibleToAdminOnly ?? false,
    });

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'VisibilityRule',
      entityId: rule.id,
      action: 'CREATE',
      newValue: rule,
    });
    return rule;
  }

  public async update(
    storeId: string,
    ruleId: string,
    actorUserId: string,
    dto: { fieldName?: string; isPublic?: boolean; visibleToStaff?: boolean; visibleToAdminOnly?: boolean },
  ) {
    const current = await visibilityRepository.findById(storeId, ruleId);
    if (!current) {
      throw new AppError(StatusCodes.NOT_FOUND, 'VISIBILITY_RULE_NOT_FOUND', 'Visibility rule not found.');
    }

    if (dto.fieldName && dto.fieldName !== current.fieldName) {
      const existing = await visibilityRepository.findByFieldName(storeId, dto.fieldName);
      if (existing && existing.id !== ruleId) {
        throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_VISIBILITY_RULE', 'A visibility rule already exists for this field.');
      }
    }

    const updated = await visibilityRepository.update(
      ruleId,
      omitUndefined({
        fieldName: dto.fieldName,
        isPublic: dto.isPublic,
        visibleToStaff: dto.visibleToStaff,
        visibleToAdminOnly: dto.visibleToAdminOnly,
      }),
    );

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'VisibilityRule',
      entityId: ruleId,
      action: 'UPDATE',
      oldValue: current,
      newValue: updated,
    });
    return updated;
  }
}

export const visibilityService = new VisibilityService();
