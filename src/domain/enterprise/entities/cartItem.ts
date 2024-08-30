import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Entity } from 'src/core/primitives/entities';

export interface CartItemProps {
  productId: string;
  quantity: number;
  cartId: string;
}

export class CartItem extends Entity<CartItemProps> {
  static create(props: CartItemProps, id?: UniqueEntityID) {
    const cartItem = new CartItem(
      {
        ...props,
      },
      id,
    );

    return cartItem;
  }

  get productId() {
    return this.props.productId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  set quantity(value: number) {
    this.props.quantity = value;
  }

  get cartId() {
    return this.props.cartId;
  }
}
