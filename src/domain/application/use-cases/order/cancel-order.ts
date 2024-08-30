import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../../repositories/order-repository';
import { Order, OrderStatus } from '@/domain/enterprise/entities/order';
import { Either, left, right } from '@/core/either';

interface CancelOrderRequest {
  orderId: string;
}

type CancelOrderResponse = Either<Error, { order: Order }>;

@Injectable()
export class CancelOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId }: CancelOrderRequest): Promise<CancelOrderResponse> {
    const order = await this.orderRepository.findByID(orderId);

    if (!order) {
      return left(new NotFoundException('Order not found'));
    }
    switch (order.status) {
      case OrderStatus.cancelled:
        return left(new BadRequestException('Order is already cancelled'));
      case OrderStatus.delivered:
        return left(
          new BadRequestException('Delivered orders cannot be cancelled.'),
        );
    }
    order.cancelOrder();

    await this.orderRepository.update(order);
    console.log('here');
    return right({ order });
  }
}
