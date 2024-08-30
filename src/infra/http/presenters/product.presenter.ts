import { Product } from '@/domain/enterprise/entities/product';

export class ProductPresenter {
  static toHttp(product: Product) {
    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      collections: product.collections,
      sizes: product.sizes,
      models: product.models,
    };
  }
}
