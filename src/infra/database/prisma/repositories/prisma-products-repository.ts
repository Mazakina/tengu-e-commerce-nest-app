import {
  findAllProductsRequest,
  findBycollectionRequest,
  ProductsRepository,
} from '@/domain/application/repositories/product-repository';
import { Product } from '@/domain/enterprise/entities/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaProductMapper } from '../mapper/prisma-product-mapper';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}
  async findManyById(productIds: string[]): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    const products = productsData.map((item) =>
      PrismaProductMapper.toDomain(item),
    );

    return products;
  }

  async subtractStock(data: {
    productId: string;
    valuetoSubtract: number;
  }): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    product.stock = product.stock - data.valuetoSubtract;
    await this.prisma.product.update({
      where: { id: data.productId },
      data: product,
    });
  }

  async delete(productId: string): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }

  async findAll({ page }: findAllProductsRequest): Promise<Product[]> {
    const items = await this.prisma.product.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });

    const result = items.map((item) => PrismaProductMapper.toDomain(item));

    return result;
  }

  async findByID(id: string): Promise<Product> {
    const result = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!result) {
      throw new NotFoundException();
    }
    return PrismaProductMapper.toDomain(result);
  }

  async findByCollection({
    collection,
    page,
  }: findBycollectionRequest): Promise<Product[]> {
    const items = await this.prisma.product.findMany({
      where: {
        collections: {
          has: collection,
        },
      },

      take: 20,
      skip: (page - 1) * 20,
    });

    const result = items.map((item) => PrismaProductMapper.toDomain(item));

    return result;
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product);

    await this.prisma.product.create({
      data,
    });
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product);
    await this.prisma.product.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
