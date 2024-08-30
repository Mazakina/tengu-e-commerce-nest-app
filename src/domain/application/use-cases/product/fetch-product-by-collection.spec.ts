import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeProduct } from 'test/factories/make-products';
import { FetchProductByCollectionUseCase } from './fetch-product-by-collection';

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: FetchProductByCollectionUseCase;

describe('Get Product By Slug', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new FetchProductByCollectionUseCase(inMemoryProductsRepository);
  });

  it('should get a product', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryProductsRepository.create(
        makeProduct({ collections: ['second'] }),
      );
    }

    for (let i = 1; i <= 24; i++) {
      inMemoryProductsRepository.create(
        makeProduct({ collections: ['testing'] }),
      );
    }
    const result = await sut.execute({ collection: 'testing', page: 1 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.products.length).toBe(20);
    }
  });
});
