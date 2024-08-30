import { CartItem } from '@/domain/enterprise/entities/cartItem';

export abstract class CartItemRepository {
  abstract create(cartItem: CartItem): Promise<void>;
  abstract update(cartItem: CartItem): Promise<void>;
  abstract get(id: string): Promise<CartItem>;
  abstract delete(id: string): Promise<void>;
}
