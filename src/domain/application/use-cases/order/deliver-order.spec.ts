import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeOrder } from 'test/factories/make-order';
import { makeProduct } from 'test/factories/make-products';
import { makeOrderItem } from 'test/factories/make-order-item';
import { OrderStatus } from '@/domain/enterprise/entities/order';
import { DeliverOrderUseCase } from './deliver-order';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: DeliverOrderUseCase;

describe('Deliver Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new DeliverOrderUseCase(inMemoryOrderRepository);
  });

  it('should be able to Deliver Order', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
    });

    const order = makeOrder({
      items: [orderItem],
      status: OrderStatus.shipped,
    });
    inMemoryOrderRepository.create(order);

    const result = await sut.execute(order.id.toString());
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.order.status).toBe(OrderStatus.delivered);
    }
  });
  it('should be able to deliver Order only if shipped', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
    });

    const order = makeOrder({
      items: [orderItem],
      status: OrderStatus.cancelled,
    });
    inMemoryOrderRepository.create(order);

    const result = await sut.execute(order.id.toString());
    expect(result.isRight()).toBe(false);
    expect(inMemoryOrderRepository.items[0].status).toBe(OrderStatus.cancelled);
  });
});
