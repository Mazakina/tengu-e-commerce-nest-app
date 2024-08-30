import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CustomerFactory } from 'test/factories/make-customer';
import request from 'supertest';
import { AddressFactory } from 'test/factories/make-address';
import { delay } from '@/core/delay';

describe('Update Address (E2E)', () => {
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

  test('[PUT]/address/:slug ', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const address = await addressFactory.makePrismaAddress({
      city: 'test_city',
      customerId: user.id.toString(),
    });
    const response = await request(app.getHttpServer())
      .put(`/address/${address.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: address.id.toString(),
        street: 'updated',
      });

    expect(response.statusCode).toBe(202);

    delay(300);
    const addressOnDatabase = await prisma.address.findFirst({
      where: {
        street: 'updated',
      },
    });

    expect(addressOnDatabase.street).toEqual('updated');
  });
});
