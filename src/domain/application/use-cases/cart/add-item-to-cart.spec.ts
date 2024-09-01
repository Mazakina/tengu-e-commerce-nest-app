import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository';
import { AddItemToCartUseCase } from './add-item-to-cart';
import { InMemoryCartItemRepository } from 'test/repositories/in-memory-cart-item-repository';
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository';
import { makeProduct } from 'test/factories/make-products';
import { makeCustomer } from 'test/factories/make-customer';
import { makeCart } from 'test/factories/make-cart';
import { makeCartItem } from 'test/factories/make-cart-item';
import { randomUUID } from 'crypto';

let inMemoryCartRepository: InMemoryCartRepository;
let inMemoryCartItemRepository: InMemoryCartItemRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: AddItemToCartUseCase;

describe('Add item to cart', () => {
  beforeEach(() => {
    inMemoryCartRepository = new InMemoryCartRepository();
    inMemoryCartItemRepository = new InMemoryCartItemRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new AddItemToCartUseCase(
      inMemoryCartRepository,
      inMemoryCustomerRepository,
      inMemoryCartItemRepository,
    );
  });

  it('should be able to add item to Cart', async () => {
    const product = makeProduct();
    const customer = makeCustomer();
    await inMemoryCustomerRepository.create(customer);
    const cart = makeCart({ userId: customer.id.toString(), items: [] });
    await inMemoryCartRepository.create(cart);

    const result = await sut.execute({
      productId: product.id.toString(),
      quantity: 2,
      userId: customer.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryCartRepository.items[0].items.length).toEqual(1);
    expect(inMemoryCartRepository.items[0].items[0]).toEqual(
      expect.objectContaining({
        productId: product.id.toString(),
        quantity: 2,
      }),
    );
  });
  it('should add quantity if cart has the same product', async () => {
    const product = makeProduct();
    const customer = makeCustomer();
    const uuid = randomUUID();
    await inMemoryCustomerRepository.create(customer);
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
      productId: product.id.toString(),
      quantity: 2,
      userId: customer.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();

    expect(inMemoryCartRepository.items[0].items[0]).toEqual(
      expect.objectContaining({
        productId: product.id.toString(),
        quantity: 4,
      }),
    );
  });
});
