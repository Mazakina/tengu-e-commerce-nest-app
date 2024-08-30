import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CustomerFactory } from 'test/factories/make-customer';
import request from 'supertest';

describe('Create Address (E2E)', () => {
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

  test('[POST]/address/create ', async () => {
    const user = await customerFactory.makePrismaCustomer();
    console.log('reached');
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/address/create`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        street: 'teststreet',
        city: 'test_city',
        state: 'test_state',
        postalCode: 'test_postalCode',
        country: 'test_country',
        customerId: user.id.toString(),
      });

    expect(response.statusCode).toBe(201);

    const addressOnDatabase = await prisma.address.findFirst();
    expect(addressOnDatabase).toBeTruthy();
  });
});
