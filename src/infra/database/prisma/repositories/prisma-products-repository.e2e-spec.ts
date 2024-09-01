import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { CacheModule } from '@/infra/cache/cache.module';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { Test } from '@nestjs/testing';
import { OrderFactory } from 'test/factories/make-order';
import { ProductFactory } from 'test/factories/make-products';
import { PrismaService } from '../prisma.service';
import { ProductsRepository } from '@/domain/application/repositories/product-repository';

describe('Prisma Products Repository (E2E)', () => {
  let app: INestApplication;
  let cacheRepository: CacheRepository;
  let productsRepository: ProductsRepository;
  let productFactory: ProductFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [PrismaService, OrderFactory, ProductFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    cacheRepository = moduleRef.get(CacheRepository);
    productFactory = moduleRef.get(ProductFactory);
    productsRepository = moduleRef.get(ProductsRepository);
    await app.init();
  });

  it('should cache product', async () => {
    const product = await productFactory.makePrismaProduct();

    const data = await productsRepository.findByID(product.id.toString());

    const cached = await cacheRepository.get(
      `product:${data.id.toString()}:details`,
    );

    expect(cached).toEqual(JSON.stringify(data));
  });

  it('should return cached product on subsequent calls', async () => {
    const product = await productFactory.makePrismaProduct();

    const data = await productsRepository.findByID(product.id.toString());

    const newData = data;

    newData.name = 'test';
    await cacheRepository.set(
      `product:${product.id.toString()}:details`,
      JSON.stringify(newData),
    );

    const productDetails = await productsRepository.findByID(
      product.id.toString(),
    );

    expect(productDetails).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          name: 'test',
        }),
      }),
    );
  });

  it('should reset customer cache when saving the customer', async () => {
    const product = await productFactory.makePrismaProduct();
    const data = await productsRepository.findByID(product.id.toString());

    await cacheRepository.set(
      `product:${product.id.toString()}:details`,
      JSON.stringify({ empty: true }),
    );

    await productsRepository.save(data);

    const cached = await cacheRepository.get(
      `product:${product.id.toString()}:details`,
    );

    expect(cached).toBeNull();
  });
});
