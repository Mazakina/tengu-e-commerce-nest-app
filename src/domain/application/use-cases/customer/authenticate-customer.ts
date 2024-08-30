import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';
import { CustomerRepository } from '../../repositories/customer-repository';
import { HashComparer } from '../../cryptography/hash-comparer';
import { Encrypter } from '../../cryptography/encrypter';
import { Injectable } from '@nestjs/common';

type AuthenticateStudentUseCaseRequest = {
  email: string;
  password: string;
};

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateCustomerUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      customer.password,
    );
    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: customer.id.toString(),
    });

    return right({ accessToken });
  }
}
