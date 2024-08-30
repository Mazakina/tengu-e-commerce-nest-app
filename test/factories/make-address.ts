import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Address, AddressProps } from '@/domain/enterprise/entities/address';
import { PrismaAddressMapper } from '@/infra/database/prisma/mapper/prisma-address-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAddress(
  override?: Partial<AddressProps>,
  id?: UniqueEntityID,
): Address {
  const address = Address.create(
    {
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      customerId: faker.string.uuid(),
      ...override,
    },
    id,
  );
  return address;
}

@Injectable()
export class AddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAddress(
    data: Partial<Address> = {},
    id?: UniqueEntityID,
  ): Promise<Address> {
    const address = makeAddress(data, id);

    await this.prisma.address.create({
      data: PrismaAddressMapper.toPersistence(address),
    });

    return address;
  }
}
