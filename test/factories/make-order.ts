import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Order, OrderProps } from '@/domain/enterprise/entities/order';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaOrderMapper } from '@/infra/database/prisma/mapper/prisma-order-mapper';

export function makeOrder(override?: Partial<OrderProps>, id?: UniqueEntityID) {
  const order = Order.create(
    {
      address: faker.lorem.lines(1),
      idempotencyKey: new UniqueEntityID(),
      updatedAt: new Date(),
      createdAt: new Date(),
      userId: faker.lorem.slug(),
      items: [],
      ...override,
    },
    id,
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(
    props?: Partial<OrderProps>,
    id?: UniqueEntityID,
  ): Promise<Order> {
    const order = makeOrder(props, id);
    const data = PrismaOrderMapper.toPersistence(order);
    await this.prisma.order.create({
      data,
    });

    return order;
  }
}
