import { Either, left, right } from '@/core/either';
import { OrderRepository } from '../../repositories/order-repository';
import { Order } from '@/domain/enterprise/entities/order';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product-repository';
interface ConfirmOrderUseCaseRequest {
  orderId: string;
}
type ConfirmOrderUseCaseResponse = Either<Error, { order: Order }>;

@Injectable()
export class ConfirmOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    orderId,
  }: ConfirmOrderUseCaseRequest): Promise<ConfirmOrderUseCaseResponse> {
    const order = await this.orderRepository.findByID(orderId);

    if (!order) {
      return left(new NotFoundException());
    }

    for (const item of order.items) {
      const product = await this.productsRepository.findByID(item.productId);

      if (!product || item.quantity > product.stock) {
        // add triger event to remove product
        return left(
          new BadRequestException(
            `Not enought stock for product ${item.productId}`,
          ),
        );
      }
    }

    try {
      order.confirmOrder();

      await this.orderRepository.update(order);

      return right({ order });
    } catch (error) {
      return left(new BadRequestException(error.message));
    }
  }
}
