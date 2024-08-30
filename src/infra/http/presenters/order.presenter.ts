import { Order } from '@/domain/enterprise/entities/order';

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      id: order.id.toString(),
      items: order.items.map((item) => {
        return {
          id: item.id.toString(),
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        };
      }),
      address: order.address,
      total: order.total,
      status: order.status,
      updatedAt: order.updatedAt,
      createdAt: order.createdAt,
      idempotencyKey: order.idempotencyKey.toString(),
      userId: order.userId,
    };
  }
}
