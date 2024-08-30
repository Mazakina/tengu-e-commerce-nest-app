import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { makeAddress } from 'test/factories/make-address';
import { DeleteAddressUseCase } from './delete-address';

let inMemoryAddressRepository: InMemoryAddressRepository;
let sut: DeleteAddressUseCase;
describe('Create Address', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new DeleteAddressUseCase(inMemoryAddressRepository);
  });

  it('Should be able to create an Address.', async () => {
    const address = makeAddress();
    inMemoryAddressRepository.create(address);
    const result = await sut.execute(address.id.toString());

    expect(result.isRight()).toBe(true);
    expect(inMemoryAddressRepository.items[0]).toBe(undefined);
  });
});
