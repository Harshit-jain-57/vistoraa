import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../common/errors/app-error';
import { omitUndefined } from '../../common/utils/object';
import { toSlug } from '../../common/utils/slug';
import { auditService } from '../audit/audit.service';
import { tagRepository } from './tag.repository';

export class TagService {
  public list(storeId: string) {
    return tagRepository.list(storeId);
  }

  public async create(storeId: string, actorUserId: string, dto: { name: string; slug?: string }) {
    const slug = dto.slug ? toSlug(dto.slug) : toSlug(dto.name);
    const existing = await tagRepository.findBySlug(storeId, slug);

    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_TAG_SLUG', 'Tag slug already exists for this store.');
    }

    const tag = await tagRepository.create({ storeId, name: dto.name, slug });
    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'Tag',
      entityId: tag.id,
      action: 'CREATE',
      newValue: tag,
    });
    return tag;
  }

  public async update(storeId: string, tagId: string, actorUserId: string, dto: { name?: string; slug?: string }) {
    const current = await tagRepository.findById(storeId, tagId);

    if (!current) {
      throw new AppError(StatusCodes.NOT_FOUND, 'TAG_NOT_FOUND', 'Tag not found.');
    }

    const nextSlug = dto.slug ? toSlug(dto.slug) : dto.name ? toSlug(dto.name) : undefined;

    if (nextSlug && nextSlug !== current.slug) {
      const existing = await tagRepository.findBySlug(storeId, nextSlug);
      if (existing && existing.id !== tagId) {
        throw new AppError(StatusCodes.CONFLICT, 'DUPLICATE_TAG_SLUG', 'Tag slug already exists for this store.');
      }
    }

    const updated = await tagRepository.update(
      tagId,
      omitUndefined({
        name: dto.name,
        slug: nextSlug,
      }),
    );

    await auditService.log({
      storeId,
      userId: actorUserId,
      entityType: 'Tag',
      entityId: tagId,
      action: 'UPDATE',
      oldValue: current,
      newValue: updated,
    });
    return updated;
  }
}

export const tagService = new TagService();
