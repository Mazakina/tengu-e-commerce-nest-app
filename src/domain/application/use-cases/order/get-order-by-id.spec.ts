import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeOrder } from 'test/factories/make-order';
import { makeProduct } from 'test/factories/make-products';
import { makeOrderItem } from 'test/factories/make-order-item';
import { GetOrderByIDUseCase } from './get-order-by-id';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: GetOrderByIDUseCase;

describe('Get Order By ID', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new GetOrderByIDUseCase(inMemoryOrderRepository);
  });

  it('should be able to get Order', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
    });

    const order = makeOrder({
      items: [orderItem],
    });

    inMemoryOrderRepository.create(makeOrder({ items: [orderItem] }));

    inMemoryOrderRepository.create(order);

    const result = await sut.execute(order.id.toString());
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(
        inMemoryOrderRepository.items[1].id.equals(result.value.order.id),
      ).toBe(true);
    }
  });
});
