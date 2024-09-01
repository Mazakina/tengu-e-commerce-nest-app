import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Customer, CustomerProps } from '@/domain/enterprise/entities/customer';
import { PrismaCustomerMapper } from '@/infra/database/prisma/mapper/prisma-customer-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeCustomer(
  override?: Partial<CustomerProps>,
  id?: UniqueEntityID,
) {
  const customer = Customer.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.string.uuid(),
      address: [],
      ...override,
    },
    id,
  );

  return customer;
}

@Injectable()
export class CustomerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomer(
    data: Partial<CustomerProps> = {},
  ): Promise<Customer> {
    const customer = makeCustomer(data);

    await this.prisma.user.create({
      data: PrismaCustomerMapper.toPersistence(customer),
    });

    return customer;
  }
}
