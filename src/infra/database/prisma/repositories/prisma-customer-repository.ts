import { CustomerRepository } from '@/domain/application/repositories/customer-repository';
import { Customer } from '@/domain/enterprise/entities/customer';
import { PrismaCustomerMapper } from '../mapper/prisma-customer-mapper';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/infra/cache/cache-repository';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async findByEmail(email: string): Promise<Customer | null> {
    const cacheHit = await this.cache.get(`customer:${email}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);
      return PrismaCustomerMapper.fromCacheToDomain(cachedData);
    }
    const data = await this.prisma.user.findUnique({
      where: { email },
      include: { Address: true },
    });
    if (!data) {
      return null;
    }
    const customer = PrismaCustomerMapper.toDomain(data);

    await this.cache.set(
      `customer:${customer.email}:details`,
      JSON.stringify(customer),
    );

    return customer;
  }

  async findByID(id: string): Promise<Customer | null> {
    const cacheHit = await this.cache.get(`customer:${id}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);
      return PrismaCustomerMapper.fromCacheToDomain(cachedData);
    }
    const data = await this.prisma.user.findUnique({
      where: { id },
      include: { Address: true },
    });
    if (!data) {
      return null;
    }
    const customer = PrismaCustomerMapper.toDomain(data);

    await this.cache.set(`customer:${id}:details`, JSON.stringify(customer));
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
    await this.cache.delete(`customer:${customer.email}:details`);
  }
}
