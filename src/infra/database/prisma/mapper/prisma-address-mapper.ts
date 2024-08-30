import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Address } from '@/domain/enterprise/entities/address';
import { Prisma } from '@prisma/client';

export class PrismaAddressMapper {
  static toPersistence(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.toString(),
      street: address.street,
      state: address.state,
      city: address.city,
      country: address.country,
      postalCode: address.postalCode,
      userId: address.customerId,
    };
  }
  static toDomain(raw: Prisma.AddressUncheckedCreateInput): Address {
    const product = Address.create(
      {
        street: raw.street,
        state: raw.state,
        city: raw.city,
        country: raw.country,
        postalCode: raw.postalCode,
        customerId: raw.userId,
      },
      new UniqueEntityID(raw.id),
    );
    return product;
  }
}
