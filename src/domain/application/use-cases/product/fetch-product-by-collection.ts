import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product-repository';
import { Either, left, right } from '@/core/either';
import { Product } from '@/domain/enterprise/entities/product';
import { ResourceNotFoundError } from './../errors/resource-not-found-error';

interface FetchProductByCollectionUseCaseRequest {
  collection: string;
  page: number;
}

type FetchProductByCollectionUseCaseResponse = Either<
  ResourceNotFoundError,
  { products: Product[] }
>;

@Injectable()
export class FetchProductByCollectionUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    collection,
    page,
  }: FetchProductByCollectionUseCaseRequest): Promise<FetchProductByCollectionUseCaseResponse> {
    const products = await this.productsRepository.findByCollection({
      collection,
      page,
    });

    if (!products[0]) {
      return left(new ResourceNotFoundError());
    }

    return right({ products });
  }
}
