import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product-repository';
import { Either, left, right } from '@/core/either';
import { OutOfStockError } from '../errors/out-of-stock-error';

export type SubtractStockUseCaseRequest = {
  productId: string;
  valuetoSubtract: number;
};

export type SubtractStockUseCaseResponse = Either<
  OutOfStockError | NotFoundException,
  void
>;

@Injectable()
export class SubtractStockUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    valuetoSubtract,
  }: SubtractStockUseCaseRequest): Promise<SubtractStockUseCaseResponse> {
    const product = await this.productsRepository.findByID(productId);
    console.log('hit');
    if (!product) {
      return left(new NotFoundException());
    }

    if (product.stock < valuetoSubtract) {
      return left(new OutOfStockError(productId));
    }

    await this.productsRepository.subtractStock({ productId, valuetoSubtract });
    return right(null);
  }
}
