import { Either, right } from '@/core/either';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';
import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderItemRepository } from '../../repositories/order-item-repository';

interface CreateOrderItemUseCaseRequest {
  productId: string;
  quantity: number;
  price: number;
  orderId: string;
}

type CreateOrderItemUseCaseResponse = Either<
  BadRequestException,
  { orderItem: OrderItem }
>;

@Injectable()
export class CreateOrderItemUseCase {
  constructor(private orderItemRepository: OrderItemRepository) {}

  async execute({
    productId,
    quantity,
    price,
    orderId,
  }: CreateOrderItemUseCaseRequest): Promise<CreateOrderItemUseCaseResponse> {
    const orderItem = OrderItem.create({ orderId, productId, quantity, price });

    await this.orderItemRepository.create(orderItem);

    return right({ orderItem });
  }
}
