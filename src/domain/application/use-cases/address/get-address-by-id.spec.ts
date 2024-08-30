import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { makeAddress } from 'test/factories/make-address';
import { GetAddressByIdUseCase } from './get-address-by-id';

let inMemoryAddressRepository: InMemoryAddressRepository;
let sut: GetAddressByIdUseCase;

describe('Get Address', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new GetAddressByIdUseCase(inMemoryAddressRepository);
  });

  it('Should be able to get an Address.', async () => {
    const address = makeAddress({
      city: 'test',
    });
    inMemoryAddressRepository.create(address);
    const result = await sut.execute({
      id: address.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.address.city).toEqual('test');
    }
  });
});
