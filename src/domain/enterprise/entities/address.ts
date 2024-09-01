import { Entity } from '@/core/primitives/entities';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Optional } from '@prisma/client/runtime/library';

export type AddressProps = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Address extends Entity<AddressProps> {
  static create(
    props: Optional<AddressProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const address = new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
    return address;
  }
  get street() {
    return this.props.street;
  }

  set street(value: string) {
    this.props.street = value;
  }

  // city
  get city() {
    return this.props.city;
  }

  set city(value: string) {
    this.props.city = value;
  }

  // state
  get state() {
    return this.props.state;
  }

  set state(value: string) {
    this.props.state = value;
  }

  // postalCode
  get postalCode() {
    return this.props.postalCode;
  }

  set postalCode(value: string) {
    this.props.postalCode = value;
  }

  // country
  get country() {
    return this.props.country;
  }

  set country(value: string) {
    this.props.country = value;
  }

  // customer

  get customerId() {
    return this.props.customerId;
  }

  // createdAt
  get createdAt() {
    return this.props.createdAt;
  }

  // updatedAt
  get updatedAt() {
    return this.props.updatedAt;
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  updated() {
    this.props.updatedAt = new Date();
  }
}
