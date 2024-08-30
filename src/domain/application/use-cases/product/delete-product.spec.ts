import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { makeProduct } from 'test/factories/make-products';
import { DeleteProductUseCase } from './delete-product';

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: DeleteProductUseCase;

describe('Get delete a product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new DeleteProductUseCase(inMemoryProductsRepository);
  });

  it('should delete the right product', async () => {
    const product = makeProduct();
    inMemoryProductsRepository.create(product);
    const result = await sut.execute(product.id.toString());

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items.length).toEqual(0);
    }
  });
});
