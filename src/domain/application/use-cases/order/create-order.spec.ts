import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { CreateOrderUseCase } from './create-order';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeOrder } from 'test/factories/make-order';
import { makeProduct } from 'test/factories/make-products';
import { makeOrderItem } from 'test/factories/make-order-item';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryProductsRepository,
    );
  });

  it('should be able to create Order', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
    });

    const order = makeOrder({
      items: [orderItem],
    });

    const itemDetails = order.items.map((item) => {
      return { productId: item.productId, quantity: item.quantity };
    });

    const result = await sut.execute({
      address: order.address,
      idempotencyKey: order.idempotencyKey,
      itemsDetails: itemDetails,
      status: order.status,
      id: order.id.toString(),
      userId: order.userId,
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryOrderRepository.items[0].id.equals(order.id)).toBe(true);
  });
});
