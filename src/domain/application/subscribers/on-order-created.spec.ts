import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import {
  SubtractStockUseCase,
  SubtractStockUseCaseRequest,
  SubtractStockUseCaseResponse,
} from '../use-cases/product/subtract-stock';
import { MockInstance, vi } from 'vitest';
import { makeProduct } from 'test/factories/make-products';
import { makeOrder } from 'test/factories/make-order';
import { randomUUID } from 'crypto';
import { makeOrderItem } from 'test/factories/make-order-item';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { waitFor } from 'test/utils/wait-for';
import { OnOrderCreated } from './on-order-created';

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let subtractProductUseCase: SubtractStockUseCase;
let subtractProductExecuteSpy: MockInstance<
  [SubtractStockUseCaseRequest],
  Promise<SubtractStockUseCaseResponse>
>;
describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    subtractProductUseCase = new SubtractStockUseCase(
      inMemoryProductsRepository,
    );

    subtractProductExecuteSpy = vi.spyOn(subtractProductUseCase, 'execute');
    new OnOrderCreated(inMemoryProductsRepository, subtractProductUseCase);
  });

  it('should subtract stock when an order is created', async () => {
    const product = makeProduct({ stock: 30 });
    const { id: productId, price } = product;
    const uuid = randomUUID();
    const orderItem = makeOrderItem({
      orderId: uuid,
      price,
      productId: productId.toString(),
    });

    const order = makeOrder({
      items: [orderItem],
    });
    await inMemoryProductsRepository.create(product);
    await inMemoryOrderRepository.create(order);

    await waitFor(() => {
      expect(subtractProductExecuteSpy).toHaveBeenCalled();
    });
  });
});
