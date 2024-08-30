import { OrderItem } from '@/domain/enterprise/entities/orderItem';

export abstract class OrderItemRepository {
  abstract create(orderItem: OrderItem): Promise<void>;
  abstract getOrderItemById(id: string): Promise<OrderItem>;
  abstract fetchOrderItemByOrderId(id: string): Promise<OrderItem[]>;
}
