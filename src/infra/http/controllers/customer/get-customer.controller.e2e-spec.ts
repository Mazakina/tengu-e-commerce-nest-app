import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';

describe('Get Customer (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let customerFactory: CustomerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [CustomerFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);

    await app.init();
  });

  test('[GET] /accounts/:slug', async () => {
    const user = await customerFactory.makePrismaCustomer({
      name: 'John Doe',
      email: 'Jhondoe@example.com',
      password: '123456',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/customer/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      customer: expect.objectContaining({
        name: 'John Doe',
        email: 'Jhondoe@example.com',
      }),
    });
  });
});
