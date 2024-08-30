import { InMemoryOrderItemRepository } from 'test/repositories/in-memory-order-item-repository';
import { makeOrderItem } from 'test/factories/make-order-item';
import { FetchOrderItemByOrderIdUseCase } from './fetch-order-item-by-order-id';

let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let sut: FetchOrderItemByOrderIdUseCase;

describe('Get order item', () => {
  beforeEach(() => {
    inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
    sut = new FetchOrderItemByOrderIdUseCase(inMemoryOrderItemRepository);
  });
  it('should get a order item', async () => {
    for (let i = 1; i <= 13; i++) {
      inMemoryOrderItemRepository.create(
        makeOrderItem({
          orderId: 'testing',
        }),
      );
    }
    for (let i = 1; i <= 10; i++) {
      inMemoryOrderItemRepository.create(
        makeOrderItem({
          orderId: 'something_else',
        }),
      );
    }
    const result = await sut.execute('testing');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.orderItems.length).toEqual(13);
    }
  });
});
