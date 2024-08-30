import { Either, left, right } from '@/core/either';
import { AddressRepository } from '../../repositories/address-repository';
import { Address } from '@/domain/enterprise/entities/address';
import { BadRequestException, Injectable } from '@nestjs/common';

interface GetAddessByIdUseCaseRequest {
  id: string;
}

type GetAddessByIdUseCaseResponse = Either<Error, { address: Address }>;

@Injectable()
export class GetAddressByIdUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(
    props: GetAddessByIdUseCaseRequest,
  ): Promise<GetAddessByIdUseCaseResponse> {
    const address = await this.addressRepository.findByID(props.id);

    if (!address) {
      return left(new BadRequestException());
    }

    return right({ address });
  }
}
