import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeProduct } from 'test/factories/make-products';
import FetchAllProductsUseCase from './fetch-all-products';

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: FetchAllProductsUseCase;

describe('Get Product By Slug', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new FetchAllProductsUseCase(inMemoryProductsRepository);
  });

  it('should get a product', async () => {
    for (let i = 1; i <= 43; i++) {
      await inMemoryProductsRepository.create(
        makeProduct({ collections: ['second'] }),
      );
    }

    const result = await sut.execute({ page: 2 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.products.length).toBe(20);
    }
  });
});
