import { AggregateRoot } from 'src/core/primitives/aggregated-root';
import { UniqueEntityID } from 'src/core/primitives/unique-entity-id';
import { OrderItem } from './orderItem';
import { Optional } from '@prisma/client/runtime/library';
import { OnOrderCreatedEvent } from '../events/on-order-created-event';
import { OnOrderCancelledEvent } from '../events/on-order-cancelled-event';

export enum OrderStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled',
}

export interface OrderProps {
  items: OrderItem[];
  address: string;
  total?: number;
  status?: OrderStatus;
  updatedAt?: Date;
  createdAt?: Date;
  idempotencyKey: UniqueEntityID;
  userId: string;
}

export class Order extends AggregateRoot<OrderProps> {
  static create(
    props: Optional<OrderProps, 'updatedAt' | 'status' | 'createdAt' | 'total'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        updatedAt: props.updatedAt ?? new Date(),
        status: props.status ?? OrderStatus.pending,
        createdAt: props.createdAt ?? new Date(),
        total: 0,
      },
      id,
    );
    order.calculateTotal();
    // to test
    order.addDomainEvent(new OnOrderCreatedEvent(order.items));
    console.log('log:', order.domainEvents);
    return order;
  }

  get items() {
    return this.props.items;
  }

  get idempotencyKey(): UniqueEntityID {
    return this.props.idempotencyKey;
  }

  set items(items: OrderItem[]) {
    this.props.items = items;
    this.calculateTotal();
  }

  get address() {
    return this.props.address;
  }

  set address(address: string) {
    this.props.address = address;
  }

  get status() {
    return this.props.status;
  }

  get userId() {
    return this.props.userId;
  }

  update() {
    this.props.updatedAt = new Date();
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private calculateTotal(): void {
    this.props.total = this.props.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  get total() {
    return this.props.total;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  confirmOrder(): void {
    if (this.props.status !== OrderStatus.pending) {
      throw new Error('Only pending orders can be confirmed.');
    }
    this.props.status = OrderStatus.confirmed;
    this.update();
  }

  shipOrder(): void {
    if (this.props.status !== OrderStatus.confirmed) {
      throw new Error('Only confirmed orders can be shipped.');
    }
    this.props.status = OrderStatus.shipped;
    this.update();
  }

  deliverOrder(): void {
    if (this.props.status !== OrderStatus.shipped) {
      throw new Error('Only shipped orders can be delivered.');
    }
    this.props.status = OrderStatus.delivered;
    this.update();
  }

  cancelOrder(): void {
    this.props.status = OrderStatus.cancelled;
    this.update();
    this.addDomainEvent(new OnOrderCancelledEvent(this.items));
  }
}
