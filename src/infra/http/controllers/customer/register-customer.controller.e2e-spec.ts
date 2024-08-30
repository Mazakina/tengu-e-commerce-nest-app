import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Register Customer (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /customer/create', async () => {
    const response = await request(app.getHttpServer())
      .post('/customer/create')
      .send({
        name: 'John Doe',
        email: 'Jhondoe@example.com',
        password: '123123',
      });

    expect(response.statusCode).toBe(201);

    const userOnDataBase = await prisma.user.findUnique({
      where: {
        email: 'Jhondoe@example.com',
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});
