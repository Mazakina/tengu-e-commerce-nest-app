import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';

describe('Authenticate Customer (E2E)', () => {
  let app: INestApplication;
  let customerFactory: CustomerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [CustomerFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    customerFactory = moduleRef.get(CustomerFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await customerFactory.makePrismaCustomer({
      name: 'John Doe',
      email: 'Jhondoe@example.com',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer()).post(`/sessions`).send({
      email: 'Jhondoe@example.com',
      password: '123456',
    });
    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
