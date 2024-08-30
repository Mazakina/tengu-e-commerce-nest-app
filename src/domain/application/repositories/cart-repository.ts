import { Cart } from '@/domain/enterprise/entities/cart';

export abstract class CartRepository {
  abstract findByID(id: string): Promise<Cart | null>;
  abstract findByUserID(userId: string): Promise<Cart | null>;
  abstract save(cart: Cart): Promise<void>;
  abstract clean(cartId: string): Promise<void>;
  abstract create(cart: Cart): Promise<void>;
}
