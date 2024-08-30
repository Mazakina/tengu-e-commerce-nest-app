import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';
import { ProductFactory } from 'test/factories/make-products';

describe('Fetch Products By Collection  (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let productFactory: ProductFactory;
  let customerFactory: CustomerFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ProductFactory, PrismaService, CustomerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    productFactory = moduleRef.get(ProductFactory);
    customerFactory = moduleRef.get(CustomerFactory);
    await app.init();
  });

  test('[GET] /product/collections/:collectionId/:page', async () => {
    for (let i = 1; i <= 13; i++) {
      await productFactory.makePrismaProduct({
        collections: ['summer_2024'],
      });
    }
    for (let i = 1; i <= 15; i++) {
      await productFactory.makePrismaProduct({
        collections: ['street_2024'],
      });
    }
    const user = await customerFactory.makePrismaCustomer();

    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .get(`/product/collections/summer_2024/1`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.products.length).toEqual(13);
  });
});
