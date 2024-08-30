import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CustomerFactory } from 'test/factories/make-customer';
import request from 'supertest';

describe('Create Cart (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let customerFactory: CustomerFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [CustomerFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST]/cart/create/:userId ', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/cart/create/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(201);

    const cartOnDatabase = await prisma.cart.findFirst();
    expect(cartOnDatabase).toBeTruthy();
  });
});
