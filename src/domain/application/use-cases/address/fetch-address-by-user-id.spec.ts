import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { makeAddress } from 'test/factories/make-address';
import { EditAddressUseCase } from './edit-address';

let inMemoryAddressRepository: InMemoryAddressRepository;
let sut: EditAddressUseCase;

describe('Fetch Address', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new EditAddressUseCase(inMemoryAddressRepository);
  });

  it('Should be able to Fetch an Address.', async () => {
    const address = makeAddress();
    inMemoryAddressRepository.create(address);
    const result = await sut.execute({
      id: address.id.toString(),
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      customerId: address.customerId,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAddressRepository.items[0].id.toString()).toBe(
      address.id.toString(),
    );
  });
});
