import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';
import { ProductFactory } from 'test/factories/make-products';

describe('Order Create (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let customerFactory: CustomerFactory;
  let productFactory: ProductFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, CustomerFactory, ProductFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    productFactory = moduleRef.get(ProductFactory);
    await app.init();
  });

  test('[POST] /order/create', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const product = await productFactory.makePrismaProduct();
    const id = randomUUID();
    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .post(`/order/create`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: id,
        items: [
          {
            productId: product.id.toString(),
            quantity: 4,
          },
        ],
        idempotencyKey: randomUUID(),
        userId: user.id.toString(),
        address: 'something',
      });

    expect(response.statusCode).toBe(202);

    const orderOnDataBase = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    expect(orderOnDataBase).toBeTruthy();
    expect(orderOnDataBase.userId).toEqual(user.id.toString());
  });
});
