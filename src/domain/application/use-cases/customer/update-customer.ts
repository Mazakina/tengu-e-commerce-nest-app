import { Either, left, right } from '@/core/either';
import { CustomerRepository } from '../../repositories/customer-repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@/domain/enterprise/entities/customer';
import { HashGenerator } from '../../cryptography/hash-generator';

export interface UpdateCustomerUseCaseRequest {
  name?: string;
  email?: string;
  password?: string;
  customerId: string;
}

type UpdateCustomerUseCaseResponse = Either<
  NotFoundException,
  { customer: Customer }
>;

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    customerId,
  }: UpdateCustomerUseCaseRequest): Promise<UpdateCustomerUseCaseResponse> {
    const customer = await this.customerRepository.findByID(customerId);

    if (!customer) {
      return left(new NotFoundException());
    }
    const emailAlreadyExists = await this.customerRepository.findByEmail(email);
    if (emailAlreadyExists) {
      return left(new BadRequestException('Email already taken'));
    }
    const hashedPassword = await this.hashGenerator.hash(password);
    customer.name = name ?? customer.name;
    customer.email = email ?? customer.email;
    customer.password = password ? hashedPassword : customer.password;

    try {
      this.customerRepository.save(customer);
      return right({ customer });
    } catch (e) {
      return left(new NotFoundException());
    }
  }
}
