import { RemoveItemFromCartUseCase } from './remove-item-from-cart';
import { CartItem } from '@/domain/enterprise/entities/cartItem';
import { InMemoryCartItemRepository } from 'test/repositories/in-memory-cart-item-repository';

let inMemoryCartItemRepository: InMemoryCartItemRepository;
let sut: RemoveItemFromCartUseCase;

describe('remove item from cart', () => {
  beforeEach(() => {
    inMemoryCartItemRepository = new InMemoryCartItemRepository();
    sut = new RemoveItemFromCartUseCase(inMemoryCartItemRepository);
  });

  it('should remove item from cart', async () => {
    const cartItem = CartItem.create({
      productId: 'string_one',
      quantity: 8,
      cartId: 'string__2',
    });
    const secondCartItem = CartItem.create({
      productId: 'string_two',
      quantity: 8,
      cartId: 'string__2',
    });

    inMemoryCartItemRepository.create(cartItem);
    inMemoryCartItemRepository.create(secondCartItem);

    const result = await sut.execute({
      cartItemId: secondCartItem.id.toString(),
    });

    expect(result.isRight()).toBe(true);
  });
});
