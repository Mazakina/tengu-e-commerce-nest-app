import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Cart } from '@/domain/enterprise/entities/cart';
import { CartItem } from '@/domain/enterprise/entities/cartItem';
import {
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
  Prisma,
} from '@prisma/client';

type PrismaCartDetails = PrismaCart & {
  CartItem?: PrismaCartItem[];
};

export class PrismaCartMapper {
  static toPersistence(cart: Cart): Prisma.CartUncheckedCreateInput {
    return {
      id: cart.id.toString(),
      CartItem: {
        create: cart.items?.map((item) => {
          return {
            id: item.id.toString(),
            productId: item.productId,
            quantity: item.quantity,
          };
        }),
      },
      status: cart.status,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      userId: cart.userId,
    };
  }
  static toDomain(raw: PrismaCartDetails): Cart {
    const cartItems = raw.CartItem?.map((item) =>
      CartItem.create(
        {
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
        },
        new UniqueEntityID(item.id),
      ),
    );
    const cart = Cart.create(
      {
        items: cartItems,
        userId: raw.userId,
        status: raw.status,
        updatedAt: new Date(raw.updatedAt),
        createdAt: new Date(raw.createdAt),
      },
      new UniqueEntityID(raw.id),
    );
    return cart;
  }
}
