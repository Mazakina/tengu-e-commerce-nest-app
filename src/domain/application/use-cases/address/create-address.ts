import { Either, right } from '@/core/either';
import { AddressRepository } from '../../repositories/address-repository';
import { Address } from '@/domain/enterprise/entities/address';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';

interface CreateAddressUseCaseRequest {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  customerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type CreateAddressUseCaseResponse = Either<Error, { address: Address }>;

@Injectable()
export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(
    props: CreateAddressUseCaseRequest,
    id?: UniqueEntityID,
  ): Promise<CreateAddressUseCaseResponse> {
    const address = Address.create(
      {
        city: props.city,
        street: props.street,
        state: props.state,
        postalCode: props.postalCode,
        country: props.country,
        customerId: props.customerId,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
      id,
    );

    await this.addressRepository.create(address);
    return right({ address });
  }
}
