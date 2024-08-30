import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product-repository';
import { Either, left, right } from '@/core/either';

type DeleteProductUseCaseResponse = Either<Error, null>;

@Injectable()
export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(id: string): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productsRepository.findByID(id);
    if (!product) {
      return left(new Error());
    }

    await this.productsRepository.delete(id);

    return right(null);
  }
}
