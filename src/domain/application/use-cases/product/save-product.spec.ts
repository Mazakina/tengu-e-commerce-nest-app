import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeProduct } from 'test/factories/make-products';
import { SaveProductUseCase } from './save-product';
import { BadRequestException } from '@nestjs/common';

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: SaveProductUseCase;

describe('Save Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new SaveProductUseCase(inMemoryProductsRepository);
  });

  it('should update a product', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    product.description = 'New description.';
    const result = await sut.execute({
      id: product.id.toString(),
      description: product.description,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items[0].description).toEqual(
      'New description.',
    );
    expect(inMemoryProductsRepository.items[0]).toEqual(product);
  });

  it('shouldn`t be able to update a negative stock', async () => {
    const product = makeProduct();
    const invalidStock = -10;
    product.stock = invalidStock;
    await inMemoryProductsRepository.create(product);
    const result = await sut.execute({
      id: product.id.toString(),
      stock: invalidStock,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect(inMemoryProductsRepository.items[0].stock > 0).toBe(true);
  });

  it('should not update the wrong product', async () => {
    const product = makeProduct();
    const productTwo = makeProduct();

    await inMemoryProductsRepository.create(product);
    await inMemoryProductsRepository.create(productTwo);
    const result = await sut.execute({
      id: product.id.toString(),
      description: 'New description.',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items[1].description).not.toEqual(
      'New description.',
    );
  });
});
