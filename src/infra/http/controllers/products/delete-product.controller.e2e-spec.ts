import { AppModule } from '@/app.module';
import { delay } from '@/core/delay';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';
import { ProductFactory } from 'test/factories/make-products';

describe('Delete  Product  (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let productFactory: ProductFactory;
  let customerFactory: CustomerFactory;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ProductFactory, PrismaService, CustomerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    productFactory = moduleRef.get(ProductFactory);
    prisma = moduleRef.get(PrismaService);
    customerFactory = moduleRef.get(CustomerFactory);
    await app.init();
  });

  test('[DELETE] /product/:slug', async () => {
    const product = await productFactory.makePrismaProduct();
    const user = await customerFactory.makePrismaCustomer();

    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .delete(`/product/${product.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(202);

    delay(500);
    const productOnDatabase = await prisma.product.findFirst({
      where: {
        id: product.id.toString(),
      },
    });

    expect(productOnDatabase).toBeFalsy();
  });
});
