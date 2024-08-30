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

describe('Get order item by id (E2E)', () => {
  let app: INestApplication;
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
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    orderFactory = moduleRef.get(OrderFactory);
    productFactory = moduleRef.get(ProductFactory);
    await app.init();
  });

  test('[GET] /order/items/:orderId', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const product = await productFactory.makePrismaProduct();
    const product_2 = await productFactory.makePrismaProduct();
    const id = randomUUID();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const orderItem = makeOrderItem({
      productId: product.id.toString(),
      price: product.price,
      quantity: 3,
      orderId: id,
    });
    const orderItem_2 = makeOrderItem({
      productId: product_2.id.toString(),
      price: product_2.price,
      quantity: 2,
      orderId: id,
    });

    await orderFactory.makePrismaOrder(
      {
        userId: user.id.toString(),
        status: OrderStatus.pending,
        items: [orderItem, orderItem_2],
      },
      new UniqueEntityID(id),
    );
    const response = await request(app.getHttpServer())
      .get(`/order/item/${orderItem.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    console.log(response.body.orderItem._id.value);
    expect(response.body.orderItem._id.value).toEqual(orderItem.id.toString());
  });
});
