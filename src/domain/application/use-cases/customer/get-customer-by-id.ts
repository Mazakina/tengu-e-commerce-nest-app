import { Either, left, right } from '@/core/either';
import { CustomerRepository } from '../../repositories/customer-repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from '@/domain/enterprise/entities/customer';

type GetCustomerUseCaseResponse = Either<
  NotFoundException,
  { customer: Customer }
>;

@Injectable()
export class GetCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({ customerId }): Promise<GetCustomerUseCaseResponse> {
    const customer = await this.customerRepository.findByID(customerId);

    if (!customer) {
      return left(new NotFoundException());
    }
    return right({ customer });
  }
}
