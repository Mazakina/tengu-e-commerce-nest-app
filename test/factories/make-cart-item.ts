import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { CartItem, CartItemProps } from '@/domain/enterprise/entities/cartItem';
import { PrismaCartItemMapper } from '@/infra/database/prisma/mapper/prisma-cart-item-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeCartItem(
  override: Partial<CartItemProps> = {},
  id?: UniqueEntityID,
) {
  const cart = CartItem.create(
    {
      productId: faker.string.uuid(),
      quantity: faker.number.int(),
      cartId: faker.string.uuid(),
      ...override,
    },
    id,
  );

  return cart;
}

@Injectable()
export class CartItemFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCartItem(
    props: Partial<CartItemProps>,
    id?: UniqueEntityID,
  ): Promise<CartItem> {
    const cartItem = makeCartItem(props, id);

    await this.prisma.cartItem.create({
      data: PrismaCartItemMapper.toPersistance(cartItem),
    });

    return cartItem;
  }
}
