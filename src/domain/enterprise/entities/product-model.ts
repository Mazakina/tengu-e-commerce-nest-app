import { Entity } from 'src/core/primitives/entities';
import { UniqueEntityID } from 'src/core/primitives/unique-entity-id';

interface ProductModelProps {
  productId: string;
  modelName: string;
}

export class ProductModel extends Entity<ProductModelProps> {
  static create(props: ProductModelProps, id?: UniqueEntityID) {
    const productModel = new ProductModel(props, id);
    return productModel;
  }
}
