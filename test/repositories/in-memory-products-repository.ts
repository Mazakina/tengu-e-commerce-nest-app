import { Product } from '@/domain/enterprise/entities/product';
import {
  findAllProductsRequest,
  findBycollectionRequest,
  ProductsRepository,
} from '@/repositories/product-repository';

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];
  async findManyById(productIds: string[]): Promise<Product[]> {
    const products = this.items.filter(
      (item) => item.id.toString() in productIds,
    );

    return products;
  }
  async subtractStock(data: {
    productId: string;
    valuetoSubtract: number;
  }): Promise<void> {
    const productIndex = this.items.findIndex(
      (item) => item.id.toString() === data.productId,
    );
    this.items[productIndex].stock -= data.valuetoSubtract;
  }
  async findAll({ page }: findAllProductsRequest): Promise<Product[]> {
    return this.items.slice((page - 1) * 20, page * 20);
  }
  async delete(productId: string): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === productId,
    );

    this.items.splice(index, 1);
  }

  async save(product: Product): Promise<void> {
    const item = this.items.find((item) => product.equals(item));
    if (item) {
      Object.assign(item, {
        sizes: product.sizes ?? item.sizes,
        collections: product.collections ?? item.collections,
        description: product.description ?? item.description,
        models: product.models ?? item.models,
        name: product.name ?? item.name,
        price: product.price ?? item.price,
        stock: product.stock ?? item.stock,
      });
    }
  }

  async findByID(id: string): Promise<Product> {
    const product = this.items.find((item) => item.id.toString() === id);
    if (!product) {
      return null;
    }
    return product;
  }
  async findByCollection({
    collection,
    page,
  }: findBycollectionRequest): Promise<Product[]> {
    const products = this.items.filter((item) =>
      item.collections.includes(collection),
    );

    if (!products[0]) {
      return null;
    }
    return products.slice((page - 1) * 20, page * 20);
  }
  async create(product: Product): Promise<void> {
    this.items.push(product);
  }
}
