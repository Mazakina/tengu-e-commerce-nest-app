import { CartItemRepository } from '@/domain/application/repositories/cart-item-repository';
import { CartItem } from '@/domain/enterprise/entities/cartItem';

export class InMemoryCartItemRepository implements CartItemRepository {
  public items: CartItem[] = [];
  async create(cartItem: CartItem): Promise<void> {
    this.items.push(cartItem);
    return;
  }

  async update(cartItem: CartItem): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(cartItem.id));

    this.items[index] = cartItem;
  }
  async get(id: string): Promise<CartItem> {
    const cartItem = this.items.find(
      (cartItem) => cartItem.id.toString() === id,
    );

    return cartItem;
  }
  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id);
    this.items.splice(index, 1);
  }
}
