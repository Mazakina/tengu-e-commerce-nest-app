import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Order } from '@/domain/enterprise/entities/order';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract update(order: Order): Promise<void>;
  abstract findByID(orderID: string): Promise<Order>;
  abstract findByUserID(userID: string): Promise<Order[]>;
  abstract IdempotencyKeyAlreadyExists(
    idempotencyKey: UniqueEntityID,
  ): Promise<boolean>;
}
