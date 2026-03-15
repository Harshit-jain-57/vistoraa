import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../common/errors/app-error';
import { omitUndefined } from '../../common/utils/object';
import { toSlug } from '../../common/utils/slug';
import { auditService } from '../audit/audit.service';
import { attributeRepository } from './attribute.repository';

export class AttributeService {
  public list(storeId: string) {
    return attributeRepository.list(storeId);
  }

  public async create(
    storeId: string,
    actorUserId: string,
    dto: { name: string; slug?: string; dataType: string; isFilterable?: boolean; isPublic?: boolean },
  ) {
    const slug = dto.slug ? toSlug(dto.slug) : toSlug(dto.name);
    const existing = await attributeRepository.findBySlug(storeId, slug);

    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_ATTRIBUTE_SLUG', 'Attribute slug already exists for this store.');
    }

    const attribute = await attributeRepository.create({
      storeId,
      name: dto.name,
      slug,
      dataType: dto.dataType,
      isFilterable: dto.isFilterable ?? false,
      isPublic: dto.isPublic ?? true,
    });

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'AttributeDefinition',
      entityId: attribute.id,
      action: 'CREATE',
      newValue: attribute,
    });

    return attribute;
  }

  public async update(
    storeId: string,
    attributeId: string,
    actorUserId: string,
    dto: { name?: string; slug?: string; dataType?: string; isFilterable?: boolean; isPublic?: boolean },
  ) {
    const current = await attributeRepository.findById(storeId, attributeId);

    if (!current) {
      throw new AppError(StatusCodes.NOT_FOUND, 'ATTRIBUTE_NOT_FOUND', 'Attribute definition not found.');
    }

    const nextSlug = dto.slug ? toSlug(dto.slug) : dto.name ? toSlug(dto.name) : undefined;

    if (nextSlug && nextSlug !== current.slug) {
      const existing = await attributeRepository.findBySlug(storeId, nextSlug);
      if (existing && existing.id !== attributeId) {
        throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_ATTRIBUTE_SLUG', 'Attribute slug already exists for this store.');
      }
    }

    const updated = await attributeRepository.update(
      attributeId,
      omitUndefined({
        name: dto.name,
        slug: nextSlug,
        dataType: dto.dataType,
        isFilterable: dto.isFilterable,
        isPublic: dto.isPublic,
      }),
    );

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'AttributeDefinition',
      entityId: attributeId,
      action: 'UPDATE',
      oldValue: current,
      newValue: updated,
    });

    return updated;
  }
}

export const attributeService = new AttributeService();
