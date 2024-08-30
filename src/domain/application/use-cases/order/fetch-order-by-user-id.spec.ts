import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeOrder } from 'test/factories/make-order';
import { makeProduct } from 'test/factories/make-products';
import { makeOrderItem } from 'test/factories/make-order-item';
import { FetchOrderByUserIDUseCase } from './fetch-order-by-user-id';
import { makeCustomer } from 'test/factories/make-customer';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;

let sut: FetchOrderByUserIDUseCase;

describe('Fetch order by user ID', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new FetchOrderByUserIDUseCase(inMemoryOrderRepository);
  });

  it('should be able to get Fetch order by user', async () => {
    const customer = makeCustomer();

    for (let i = 1; i <= 10; i++) {
      const product = makeProduct();
      inMemoryProductsRepository.create(product);

      const orderItem = makeOrderItem({
        productId: product.id.toString(),
      });
      inMemoryOrderRepository.create(
        makeOrder({
          items: [orderItem],
          userId: customer.id.toString(),
        }),
      );
    }
    for (let i = 0; i < 5; i++) {
      const product = makeProduct();
      inMemoryProductsRepository.create(product);

      const orderItem = makeOrderItem({
        productId: product.id.toString(),
      });
      inMemoryOrderRepository.create(
        makeOrder({
          items: [orderItem],
        }),
      );
    }
    const result = await sut.execute(customer.id.toString());

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) {
      return;
    }
    expect(result.value.orders.length).toBe(10);
    expect(result.value.orders[0].userId).toEqual(customer.id.toString());
  });
});
