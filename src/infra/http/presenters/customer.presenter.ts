import { Customer } from '@/domain/enterprise/entities/customer';

export class CustomerPresenter {
  static toHttp(customer: Customer) {
    return {
      id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      password: customer.password,
      address: customer.address,
    };
  }
}
