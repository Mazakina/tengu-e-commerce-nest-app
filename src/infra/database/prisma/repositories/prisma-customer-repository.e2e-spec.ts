import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { CacheModule } from '@/infra/cache/cache.module';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { Test } from '@nestjs/testing';
import { CustomerFactory } from 'test/factories/make-customer';
import { OrderFactory } from 'test/factories/make-order';
import { ProductFactory } from 'test/factories/make-products';
import { PrismaService } from '../prisma.service';
import { CustomerRepository } from '@/domain/application/repositories/customer-repository';

describe('Prisma Customer Repository (E2E)', () => {
  let app: INestApplication;
  let cacheRepository: CacheRepository;
  let customerFactory: CustomerFactory;
  let customerRepository: CustomerRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [PrismaService, CustomerFactory, OrderFactory, ProductFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    cacheRepository = moduleRef.get(CacheRepository);
    customerFactory = moduleRef.get(CustomerFactory);
    customerRepository = moduleRef.get(CustomerRepository);
    await app.init();
  });

  it('should cache customer details', async () => {
    const user = await customerFactory.makePrismaCustomer();

    const customer = await customerRepository.findByEmail(user.email);

    const cached = await cacheRepository.get(`customer:${user.email}:details`);

    expect(cached).toEqual(JSON.stringify(customer));
  });

  it('should return cached customer details on subsequent calls', async () => {
    const user = await customerFactory.makePrismaCustomer();

    const customer = await customerRepository.findByEmail(user.email);

    await customerRepository.findByEmail(user.email);
    const newData = customer;

    newData.email = 'test';
    await cacheRepository.set(
      `customer:${user.email}:details`,
      JSON.stringify(newData),
    );

    const customerDetails = await customerRepository.findByEmail(user.email);

    expect(customerDetails).toEqual(
      expect.objectContaining({
        email: 'test',
      }),
    );
  });

  it('should reset customer cache when saving the customer', async () => {
    const user = await customerFactory.makePrismaCustomer();

    const customer = await customerRepository.findByEmail(user.email);

    await cacheRepository.set(
      `customer:${user.email}:details`,
      JSON.stringify({ empty: true }),
    );

    await customerRepository.save(customer);

    const cached = await cacheRepository.get(`question:${user.email}:details`);

    expect(cached).toBeNull();
  });
});
