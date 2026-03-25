import { BaseRepository } from '../../common/database/base.repository';

export class TagRepository extends BaseRepository {
  public list(storeId: string) {
    return this.prisma.tag.findMany({
      where: { storeId },
      orderBy: { name: 'asc' },
    });
  }

  public findById(storeId: string, id: string) {
    return this.prisma.tag.findFirst({
      where: { id, storeId },
    });
  }

  public findBySlug(storeId: string, slug: string) {
    return this.prisma.tag.findFirst({
      where: { storeId, slug },
    });
  }

  public create(input: { storeId: string; name: string; slug: string }) {
    return this.prisma.tag.create({ data: input });
  }

  public update(id: string, data: { name?: string; slug?: string }) {
    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }
}

export const tagRepository = new TagRepository();
