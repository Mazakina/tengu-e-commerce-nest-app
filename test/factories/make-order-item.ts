import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import {
  OrderItem,
  OrderItemProps,
} from '@/domain/enterprise/entities/orderItem';
import { PrismaOrderItemMapper } from '@/infra/database/prisma/mapper/prisma-order-item-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeOrderItem(
  override?: Partial<OrderItemProps>,
  id?: UniqueEntityID,
) {
  const orderItem = OrderItem.create(
    {
      orderId: faker.lorem.slug({ min: 10, max: 15 }),
      price: faker.number.int({ min: 1000, max: 30000 }),
      productId: faker.lorem.slug({ min: 10, max: 15 }),
      quantity: faker.number.int({ min: 1, max: 3 }),
      ...override,
    },
    id,
  );

  return orderItem;
}

@Injectable()
export class OrderItemFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrderItem(
    data: Partial<OrderItemProps> = {},
  ): Promise<OrderItem> {
    const orderItem = makeOrderItem(data);

    await this.prisma.orderItem.create({
      data: PrismaOrderItemMapper.toPersistence(orderItem),
    });

    return orderItem;
  }
}
