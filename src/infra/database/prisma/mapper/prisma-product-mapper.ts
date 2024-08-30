import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Product } from '@/domain/enterprise/entities/product';
import { Prisma } from '@prisma/client';

type sizesEnum = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

export class PrismaProductMapper {
  static toPersistence(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      collections: product.collections,
      models: product.models,
      sizes: product.sizes,
    };
  }
  static toDomain(raw: Prisma.ProductUncheckedCreateInput): Product {
    const product = Product.create(
      {
        name: raw.name,
        description: raw.description,
        price: raw.price,
        stock: raw.stock,
        collections: raw.collections as string[],
        models: raw.models as string[],
        sizes: raw.sizes as sizesEnum[],
      },
      new UniqueEntityID(raw.id),
    );
    return product;
  }
}
