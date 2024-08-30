import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product-repository';
import { Either, left, right } from '@/core/either';
import { Product } from '@/domain/enterprise/entities/product';
import { ResourceNotFoundError } from './../errors/resource-not-found-error';

interface GetProductBySlugUseCaseRequest {
  slug: string;
}

type GetProductBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>;

@Injectable()
export class GetProductBySlugUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    slug,
  }: GetProductBySlugUseCaseRequest): Promise<GetProductBySlugUseCaseResponse> {
    const product = await this.productsRepository.findByID(slug);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    return right({ product });
  }
}
