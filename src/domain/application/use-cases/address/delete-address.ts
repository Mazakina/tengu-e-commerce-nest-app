import { Either, left, right } from '@/core/either';
import { AddressRepository } from '../../repositories/address-repository';
import { Address } from '@/domain/enterprise/entities/address';
import { BadRequestException, Injectable } from '@nestjs/common';

interface DeleteAddressUseCaseRequest {
  id: string;
  customerId: string;
}

type DeleteAddressUseCaseResponse = Either<Error, { address: Address }>;

@Injectable()
export class DeleteAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(id: string): Promise<DeleteAddressUseCaseResponse> {
    const address = await this.addressRepository.findByID(id);

    if (!address) {
      return left(new BadRequestException());
    }

    // if (address.customerId !== props.customerId) {
    //   return left(new BadRequestException());
    // }
    await this.addressRepository.delete(id);

    return right({ address });
  }
}
