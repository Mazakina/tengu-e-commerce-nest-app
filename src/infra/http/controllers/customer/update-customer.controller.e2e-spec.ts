import { AppModule } from '@/app.module';
import { delay } from '@/core/delay';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CustomerFactory } from 'test/factories/make-customer';

describe('Update Customer (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let customerFactory: CustomerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [CustomerFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);

    await app.init();
  });

  test('[Patch] /customer/:id', async () => {
    const user = await customerFactory.makePrismaCustomer();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .patch(`/customer/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'Jhone@example.com',
        password: '123123',
      });
    expect(response.statusCode).toBe(200);

    await delay(200);
    const userOnDataBase = await prisma.user.findUnique({
      where: {
        email: 'Jhone@example.com',
      },
    });
    expect(userOnDataBase).toBeTruthy();
  });
});
