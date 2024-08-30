import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { CartItem } from '@/domain/enterprise/entities/cartItem';
import { CartItem as PrismaCartItem, Prisma } from '@prisma/client';

export class PrismaCartItemMapper {
  static toPersistance(
    cartItem: CartItem,
  ): Prisma.CartItemUncheckedCreateInput {
    return {
      id: cartItem.id.toString(),
      cartId: cartItem.cartId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    };
  }

  static toDomain(data: PrismaCartItem): CartItem {
    const cartItem = CartItem.create(
      {
        cartId: data.cartId,
        productId: data.productId,
        quantity: data.quantity,
      },
      new UniqueEntityID(data.id),
    );
    return cartItem;
  }
}
