import { Entity } from '@/core/primitives/entities';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CartItem } from './cartItem';

export interface CartProps {
  items: CartItem[];
  status: 'active' | 'abandoned' | 'checked_out';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export class Cart extends Entity<CartProps> {
  static create(
    props: Optional<CartProps, 'status' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const cart = new Cart(
      {
        ...props,
        status: 'active',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return cart;
  }

  update() {
    this.props.updatedAt = new Date();
  }

  get items() {
    return this.props.items;
  }
  get status() {
    return this.props.status;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get userId() {
    return this.props.userId;
  }

  addItems(item: CartItem) {
    const alreadyExists = this.props.items.findIndex(
      (value) => item.productId === value.productId,
    );
    if (alreadyExists !== -1) {
      this.items[alreadyExists].quantity += item.quantity;
    } else {
      this.props.items.push(item);
    }
    this.update();
  }

  removeItems(itemId: string) {
    this.props.items.filter((item) => item.id.toString() !== itemId);
    this.update();
  }

  clearItems() {
    this.props.items = [];
    this.update();
  }
}
