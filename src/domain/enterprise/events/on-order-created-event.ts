import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { OrderItem } from '../entities/orderItem';
import { DomainEvent } from '@/core/events/domain-event';

export class OnOrderCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public orderItems: OrderItem[];
  public orderId: UniqueEntityID;

  constructor(orderItems: OrderItem[]) {
    this.orderItems = orderItems;
    this.ocurredAt = new Date();
    this.orderId = new UniqueEntityID(orderItems[0].orderId);
  }

  getAggregatedID(): UniqueEntityID {
    return this.orderId;
  }
}
