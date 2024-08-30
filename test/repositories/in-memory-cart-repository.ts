import { CartRepository } from '@/domain/application/repositories/cart-repository';
import { Cart } from '@/domain/enterprise/entities/cart';

export class InMemoryCartRepository implements CartRepository {
  public items: Cart[] = [];
  async findByID(id: string): Promise<Cart | null> {
    const index = this.items.findIndex((item) => item.id.toString() === id);

    return this.items[index];
  }
  async findByUserID(userId: string): Promise<Cart | null> {
    const index = this.items.findIndex((item) => item.userId === userId);

    return this.items[index];
  }
  async save(cart: Cart): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(cart.id));

    this.items[index] = cart;
  }
  async clean(cartId: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === cartId);

    this.items[index].clearItems();
  }
  async create(cart: Cart): Promise<void> {
    this.items.push(cart);
  }
}
