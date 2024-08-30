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

describe('Confirm Order (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let customerFactory: CustomerFactory;
  let orderFactory: OrderFactory;
  let productFactory: ProductFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, CustomerFactory, OrderFactory, ProductFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    orderFactory = moduleRef.get(OrderFactory);
    productFactory = moduleRef.get(ProductFactory);
    await app.init();
  });

  test('[POST] /order/confirm/:id', async () => {
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
        status: OrderStatus.pending,
        items: [orderItem],
      },
      new UniqueEntityID(id),
    );

    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .patch(`/order/confirm/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    const orderOnDataBase = await prisma.order.findFirst({
      where: {
        id,
      },
    });

    expect(orderOnDataBase).toBeTruthy();
    expect(orderOnDataBase.status).toEqual(OrderStatus.confirmed);
  });
});
