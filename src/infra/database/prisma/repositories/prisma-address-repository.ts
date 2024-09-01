import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddressRepository } from '@/domain/application/repositories/address-repository';
import { Address } from '@/domain/enterprise/entities/address';
import { PrismaAddressMapper } from '../mapper/prisma-address-mapper';

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaService) {}
  async findByUserID(userId: string): Promise<Address[]> {
    const result = await this.prisma.address.findMany({
      where: {
        userId: userId,
      },
    });

    const address = result.map((value) => PrismaAddressMapper.toDomain(value));
    return address;
  }

  async create(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPersistence(address);
    await this.prisma.address.create({
      data,
    });
  }
  async delete(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: {
        id,
      },
    });
  }

  async findByID(id: string): Promise<Address> {
    const result = await this.prisma.address.findUnique({
      where: {
        id: id,
      },
    });
    return PrismaAddressMapper.toDomain(result);
  }

  async save(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPersistence(address);
    await this.prisma.address.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
