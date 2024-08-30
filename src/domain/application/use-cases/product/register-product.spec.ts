import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import RegisterProductUseCase from './register-product';
import { BadRequestException } from '@nestjs/common';

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: RegisterProductUseCase;

describe('Register Products', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new RegisterProductUseCase(inMemoryProductsRepository);
  });
  it('should register a new product', async () => {
    const result = await sut.execute({
      description: 'Register a new product',
      name: 'new product',
      price: 10000,
      sizes: ['m', 'l'],
      stock: 30,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0].id).toEqual(
        result.value?.product?.id,
      );
    }
  });

  it('shouldn`t be able to register the negative stock', async () => {
    const result = await sut.execute({
      description: 'Register a new product',
      name: 'new product',
      price: 10000,
      sizes: ['m', 'l'],
      stock: -30,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
  });

  it('shouldn`t be able to register product without a price', async () => {
    const result = await sut.execute({
      description: 'Register a new product',
      name: 'new product',
      price: 0,
      sizes: ['m', 'l'],
      stock: 5,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
  });
});
