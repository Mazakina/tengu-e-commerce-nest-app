import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { CustomerFactory } from 'test/factories/make-customer';
import request from 'supertest';
import { CartFactory } from 'test/factories/make-cart';
import { ProductFactory } from 'test/factories/make-products';

describe('Add item to Cart (E2E)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let customerFactory: CustomerFactory;
  let prisma: PrismaService;
  let cartFactory: CartFactory;
  let productFactory: ProductFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [CustomerFactory, PrismaService, CartFactory, ProductFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    customerFactory = moduleRef.get(CustomerFactory);
    prisma = moduleRef.get(PrismaService);
    cartFactory = moduleRef.get(CartFactory);
    productFactory = moduleRef.get(ProductFactory);

    await app.init();
  });

  test('[POST]/cart/clean/:id ', async () => {
    const user = await customerFactory.makePrismaCustomer();
    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const product = await productFactory.makePrismaProduct();

    const cart = await cartFactory.makePrismaCart({
      userId: user.id.toString(),
    });

    const response = await request(app.getHttpServer())
      .put(`/cart/item`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: user.id.toString(),
        itemId: product.id.toString(),
        quantity: 2,
      });

    expect(response.statusCode).toBe(202);

    const cartOnDatabase = await prisma.cart.findFirst({
      where: {},
      include: { CartItem: true },
    });
    expect(cartOnDatabase.CartItem.length).toEqual(1);
    expect(cartOnDatabase.CartItem[0]).toEqual(
      expect.objectContaining({
        productId: product.id.toString(),
        quantity: 2,
        cartId: cart.id.toString(),
      }),
    );
  });
});
