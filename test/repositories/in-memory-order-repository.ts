import { DomainEvents } from '@/core/events/domain-events';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { OrderRepository } from '@/domain/application/repositories/order-repository';
import { Order } from '@/domain/enterprise/entities/order';

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];
  async create(order: Order): Promise<void> {
    this.items.push(order);
    DomainEvents.dispatchEventsForAggregate(order.id);
  }
  async update(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(order.id));
    this.items[index] = order;
    if (order.status === 'cancelled') {
      DomainEvents.dispatchEventsForAggregate(order.id);
    }
  }
  async findByID(orderID: string): Promise<Order> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === orderID,
    );

    return this.items[index];
  }
  async findByUserID(userID: string): Promise<Order[]> {
    const orders = this.items.filter((item) => item.userId === userID);

    return orders;
  }
  async IdempotencyKeyAlreadyExists(
    idempotencyKey: UniqueEntityID,
  ): Promise<boolean> {
    const index = this.items.findIndex((item) =>
      item.idempotencyKey.equals(idempotencyKey),
    );
    if (index >= 0) {
      return true;
    }
    return false;
  }
}
