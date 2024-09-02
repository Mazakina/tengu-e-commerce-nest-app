import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository';
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository';
import { makeProduct } from 'test/factories/make-products';
import { makeCustomer } from 'test/factories/make-customer';
import { makeCart } from 'test/factories/make-cart';
import { makeCartItem } from 'test/factories/make-cart-item';
import { randomUUID } from 'crypto';
import { CleanCartUseCase } from './clean-cart';

let inMemoryCartRepository: InMemoryCartRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: CleanCartUseCase;

describe('Clean cart', () => {
  beforeEach(() => {
    inMemoryCartRepository = new InMemoryCartRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new CleanCartUseCase(inMemoryCartRepository);
  });

  it('should be able to clean  Cart', async () => {
    const product = makeProduct();
    const customer = makeCustomer();
    await inMemoryCustomerRepository.create(customer);
    const uuid = randomUUID();
    const cartItem = makeCartItem({
      cartId: uuid,
      productId: product.id.toString(),
      quantity: 2,
    });
    const cart = makeCart({
      userId: customer.id.toString(),
      items: [cartItem],
    });
    await inMemoryCartRepository.create(cart);
    const result = await sut.execute({
      cartId: cart.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryCartRepository.items[0].items.length).toEqual(0);
  });
});
