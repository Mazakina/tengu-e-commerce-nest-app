import { Either, left, right } from '@/core/either';
import { Order, OrderStatus } from '@/domain/enterprise/entities/order';
import { OrderRepository } from '../../repositories/order-repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UniqueEntityID } from '@/core/primitives/unique-entity-id';
import { OrderItem } from '@/domain/enterprise/entities/orderItem';
import { ProductsRepository } from '../../repositories/product-repository';
import { OutOfStockError } from '../errors/out-of-stock-error';

interface orderItemDetails {
  productId: string;
  quantity: number;
}

interface CreateOrderUseCaseRequest {
  itemsDetails: orderItemDetails[];
  address: string;
  status?: OrderStatus;
  idempotencyKey: UniqueEntityID;
  id?: string;
  userId: string;
}

type CreateOrderUseCaseResponse = Either<
  OutOfStockError | NotFoundException,
  { order: Order }
>;

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductsRepository,
  ) {}

  async execute({
    id,
    itemsDetails,
    address,
    status,
    idempotencyKey,
    userId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const EntityId = new UniqueEntityID(id);
    const existingOrder =
      await this.orderRepository.IdempotencyKeyAlreadyExists(idempotencyKey);

    if (existingOrder) {
      return left(new BadRequestException('Duplicate request'));
    }

    const items: OrderItem[] = [];

    const order = Order.create(
      { items, address, status, idempotencyKey, userId },
      EntityId,
    );

    for (const item of itemsDetails) {
      const response = await this.productRepository.findByID(item.productId);
      if (!response) {
        return left(
          new NotFoundException(`Product with ID ${item.productId} not found`),
        );
      }

      if (response.stock < item.quantity) {
        return left(new OutOfStockError(``));
      }

      const orderItem = OrderItem.create({
        orderId: order.id.toString(),
        productId: item.productId,
        quantity: item.quantity,
        price: response.price,
      });
      order.items = [...order.items, orderItem];
    }

    order.dispatch();
    await this.orderRepository.create(order);

    return right({ order });
  }
}
