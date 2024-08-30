import { InMemoryOrderItemRepository } from 'test/repositories/in-memory-order-item-repository';
import { CreateOrderItemUseCase } from './create-order-item';
import { makeOrderItem } from 'test/factories/make-order-item';

let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let sut: CreateOrderItemUseCase;

describe('Create order item', () => {
  beforeEach(() => {
    inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
    sut = new CreateOrderItemUseCase(inMemoryOrderItemRepository);
  });
  it('should Create an order item', async () => {
    const orderItem = makeOrderItem();
    const result = await sut.execute(orderItem);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(
        inMemoryOrderItemRepository.items[0].id.equals(
          result.value.orderItem.id,
        ),
      ).toBe(true);
    }
  });
});
