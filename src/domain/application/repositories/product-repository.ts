import { Product } from 'src/domain/enterprise/entities/product';

export type findBycollectionRequest = {
  collection: string;
  page: number;
};
export type findAllProductsRequest = {
  page: number;
};

export abstract class ProductsRepository {
  abstract findByID(id: string): Promise<Product | null>;
  abstract findByCollection({
    collection,
    page,
  }: findBycollectionRequest): Promise<Product[] | null>;
  abstract create(product: Product): Promise<void>;
  abstract findAll({ page }: findAllProductsRequest): Promise<Product[]>;
  abstract findManyById(productIds: string[]): Promise<Product[]>;
  abstract delete(productId: string): Promise<void>;
  abstract save(product: Product): Promise<void>;
  abstract subtractStock(data: {
    productId: string;
    valuetoSubtract: number;
  }): Promise<void>;
}
