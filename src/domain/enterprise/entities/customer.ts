import { AggregateRoot } from 'src/core/primitives/aggregated-root';
import { UniqueEntityID } from 'src/core/primitives/unique-entity-id';
import { Address } from './address';

export interface CustomerProps {
  name: string;
  email: string;
  password: string;
  address?: Address[];
}

export class Customer extends AggregateRoot<CustomerProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }
  set name(value: string) {
    this.props.name = value;
  }

  set email(value: string) {
    this.props.email = value;
  }

  get password() {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;
  }

  get address() {
    return this.props.address;
  }

  set address(value: Address[]) {
    this.props.address = value;
  }
  static create(props: CustomerProps, id?: UniqueEntityID) {
    const customer = new Customer(props, id);
    return customer;
  }
}
