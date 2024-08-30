import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CustomerFactory } from 'test/factories/make-customer';
import request from 'supertest';
import { AddressFactory } from 'test/factories/make-address';

describe('Get Address By Id(E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let customerFactory: CustomerFactory;
  let addressFactory: AddressFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [CustomerFactory, PrismaService, AddressFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    addressFactory = moduleRef.get(AddressFactory);

    await app.init();
  });

  test('[GET]/address/:id ', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const address = await addressFactory.makePrismaAddress({
      street: 'test_street',
      customerId: user.id.toString(),
    });
    const response = await request(app.getHttpServer())
      .get(`/address/${address.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(202);

    expect(response.body.address.props.street).toEqual('test_street');
  });
});
