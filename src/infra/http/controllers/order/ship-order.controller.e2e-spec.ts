import { AppModule } from '@/app.module';
import { OrderStatus } from '@/domain/enterprise/entities/order';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';
import { OrderFactory } from 'test/factories/make-order';

describe('Ship Order (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let customerFactory: CustomerFactory;
  let orderFactory: OrderFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, CustomerFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    orderFactory = moduleRef.get(OrderFactory);
    await app.init();
  });

  test('[POST] /order/ship/:orderId', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const order = await orderFactory.makePrismaOrder({
      userId: user.id.toString(),
      status: OrderStatus.confirmed,
    });
    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .patch(`/order/ship/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    const orderOnDataBase = await prisma.order.findFirst({
      where: {
        status: OrderStatus.shipped,
      },
    });

    expect(orderOnDataBase).toBeTruthy();
    expect(orderOnDataBase.userId).toEqual(user.id.toString());
  });
});
