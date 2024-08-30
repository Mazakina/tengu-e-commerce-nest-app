import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { CreateAddressUseCase } from './create-address';
import { makeAddress } from 'test/factories/make-address';

let inMemoryAddressRepository: InMemoryAddressRepository;
let sut: CreateAddressUseCase;
describe('Create Address', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new CreateAddressUseCase(inMemoryAddressRepository);
  });

  it('Should be able to create an Address.', async () => {
    const address = makeAddress();

    sut.execute(
      {
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        customerId: address.customerId,
      },
      address.id,
    );

    expect(inMemoryAddressRepository.items[0]).toEqual(
      expect.objectContaining({
        _id: address.id,
        props: expect.objectContaining({
          customerId: address.customerId,
        }),
      }),
    );
  });
});
