import { CustomerRepository } from '@/domain/application/repositories/customer-repository';
import { Customer } from '@/domain/enterprise/entities/customer';

export class InMemoryCustomerRepository implements CustomerRepository {
  public items: Customer[] = [];
  async findByEmail(email: string): Promise<Customer | null> {
    const index = this.items.findIndex((item) => {
      return item.email === email;
    });
    return this.items[index];
  }
  async findByID(id: string): Promise<Customer | null> {
    const index = this.items.findIndex((item) => {
      return item.id.toString() === id;
    });

    return this.items[index];
  }
  async create(customer: Customer): Promise<void> {
    this.items.push(customer);
    return;
  }
  async save(customer: Customer): Promise<void> {
    const index = this.items.findIndex((item) => {
      customer.id.equals(item.id);
    });

    this.items[index] = customer;
    return;
  }
}
