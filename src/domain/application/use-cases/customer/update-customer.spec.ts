import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository';
import { makeCustomer } from 'test/factories/make-customer';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { UpdateCustomerUseCase } from './update-customer';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let hashGenerator: FakeHasher;
let sut: UpdateCustomerUseCase;

describe('Update Customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    hashGenerator = new FakeHasher();
    sut = new UpdateCustomerUseCase(inMemoryCustomerRepository, hashGenerator);
  });
  it('should update a customer', async () => {
    const customer = makeCustomer();
    inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      email: 'newEmail@gmail.com',
      password: 'new Password',
      customerId: customer.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryCustomerRepository.items[0].id).toEqual(
        result.value.customer.id,
      );
    }
  });

  it('shouldn`t be able update a new customer with the same e-mail of another user', async () => {
    const customer = makeCustomer();
    inMemoryCustomerRepository.create(
      makeCustomer({ email: 'test@example.com' }),
    );
    inMemoryCustomerRepository.create(customer);
    const result = await sut.execute({
      email: 'test@example.com',
      customerId: customer.id.toString(),
    });

    expect(result.isRight()).toBe(false);
    if (result.isLeft()) {
      expect(inMemoryCustomerRepository.items[1].email).toEqual(customer.email);
    }
  });

  it('should hash the customer password upon update', async () => {
    const customer = makeCustomer();
    inMemoryCustomerRepository.create(customer);

    const hashedPassword = await hashGenerator.hash('new Password');
    const result = await sut.execute({
      email: 'newEmail@gmail.com',
      password: 'new Password',
      customerId: customer.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCustomerRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });
});
