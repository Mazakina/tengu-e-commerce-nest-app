import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Address } from '@/domain/enterprise/entities/address';
import { Customer } from '@/domain/enterprise/entities/customer';
import { Prisma, User, Address as PrismaAddress } from '@prisma/client';

type UserDetails = User & {
  Address: PrismaAddress[];
};

export class PrismaCustomerMapper {
  static toPersistence(
    data: Customer,
  ): Prisma.UserUncheckedCreateWithoutCartInput {
    return {
      email: data.email,
      name: data.name,
      password: data.password,
      id: data.id.toString(),
      Address: {
        create: data.addresses?.map((item) => {
          return {
            city: item.city,
            country: item.country,
            postalCode: item.postalCode,
            state: item.state,
            street: item.street,
            createdAt: item.createdAt,
            id: item.id.toString(),
            updatedAt: item.updatedAt,
          };
        }),
      },
    };
  }

  static toDomain(data: UserDetails): Customer {
    const addresses = data.Address.map((item) => {
      return Address.create(
        {
          street: item.street,
          city: item.city,
          state: item.state,
          postalCode: item.postalCode,
          country: item.country,
          customerId: item.userId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
        new UniqueEntityID(item.id),
      );
    });
    const customer = Customer.create(
      {
        email: data.email,
        name: data.name,
        password: data.password,
        addresses,
      },
      new UniqueEntityID(data.id),
    );

    return customer;
  }
}
