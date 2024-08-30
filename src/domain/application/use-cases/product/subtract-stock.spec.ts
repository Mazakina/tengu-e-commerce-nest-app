import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { SubtractStockUseCase } from './subtract-stock';
import { makeProduct } from 'test/factories/make-products';

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: SubtractStockUseCase;

describe('Subtract Stocks', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new SubtractStockUseCase(inMemoryProductsRepository);
  });

  it('should subtract stock', async () => {
    const product = makeProduct();
    const ExpectedStock = product.stock - 2;
    console.log(product.stock);
    await inMemoryProductsRepository.create(product);
    const result = await sut.execute({
      productId: product.id.toString(),
      valuetoSubtract: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items[0].id.equals(product.id)).toBe(
      true,
    );
    expect(inMemoryProductsRepository.items[0].stock).toEqual(ExpectedStock);
  });

  it('should not subtract stock if there isn`t enough stock', async () => {
    const product = makeProduct();
    const originalStock = product.stock;
    const overStockValue = product.stock + 2;

    await inMemoryProductsRepository.create(product);
    const result = await sut.execute({
      productId: product.id.toString(),
      valuetoSubtract: overStockValue,
    });

    expect(result.isLeft()).toBe(true);
    expect(inMemoryProductsRepository.items[0].stock).toEqual(originalStock);
  });

  it('should not subtract from the wrong item', async () => {
    const product = makeProduct();
    const productTwo = makeProduct();

    const originalStock = productTwo.stock;
    const newStockValue = product.stock - 2;

    await inMemoryProductsRepository.create(product);
    await inMemoryProductsRepository.create(productTwo);
    const result = await sut.execute({
      productId: product.id.toString(),
      valuetoSubtract: newStockValue,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items[1].stock).toEqual(originalStock);
  });
});
