import { CustomerRepository } from '@/domain/application/repositories/customer-repository';
import { Customer } from '@/domain/enterprise/entities/customer';
import { PrismaCustomerMapper } from '../mapper/prisma-customer-mapper';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Customer | null> {
    const data = await this.prisma.user.findUnique({
      where: { email },
      include: { Address: true },
    });
    if (!data) {
      return null;
    }
    const customer = PrismaCustomerMapper.toDomain(data);
    return customer;
  }

  async findByID(id: string): Promise<Customer | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
      include: { Address: true },
    });
    if (!data) {
      return null;
    }
    const customer = PrismaCustomerMapper.toDomain(data);
    return customer;
  }
  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(customer);
    await this.prisma.user.create({ data });
  }

  async save(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(customer);
    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
