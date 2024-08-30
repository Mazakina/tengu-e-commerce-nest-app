import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Entity } from 'src/core/primitives/entities';

export interface OrderItemProps {
  productId: string;
  quantity: number;
  price: number;
  orderId: string;
}

export class OrderItem extends Entity<OrderItemProps> {
  static create(props: OrderItemProps, id?: UniqueEntityID) {
    const orderItem = new OrderItem(
      {
        ...props,
      },
      id,
    );

    return orderItem;
  }

  get total(): number {
    const total = this.props.quantity * this.props.price;
    const formatedTotal = Number(
      new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(total),
    );
    return formatedTotal;
  }

  get price() {
    return this.props.price;
  }

  get orderId() {
    return this.props.orderId;
  }
  get productId() {
    return this.props.productId;
  }
  get quantity(): number {
    return this.props.quantity;
  }
}
