import { CartItemRepository } from '@/domain/application/repositories/cart-item-repository';
import { CartItem } from '@/domain/enterprise/entities/cartItem';
import { PrismaService } from '../prisma.service';
import { PrismaCartItemMapper } from '../mapper/prisma-cart-item-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaCartItemRepository implements CartItemRepository {
  constructor(private prisma: PrismaService) {}
  async create(cartItem: CartItem): Promise<void> {
    const data = PrismaCartItemMapper.toPersistance(cartItem);

    await this.prisma.cartItem.create({
      data,
    });
  }
  async update(cartItem: CartItem): Promise<void> {
    const data = PrismaCartItemMapper.toPersistance(cartItem);

    await this.prisma.cartItem.upsert({
      create: data,
      where: {
        id: data.id,
      },
      update: data,
    });
  }
  async get(id: string): Promise<CartItem> {
    const data = await this.prisma.cartItem.findUnique({
      where: { id },
    });

    const result = PrismaCartItemMapper.toDomain(data);

    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cartItem.delete({
      where: { id },
    });
  }
}
