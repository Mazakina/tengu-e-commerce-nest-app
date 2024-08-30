import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../../repositories/order-repository';
import { Either, left, right } from '@/core/either';
import { Order } from '@/domain/enterprise/entities/order';

type GetOrderByIDUseCaseResponse = Either<NotFoundException, { order: Order }>;

@Injectable()
export class GetOrderByIDUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(orderID: string): Promise<GetOrderByIDUseCaseResponse> {
    const order = await this.orderRepository.findByID(orderID);

    if (!order) {
      return left(new NotFoundException());
    }

    return right({ order });
  }
}
