import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository';
import { makeCustomer } from 'test/factories/make-customer';
import { AuthenticateCustomerUseCase } from './authenticate-customer';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateCustomerUseCase;

describe('Authenticate Customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateCustomerUseCase(
      inMemoryCustomerRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });
  it('should be able to authenticate a Customer', async () => {
    const customer = makeCustomer({
      password: await fakeHasher.hash('somePassword'),
    });
    inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      email: customer.email,
      password: 'somePassword',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toEqual({
        accessToken: expect.any(String),
      });
    }
  });
});
