import { Either, left, right } from '@/core/either';
import { OrderRepository } from '../../repositories/order-repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from '@/domain/enterprise/entities/order';

type DeliverOrderUseCaseResponse = Either<Error, { order: Order }>;

@Injectable()
export class DeliverOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(orderID: string): Promise<DeliverOrderUseCaseResponse> {
    const order = await this.orderRepository.findByID(orderID);

    if (!order) {
      return left(new NotFoundException());
    }

    try {
      order.deliverOrder();
      await this.orderRepository.update(order);
    } catch (e) {
      console.log(e.message);
      return left(new BadRequestException(e.message));
    }
    return right({ order });
  }
}
