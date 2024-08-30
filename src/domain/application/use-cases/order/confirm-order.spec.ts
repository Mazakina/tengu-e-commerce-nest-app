import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeOrder } from 'test/factories/make-order';
import { makeProduct } from 'test/factories/make-products';
import { makeOrderItem } from 'test/factories/make-order-item';
import { OrderStatus } from '@/domain/enterprise/entities/order';
import { ConfirmOrderUseCase } from './confirm-order';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: ConfirmOrderUseCase;

describe('confirm Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new ConfirmOrderUseCase(
      inMemoryOrderRepository,
      inMemoryProductsRepository,
    );
  });

  it('should be able to confirm Order', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
    });

    const order = makeOrder({
      items: [orderItem],
      status: OrderStatus.pending,
    });
    inMemoryOrderRepository.create(order);

    const result = await sut.execute({ orderId: order.id.toString() });
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.order.status).toBe(OrderStatus.confirmed);
    }
  });
  it('should be able to confirm Order only if pending', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
    });

    const order = makeOrder({
      items: [orderItem],
      status: OrderStatus.delivered,
    });
    inMemoryOrderRepository.create(order);

    const result = await sut.execute({ orderId: order.id.toString() });

    expect(result.isRight()).toBe(false);
    expect(inMemoryOrderRepository.items[0].status).toBe(OrderStatus.delivered);
  });

  it('shouldn`t be able to confirm Order if not enough stock', async () => {
    const product = makeProduct({ stock: 10 });
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
      quantity: 11,
    });

    const order = makeOrder({
      items: [orderItem],
      status: OrderStatus.pending,
    });
    inMemoryOrderRepository.create(order);

    const result = await sut.execute({ orderId: order.id.toString() });

    expect(result.isRight()).toBe(false);
    expect(inMemoryOrderRepository.items[0].status).toBe(OrderStatus.pending);
  });
});
