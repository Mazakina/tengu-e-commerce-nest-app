import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CustomerFactory } from 'test/factories/make-customer';
import request from 'supertest';
import { AddressFactory } from 'test/factories/make-address';

describe('Fetch Address By User Id (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let customerFactory: CustomerFactory;
  let prisma: PrismaService;
  let addressFactory: AddressFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [CustomerFactory, PrismaService, AddressFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    prisma = moduleRef.get(PrismaService);
    addressFactory = moduleRef.get(AddressFactory);

    await app.init();
  });

  test('[GET]/user/address/:slug ', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const accessToken = jwtService.sign({ sub: user.id.toString() });
    await addressFactory.makePrismaAddress({
      street: 'test_street',
      customerId: user.id.toString(),
    });
    await addressFactory.makePrismaAddress({
      street: 'test_street2',
      customerId: user.id.toString(),
    });
    const response = await request(app.getHttpServer())
      .get(`/user/address/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(202);

    const addressOnDatabase = await prisma.address.findMany({
      where: {
        userId: user.id.toString(),
      },
    });

    expect(addressOnDatabase.length).toEqual(2);
  });
});
