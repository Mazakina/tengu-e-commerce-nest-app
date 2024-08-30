import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../../repositories/order-repository';
import { Either, left, right } from '@/core/either';
import { Order } from '@/domain/enterprise/entities/order';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';

interface ModifyOrderDetailsRequest {
  id: string;
  items?: OrderItem[];
  address?: string;
}
type ModifyOrderDetailsResponse = Either<
  NotFoundException | BadRequestException,
  { order: Order }
>;

@Injectable()
export class ModifyOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    id,
    items,
    address,
  }: ModifyOrderDetailsRequest): Promise<ModifyOrderDetailsResponse> {
    const order = await this.orderRepository.findByID(id);

    if (!order) {
      return left(new NotFoundException('Order not found'));
    }

    if (order.status === 'cancelled') {
      return left(new BadRequestException(`Can't update cancelled orders `));
    }
    if (!items && !address) {
      return left(new BadRequestException('Invalid request'));
    }

    order.items = items ?? order.items;

    order.address = address ?? order.address;

    await this.orderRepository.update(order);

    return right({ order });
  }
}
