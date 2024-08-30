import { AddressRepository } from '@/domain/application/repositories/address-repository';
import { Address } from '@/domain/enterprise/entities/address';

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = [];
  async findByID(id: string): Promise<Address | null> {
    const index = this.items.findIndex((i) => i.id.toString() === id);
    return this.items[index];
  }
  async findByUserID(UserId: string): Promise<Address[] | null> {
    const items = this.items.filter((i) => i.customerId === UserId);

    return items;
  }
  async save(address: Address): Promise<void> {
    const index = this.items.findIndex((i) => i.id.equals(address.id));

    this.items[index] = address;
  }
  async create(address: Address): Promise<void> {
    this.items.push(address);
  }
  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((i) => i.id.toString() === id);
    this.items.splice(index, 1);
  }
}
