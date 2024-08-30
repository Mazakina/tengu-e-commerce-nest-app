import { RegisterCustomerUseCase } from './register-customer';
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository';
import { makeCustomer } from 'test/factories/make-customer';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let hashGenerator: FakeHasher;
let sut: RegisterCustomerUseCase;

describe('Register Customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    hashGenerator = new FakeHasher();
    sut = new RegisterCustomerUseCase(
      inMemoryCustomerRepository,
      hashGenerator,
    );
  });
  it('should register a new customer', async () => {
    const { name, email, password } = makeCustomer();
    const result = await sut.execute({
      name,
      email,
      password,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryCustomerRepository.items[0].id).toEqual(
        result.value.customer.id,
      );
    }
  });

  it('shouldn`t be able register a new customer with the same e-mail', async () => {
    const { name, email, password } = makeCustomer();
    await sut.execute({
      name,
      email,
      password,
    });

    const result = await sut.execute({
      name,
      email,
      password,
    });

    expect(result.isRight()).toBe(false);
    if (result.isRight()) {
      expect(inMemoryCustomerRepository.items[1].id).toEqual(undefined);
    }
  });

  it('should hash the customer password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    });

    const hashedPassword = await hashGenerator.hash('123456');
    expect(result.isRight()).toBe(true);
    expect(inMemoryCustomerRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });
});
