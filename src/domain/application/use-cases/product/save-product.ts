import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product-repository';
import { Product, sizesEnum } from '@/domain/enterprise/entities/product';
import { Either, left, right } from '@/core/either';

type SaveProductUseCaseRequest = {
  name?: string;
  price?: number;
  description?: string;
  stock?: number;
  collections?: string[];
  sizes?: sizesEnum[];
  models?: string[];
  id: string;
};

@Injectable()
export class SaveProductUseCase {
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
  }: SaveProductUseCaseRequest): Promise<Either<Error, { product: Product }>> {
    const product = await this.productsRepository.findByID(id.toString());

    if (!product) {
      return left(new NotFoundException('Product not found'));
    }

    if (stock < 0) {
      return left(new BadRequestException('Invalid stock value'));
    }

    if (price < 0) {
      return left(new BadRequestException('Invalid price'));
    }
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.stock = stock ?? product.stock;
    product.collections = collections ?? product.collections;
    product.sizes = sizes ?? product.sizes;
    product.models = models ?? product.models;

    await this.productsRepository.save(product);

    return right({ product });
  }
}
