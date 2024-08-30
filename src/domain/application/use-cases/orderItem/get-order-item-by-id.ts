import { Either, left, right } from '@/core/either';
import { OrderItemRepository } from '../../repositories/order-item-repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';

type GetOrderItemByIdUseCaseResponse = Either<Error, { orderItem: OrderItem }>;

@Injectable()
export class GetOrderItemByIdUseCase {
  constructor(private orderItemRepository: OrderItemRepository) {}

  async execute(id: string): Promise<GetOrderItemByIdUseCaseResponse> {
    const result = await this.orderItemRepository.getOrderItemById(id);

    if (!result) {
      return left(new NotFoundException());
    }

    return right({ orderItem: result });
  }
}
