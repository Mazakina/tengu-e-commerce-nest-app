import { Either, left, right } from '@/core/either';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';
import { Injectable, NotFoundException } from '@nestjs/common';

import { OrderItemRepository } from '../../repositories/order-item-repository';
type FetchOrderItemByOrderIdUseCaseResponse = Either<
  Error,
  { orderItems: OrderItem[] }
>;

@Injectable()
export class FetchOrderItemByOrderIdUseCase {
  constructor(private orderItemRepository: OrderItemRepository) {}
  async execute(id: string): Promise<FetchOrderItemByOrderIdUseCaseResponse> {
    const result = await this.orderItemRepository.fetchOrderItemByOrderId(id);

    if (!result[0]) {
      return left(new NotFoundException());
    }

    return right({ orderItems: result });
  }
}
