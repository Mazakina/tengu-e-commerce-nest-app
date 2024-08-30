import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeProduct } from 'test/factories/make-products';
import { GetProductBySlugUseCase } from './get-product-by-slug';

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: GetProductBySlugUseCase;

describe('Get Product By Slug', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new GetProductBySlugUseCase(inMemoryProductsRepository);
  });

  it('should get a product', async () => {
    inMemoryProductsRepository.create(makeProduct());
    const product = makeProduct();
    inMemoryProductsRepository.create(product);

    const result = await sut.execute({ slug: product.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items[1]).toEqual(product);
  });
});
