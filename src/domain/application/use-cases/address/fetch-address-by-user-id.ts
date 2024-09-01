import { Either, left, right } from '@/core/either';
import { AddressRepository } from '../../repositories/address-repository';
import { Address } from '@/domain/enterprise/entities/address';
import { BadRequestException, Injectable } from '@nestjs/common';

type FetchAddressByUserIdUseCaseResponse = Either<
  Error,
  { address: Address[] }
>;

@Injectable()
export class FetchAddressByUserIdUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(id: string): Promise<FetchAddressByUserIdUseCaseResponse> {
    const address = await this.addressRepository.findByUserID(id);

    if (!address[0]) {
      return left(new BadRequestException());
    }

    return right({ address });
  }
}
