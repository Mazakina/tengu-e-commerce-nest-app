import { OrderRepository } from '@/domain/application/repositories/order-repository';
import { PrismaService } from '../prisma.service';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Order } from '@/domain/enterprise/entities/order';
import { PrismaOrderMapper } from '../mapper/prisma-order-mapper';
import { Injectable } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}
  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPersistence(order);

    await this.prisma.order.create({ data });

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async findByID(orderID: string): Promise<Order> {
    const data = await this.prisma.order.findUnique({
      where: { id: orderID },
      include: { OrderItem: true },
    });

    const order = PrismaOrderMapper.ToDomain(data);

    return order;
  }

  async findByUserID(userId: string): Promise<Order[]> {
    const data = await this.prisma.order.findMany({
      where: { userId },
      include: { OrderItem: true },
    });
    const order = data.map((order) => {
      return PrismaOrderMapper.ToDomain(order);
    });

    return order;
  }

  async update(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPersistence(order);

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    });
    if (order.status === 'cancelled') {
      DomainEvents.dispatchEventsForAggregate(order.id);
    }
  }

  async IdempotencyKeyAlreadyExists(
    idempotencyKey: UniqueEntityID,
  ): Promise<boolean> {
    const order = await this.prisma.order.findUnique({
      where: { idempotencyKey: idempotencyKey.toString() },
    });

    if (order) {
      return true;
    }

    return false;
  }
}
