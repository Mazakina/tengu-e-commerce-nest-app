import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';
import { ProductFactory } from 'test/factories/make-products';

describe('Fetch all Products  (E2E)', () => {
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

  test('[GET] /product/all/:page', async () => {
    for (let i = 1; i <= 30; i++) {
      await productFactory.makePrismaProduct();
    }
    const user = await customerFactory.makePrismaCustomer();

    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .get(`/product/all/1`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(202);
    expect(response.body.products.length).toEqual(20);
  });
});
