import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product-repository';
import { Product } from '@/domain/enterprise/entities/product';
import { Either, left, right } from '@/core/either';

type FetchAllProductsUseCaseRequest = { page: number };
type FetchAllProductsUseCaseResponse = Either<Error, { products: Product[] }>;

@Injectable()
export default class FetchAllProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
  }: FetchAllProductsUseCaseRequest): Promise<FetchAllProductsUseCaseResponse> {
    const result = await this.productsRepository.findAll({ page });

    if (!result[0]) {
      return left(new NotFoundException());
    }
    return right({ products: result });
  }
}
