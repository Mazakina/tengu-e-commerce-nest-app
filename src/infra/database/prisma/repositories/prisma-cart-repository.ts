import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CartRepository } from '@/domain/application/repositories/cart-repository';
import { Cart } from '@/domain/enterprise/entities/cart';
import { PrismaCartMapper } from '../mapper/prisma-cart-mapper';

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(private prisma: PrismaService) {}

  async clean(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  }
  async findByID(id: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: { CartItem: true },
    });

    if (!cart) {
      return null;
    }

    const cartDetails = PrismaCartMapper.toDomain(cart);

    return cartDetails;
  }
  async findByUserID(userId: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId: userId },
      include: { CartItem: true },
    });

    if (!cart) {
      return null;
    }

    const cartsDetails = PrismaCartMapper.toDomain(cart);

    return cartsDetails;
  }

  async create(cart: Cart): Promise<void> {
    const data = PrismaCartMapper.toPersistence(cart);
    await this.prisma.cart.create({ data });
  }

  async save(cart: Cart): Promise<void> {
    const data = PrismaCartMapper.toPersistence(cart);
    const id = data.id;
    await this.prisma.cart.update({
      where: {
        id,
      },
      data,
    });
  }
}
