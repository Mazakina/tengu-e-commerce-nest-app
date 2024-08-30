import { Customer } from 'src/domain/enterprise/entities/customer';

export abstract class CustomerRepository {
  abstract findByEmail(email: string): Promise<Customer | null>;
  abstract findByID(id: string): Promise<Customer | null>;
  abstract create(customer: Customer): Promise<void>;
  abstract save(customer: Customer): Promise<void>;
}
