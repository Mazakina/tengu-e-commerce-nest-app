import { InMemoryOrderItemRepository } from 'test/repositories/in-memory-order-item-repository';
import { makeOrderItem } from 'test/factories/make-order-item';
import { GetOrderItemByIdUseCase } from './get-order-item-by-id';

let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let sut: GetOrderItemByIdUseCase;

describe('Get order item', () => {
  beforeEach(() => {
    inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
    sut = new GetOrderItemByIdUseCase(inMemoryOrderItemRepository);
  });
  it('should get a order item', async () => {
    const orderItem = makeOrderItem();
    inMemoryOrderItemRepository.create(orderItem);
    const result = await sut.execute(orderItem.id.toString());

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({ orderItem: orderItem });
  });
});
