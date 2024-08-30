import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Cart, CartProps } from '@/domain/enterprise/entities/cart';
import { PrismaCartMapper } from '@/infra/database/prisma/mapper/prisma-cart-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeCart(override?: Partial<CartProps>, id?: UniqueEntityID) {
  const cart = Cart.create(
    {
      items: [],
      userId: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      ...override,
    },
    id,
  );

  return cart;
}

@Injectable()
export class CartFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCart(
    props: Partial<CartProps> = {},
    id?: UniqueEntityID,
  ): Promise<Cart> {
    const cart = makeCart(props, id);
    await this.prisma.cart.create({
      data: PrismaCartMapper.toPersistence(cart),
    });
    return cart;
  }
}
