import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Order, OrderStatus } from '@/domain/enterprise/entities/order';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Prisma,
} from '@prisma/client';

type PrismaOrderDetails = PrismaOrder & {
  OrderItem: PrismaOrderItem[];
};

export class PrismaOrderMapper {
  static toPersistence(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      total: order.total,
      status: order.status,
      updatedAt: order.updatedAt,
      createdAt: order.createdAt,
      idempotencyKey: order.idempotencyKey.toString(),
      address: order.address,
      userId: order.userId,
      OrderItem: {
        connectOrCreate: order.items.map((item) => {
          return {
            where: { id: item.id.toString() },
            create: {
              id: item.id.toString(),
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            },
          };
        }),
      },
    };
  }

  static ToDomain(prismaOrder: PrismaOrderDetails): Order {
    const orderItems = prismaOrder.OrderItem.map((item) => {
      return OrderItem.create(
        {
          price: item.price,
          orderId: item.orderId,
          productId: item.productId,
          quantity: item.quantity,
        },
        new UniqueEntityID(item.id),
      );
    });
    const order = Order.create(
      {
        idempotencyKey: new UniqueEntityID(prismaOrder.idempotencyKey),
        items: orderItems,
        createdAt: prismaOrder.createdAt,
        status: OrderStatus[prismaOrder.status],
        total: prismaOrder.total,
        updatedAt: prismaOrder.updatedAt,
        address: prismaOrder.address,
        userId: prismaOrder.userId,
      },
      new UniqueEntityID(prismaOrder.id),
    );

    return order;
  }
}
