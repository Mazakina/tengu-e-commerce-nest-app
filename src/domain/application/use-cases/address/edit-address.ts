import { Either, left, right } from '@/core/either';
import { AddressRepository } from '../../repositories/address-repository';
import { Address } from '@/domain/enterprise/entities/address';
import { BadRequestException, Injectable } from '@nestjs/common';

interface EditAddressUseCaseRequest {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  customerId: string;
}

type EditAddressUseCaseResponse = Either<Error, { address: Address }>;

@Injectable()
export class EditAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(
    props: EditAddressUseCaseRequest,
  ): Promise<EditAddressUseCaseResponse> {
    const address = await this.addressRepository.findByID(props.id);
    console.log('address:', address);
    if (!address) {
      return left(new BadRequestException());
    }

    address.city = props.city ?? address.city;
    address.street = props.street ?? address.street;
    address.state = props.state ?? address.state;
    address.postalCode = props.postalCode ?? address.postalCode;
    address.country = props.country ?? address.country;

    address.updated();

    await this.addressRepository.save(address);

    return right({ address });
  }
}
