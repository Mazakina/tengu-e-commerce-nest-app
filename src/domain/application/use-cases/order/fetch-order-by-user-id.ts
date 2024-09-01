import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../../repositories/order-repository';
import { Either, left, right } from '@/core/either';
import { Order } from '@/domain/enterprise/entities/order';

type FetchOrderByUserIDUseCaseResponse = Either<
  NotFoundException,
  { orders: Order[] }
>;

@Injectable()
export class FetchOrderByUserIDUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(userId: string): Promise<FetchOrderByUserIDUseCaseResponse> {
    const orders = await this.orderRepository.findByUserID(userId);
    if (!orders[0]) {
      return left(new NotFoundException());
    }

    return right({ orders });
  }
}
