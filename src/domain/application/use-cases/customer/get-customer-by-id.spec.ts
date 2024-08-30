import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository';
import { makeCustomer } from 'test/factories/make-customer';
import { GetCustomerUseCase } from './get-customer-by-id';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: GetCustomerUseCase;

describe('Get Customer by Id', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new GetCustomerUseCase(inMemoryCustomerRepository);
  });
  it('should Get a Customer by Id', async () => {
    const customer = makeCustomer();
    inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      customerId: customer.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryCustomerRepository.items[0].id).toEqual(
        result.value.customer.id,
      );
    }
  });
});
