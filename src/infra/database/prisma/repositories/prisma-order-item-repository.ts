import { OrderItemRepository } from '@/domain/application/repositories/order-item-repository';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';
import { PrismaService } from '../prisma.service';
import { PrismaOrderItemMapper } from '../mapper/prisma-order-item-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaOrderItemRepository implements OrderItemRepository {
  constructor(private prisma: PrismaService) {}
  async create(orderItem: OrderItem): Promise<void> {
    await this.prisma.orderItem.create({
      data: {
        price: orderItem.price,
        id: orderItem.id.toString(),
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        orderId: orderItem.orderId,
      },
    });
  }
  async getOrderItemById(id: string): Promise<OrderItem> {
    const result = await this.prisma.orderItem.findUnique({ where: { id } });
    const orderItem = PrismaOrderItemMapper.toDomain(result);

    return orderItem;
  }
  async fetchOrderItemByOrderId(id: string): Promise<OrderItem[]> {
    const result = await this.prisma.orderItem.findMany({
      where: { orderId: id },
    });

    const orderItems = result.map((orderItem) =>
      PrismaOrderItemMapper.toDomain(orderItem),
    );
    return orderItems;
  }
}
