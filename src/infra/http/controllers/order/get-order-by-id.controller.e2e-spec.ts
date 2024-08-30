import { AppModule } from '@/app.module';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { OrderStatus } from '@/domain/enterprise/entities/order';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';
import { OrderFactory } from 'test/factories/make-order';
import { makeOrderItem } from 'test/factories/make-order-item';
import { ProductFactory } from 'test/factories/make-products';

describe('Get Order by Id (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let customerFactory: CustomerFactory;
  let orderFactory: OrderFactory;
  let productFactory: ProductFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, CustomerFactory, ProductFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    productFactory = moduleRef.get(ProductFactory);
    orderFactory = moduleRef.get(OrderFactory);
    await app.init();
  });

  test('[POST] order/:orderId', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const product = await productFactory.makePrismaProduct();
    const id = randomUUID();
    const orderItem = makeOrderItem({
      productId: product.id.toString(),
      price: product.price,
      quantity: 3,
      orderId: id,
    });

    const order = await orderFactory.makePrismaOrder(
      {
        userId: user.id.toString(),
        status: OrderStatus.shipped,
        items: [orderItem],
      },
      new UniqueEntityID(id),
    );

    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .get(`/order/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      order: expect.objectContaining({
        userId: user.id.toString(),
      }),
    });
  });
});
