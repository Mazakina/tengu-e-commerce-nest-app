import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeOrder } from 'test/factories/make-order';
import { makeProduct } from 'test/factories/make-products';
import { makeOrderItem } from 'test/factories/make-order-item';
import { OrderStatus } from '@/domain/enterprise/entities/order';
import { ModifyOrderUseCase } from './modify-order-details';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: ModifyOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new ModifyOrderUseCase(inMemoryOrderRepository);
  });

  it('should be able to ship Order', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
    });
    const secondProduct = makeProduct();
    inMemoryProductsRepository.create(secondProduct);

    const secondOrderItem = makeOrderItem({
      productId: secondProduct.id.toString(),
    });
    const order = makeOrder({
      items: [orderItem],
    });
    inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      id: order.id.toString(),
      items: [secondOrderItem],
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryOrderRepository.items[0].items[0]).toBe(secondOrderItem);
  });

  it('shouldn`t be able to modify Order if cancelled or shipped confirmed', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
    });
    const secondProduct = makeProduct();
    inMemoryProductsRepository.create(secondProduct);

    const secondOrderItem = makeOrderItem({
      productId: secondProduct.id.toString(),
    });
    const order = makeOrder({
      items: [orderItem],
      status: OrderStatus.cancelled,
    });
    inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      id: order.id.toString(),
      items: [secondOrderItem],
    });
    expect(result.isRight()).toBe(false);
  });
});
