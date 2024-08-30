import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/customer-repository';
import { HashGenerator } from '../../cryptography/hash-generator';
import { Customer } from 'src/domain/enterprise/entities/customer';
import { Either, left, right } from '@/core/either';

export interface RegisterCustomerUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterCustomerUseCaseResponse = Either<Error, { customer: Customer }>;

@Injectable()
export class RegisterCustomerUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterCustomerUseCaseRequest): Promise<RegisterCustomerUseCaseResponse> {
    const customerWithTheSameEmail =
      await this.customerRepository.findByEmail(email);

    if (customerWithTheSameEmail) {
      return left(new BadRequestException());
    }

    const hashedPassword = await this.hashGenerator.hash(password);
    const customer = Customer.create({
      email,
      name,
      password: hashedPassword,
    });

    await this.customerRepository.create(customer);
    return right({ customer });
  }
}
