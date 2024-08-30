import { BadRequestException } from '@nestjs/common';
import { AggregateRoot } from 'src/core/primitives/aggregated-root';
import { UniqueEntityID } from 'src/core/primitives/unique-entity-id';
import { Optional } from 'src/core/types/optional';

export type sizesEnum = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

export interface ProductsProps {
  name: string;
  price: number;
  description: string;
  stock: number;
  collections: string[];
  sizes: sizesEnum[];
  models: string[];
}
export class Product extends AggregateRoot<ProductsProps> {
  static create(
    props: Optional<ProductsProps, 'collections' | 'sizes' | 'models'>,
    id?: UniqueEntityID,
  ): Product {

    const product = new Product(
      {
        ...props,
        collections: props.collections ?? [],
        sizes: props.sizes ?? [],
        models: props.models ?? [],
      },
      id,
    );
    return product;
  }

  get name() {
    return this.props.name;
  }
  set name(newName: string) {
    this.props.name = newName;
  }
  get price() {
    return this.props.price;
  }

  set price(newPrice: number) {
    this.props.price = newPrice;
  }

  get collections() {
    return this.props.collections;
  }

  set collections(collections) {
    this.props.collections = collections;
  }

  removeFromCollection(id: UniqueEntityID) {
    this.props.collections.filter((collection) => collection === id.toString());
  }

  addToCollection(id: UniqueEntityID) {
    if (!this.props.collections.indexOf(id.toString())) {
      this.props.collections.push(id.toString());
    }
  }

  get stock() {
    return this.props.stock;
  }

  set stock(newStock: number) {
    if (newStock >= 0) {
      this.props.stock = newStock;
    }
  }

  get description() {
    return this.props.description;
  }

  set description(newDescription: string) {
    this.props.description = newDescription;
  }

  get sizes() {
    return this.props.sizes;
  }

  set sizes(newSizes: sizesEnum[]) {
    this.props.sizes = newSizes;
  }

  get models() {
    return this.props.models;
  }

  set models(newModels: string[]) {}
}
