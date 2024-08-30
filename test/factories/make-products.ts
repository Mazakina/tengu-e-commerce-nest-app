import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Product, ProductsProps } from '@/domain/enterprise/entities/product';
import { PrismaProductMapper } from '@/infra/database/prisma/mapper/prisma-product-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeProduct(
  override: Partial<ProductsProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      sizes: ['l'],
      description: faker.lorem.lines(1),
      name: faker.person.fullName(),
      price: faker.number.int({ max: 20000 }),
      stock: faker.number.int({ min: 20, max: 50 }),
      ...override,
    },
    id,
  );

  return product;
}

@Injectable()
export class ProductFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProduct(data: Partial<ProductsProps> = {}): Promise<Product> {
    const product = makeProduct(data);

    await this.prisma.product.create({
      data: PrismaProductMapper.toPersistence(product),
    });

    return product;
  }
}
