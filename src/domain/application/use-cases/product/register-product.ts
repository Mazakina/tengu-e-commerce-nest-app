import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product-repository';
import { Product, sizesEnum } from 'src/domain/enterprise/entities/product';
import { Either, left, right } from 'src/core/either';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';

interface RegisterProductUseCaseRequest {
  name: string;
  price: number;
  description: string;
  stock: number;
  collections?: string[];
  sizes: sizesEnum[];
  models?: string[];
  id?: string;
}

type RegisterProducUseCaseResponce = Either<Error, { product: Product }>;

@Injectable()
export default class RegisterProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    name,
    price,
    description,
    stock,
    collections,
    sizes,
    models,
    id,
  }: RegisterProductUseCaseRequest): Promise<RegisterProducUseCaseResponce> {
    if (stock < 0) {
      return left(new BadRequestException('Invalid stock value.'));
    }

    if (price <= 0) {
      return left(new BadRequestException('Invalid price value.'));
    }
    const product = Product.create(
      {
        name,
        price,
        description,
        stock,
        collections,
        sizes,
        models,
      },
      new UniqueEntityID(id),
    );
    await this.productsRepository.create(product);

    return right({ product });
  }
}
