import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';
import { ProductFactory } from 'test/factories/make-products';

describe('Save Product (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let productFactory: ProductFactory;
  let customerFactory: CustomerFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [ProductFactory, PrismaService, CustomerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    productFactory = moduleRef.get(ProductFactory);
    customerFactory = moduleRef.get(CustomerFactory);
    await app.init();
  });

  test('[PUT] /product/:id', async () => {
    const product = await productFactory.makePrismaProduct();
    const user = await customerFactory.makePrismaCustomer();

    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .put(`/product/${product.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'test',
        price: 10000,
        description: 'something',
        stock: 30,
        sizes: ['xl'],
      });

    expect(response.statusCode).toBe(202);

    const productOnDataBase = await prisma.product.findUnique({
      where: {
        id: product.id.toString(),
      },
    });

    expect(productOnDataBase).toBeTruthy();
  });
});
