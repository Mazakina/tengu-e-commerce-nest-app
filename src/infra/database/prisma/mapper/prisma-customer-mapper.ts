import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { Address } from '@/domain/enterprise/entities/address';
import { Customer } from '@/domain/enterprise/entities/customer';
import { Prisma, User, Address as PrismaAddress } from '@prisma/client';
import { CacheCustomerDTO } from '../dto/customerDTO';

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
        create: data.address?.map((item) => {
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
    let address;
    if (data.Address.length > 0) {
      address = data.Address?.map((item) => {
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
    }
    const customer = Customer.create(
      {
        email: data.email,
        name: data.name,
        password: data.password,
        address,
      },
      new UniqueEntityID(data.id),
    );

    return customer;
  }

  static fromCacheToDomain(data: CacheCustomerDTO): Customer {
    let address = [];
    if (data.props.address?.length[0]) {
      address = data.props.address.map((item) => {
        const { props } = item;
        return Address.create(
          {
            street: props.street,
            city: props.city,
            state: props.state,
            postalCode: props.postalCode,
            country: props.country,
            customerId: props.customerId,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
          },
          new UniqueEntityID(item._id.value),
        );
      });
    }
    const customer = Customer.create(
      {
        email: data.props.email,
        name: data.props.name,
        password: data.props.password,
        address: address,
      },
      new UniqueEntityID(data._id.value),
    );

    return customer;
  }
}
