import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository';
import { ProductsRepository } from '@/domain/application/repositories/product-repository';
import { AddressRepository } from '@/domain/application/repositories/address-repository';
import { PrismaAddressRepository } from './prisma/repositories/prisma-address-repository';
import { PrismaCartRepository } from './prisma/repositories/prisma-cart-repository';
import { CartRepository } from '@/domain/application/repositories/cart-repository';
import { PrismaCustomerRepository } from './prisma/repositories/prisma-customer-repository';
import { CustomerRepository } from '@/domain/application/repositories/customer-repository';
import { OrderRepository } from '@/domain/application/repositories/order-repository';
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository';
import { CartItemRepository } from '@/domain/application/repositories/cart-item-repository';
import { PrismaCartItemRepository } from './prisma/repositories/prisma-cart-item-repository';
import { OrderItemRepository } from '@/domain/application/repositories/order-item-repository';
import { PrismaOrderItemRepository } from './prisma/repositories/prisma-order-item-repository';

@Module({
  providers: [
    PrismaService,
    { provide: ProductsRepository, useClass: PrismaProductsRepository },
    { provide: AddressRepository, useClass: PrismaAddressRepository },
    { provide: CartRepository, useClass: PrismaCartRepository },
    { provide: CustomerRepository, useClass: PrismaCustomerRepository },
    { provide: OrderRepository, useClass: PrismaOrderRepository },
    { provide: OrderItemRepository, useClass: PrismaOrderItemRepository },
    { provide: CartItemRepository, useClass: PrismaCartItemRepository },
  ],
  exports: [
    PrismaService,
    CustomerRepository,
    ProductsRepository,
    AddressRepository,
    CartRepository,
    OrderItemRepository,
    OrderRepository,
    CartItemRepository,
  ],
})
export class DatabaseModule {}
