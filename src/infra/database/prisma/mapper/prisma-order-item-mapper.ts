import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';
import { Prisma, OrderItem as PrismaOrderItem } from '@prisma/client';

export class PrismaOrderItemMapper {
  static toPersistence(
    orderItem: OrderItem,
  ): Prisma.OrderItemUncheckedCreateInput {
    return {
      id: orderItem.id.toString(),
      orderId: orderItem.orderId,
      price: orderItem.price,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
    };
  }
  static toDomain(data: PrismaOrderItem): OrderItem {
    const orderItem = OrderItem.create(
      {
        orderId: data.orderId,
        price: data.price,
        productId: data.productId,
        quantity: data.quantity,
      },
      new UniqueEntityID(data.id),
    );

    return orderItem;
  }
}
