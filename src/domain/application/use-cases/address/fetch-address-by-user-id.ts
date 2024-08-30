import { Either, left, right } from '@/core/either';
import { AddressRepository } from '../../repositories/address-repository';
import { Address } from '@/domain/enterprise/entities/address';
import { BadRequestException, Injectable } from '@nestjs/common';

type FetchAddressByUserIdUseCaseResponse = Either<
  Error,
  { addresses: Address[] }
>;

@Injectable()
export class FetchAddressByUserIdUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(id: string): Promise<FetchAddressByUserIdUseCaseResponse> {
    const addresses = await this.addressRepository.findByUserID(id);

    if (!addresses[0]) {
      return left(new BadRequestException());
    }

    return right({ addresses });
  }
}
