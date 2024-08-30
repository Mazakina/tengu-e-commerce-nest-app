import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../repositories/order-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { Order } from '@/domain/enterprise/entities/order';

interface ShipOrderUseCaseRequest {
  orderId: string;
}
type ShipOrderUseCaseResponse = Either<Error, { order: Order }>;

@Injectable()
export class ShipOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: ShipOrderUseCaseRequest): Promise<ShipOrderUseCaseResponse> {
    const order = await this.orderRepository.findByID(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    try {
      order.shipOrder();
      await this.orderRepository.update(order);
      return right({ order });
    } catch (e) {
      return left(new BadRequestException(e.message));
    }
  }
}
