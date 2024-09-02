import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository';
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository';
import { makeCustomer } from 'test/factories/make-customer';
import { CreateCartUseCase } from './create-cart';
import { makeCart } from 'test/factories/make-cart';

let inMemoryCartRepository: InMemoryCartRepository;
let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: CreateCartUseCase;

describe('Create cart', () => {
  beforeEach(() => {
    inMemoryCartRepository = new InMemoryCartRepository();
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new CreateCartUseCase(inMemoryCartRepository);
  });

  it('should be able to create  Cart', async () => {
    const customer = makeCustomer();
    await inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      userId: customer.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryCartRepository.items[0].userId).toEqual(
      customer.id.toString(),
    );
  });

  it('should`t be able to create a second card', async () => {
    const customer = makeCustomer();
    await inMemoryCustomerRepository.create(customer);
    const firstCart = makeCart({ userId: customer.id.toString() });
    await inMemoryCartRepository.create(firstCart);
    const result = await sut.execute({
      userId: customer.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(inMemoryCartRepository.items[0].id.toString()).toEqual(
      firstCart.id.toString(),
    );
  });
});
